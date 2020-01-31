"use strict";

require("dotenv").config();

// Imports dependencies and set up http server
const express = require("express"),
  Receive = require("./services/receive"),
  Database = require("./services/database"),
  Profile = require("./services/profile"),
  Order = require("./services/order"),
  bodyParser = require("body-parser"),
  MongoClient = require("mongodb").MongoClient,
  ejs = require("ejs"),
  // paypal = require("paypal-rest-sdk"),
  paypal = require("@paypal/checkout-server-sdk"),
  app = express().use(bodyParser.json());

var db;
var database;

// paypal.configure({
//   mode: "sandbox", // sandbox or live
//   client_id:
//     "AYGzo46fbPHLAjdQc5yn-SkfWnQs5t-DejtabGL4fq1Y8ORdQBKUn5rTXkG1KepVPRiVrXKNMYDv6QZs",
//   client_secret:
//     "EM5Xc42D8wtCs0cI7wiVbeEfjX2h6Ki_xFgi7EWLEDWMgll-UUuX78f3cNjaMpQOmixBd-Agkqiff1rX"
// });

// Creating an environment
let clientId =
  "AYGzo46fbPHLAjdQc5yn-SkfWnQs5t-DejtabGL4fq1Y8ORdQBKUn5rTXkG1KepVPRiVrXKNMYDv6QZs";
let clientSecret =
  "EM5Xc42D8wtCs0cI7wiVbeEfjX2h6Ki_xFgi7EWLEDWMgll-UUuX78f3cNjaMpQOmixBd-Agkqiff1rX";
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

MongoClient.connect(
  "mongodb+srv://leroment:db12345678@utslatenightfood-px2cd.mongodb.net/utslatenightfood",
  function(err, server) {
    if (err) {
      console.log("database error!");
      console.log(err);
      return;
    }
    console.log("Database success!!");

    db = server.db("utslatenightfood");

    Database.database = db;

    app.set("view engine", "ejs");

    // Sets server port and logs message on sucess
    app.listen(process.env.PORT || 8000, () =>
      console.log("webhook is listening")
    );

    // app.use(express.static("public"));
  }
);

// Serve the options path and set required headers
app.get("/paypal", (req, res, next) => {
  let referer = req.get("Referer");
  if (referer) {
    if (referer.indexOf("www.messenger.com") >= 0) {
      res.setHeader("X-Frame-Options", "ALLOW-FROM https://www.messenger.com/");
    } else if (referer.indexOf("www.facebook.com") >= 0) {
      res.setHeader("X-Frame-Options", "ALLOW-FROM https://www.facebook.com/");
    }

    res.render("paypal");
  }
});

// app.post("/pay", (req, res) => {
//   let order = Order.order;

//   const create_payment_json = {
//     intent: "sale",
//     payer: {
//       payment_method: "paypal"
//     },
//     redirect_urls: {
//       return_url: "https://utslatenightfood.herokuapp.com/success",
//       cancel_url: "https://utslatenightfood.herokuapp.com/cancel"
//     },
//     transactions: [
//       {
//         item_list: {
//           items: [
//             {
//               name: "Menu Item 1",
//               sku: "001",
//               price: "25.00",
//               currency: "AUD",
//               quantity: 1
//             }
//           ]
//         },
//         amount: {
//           currency: "AUD",
//           total: "25.00"
//         },
//         description: "Payment made for late night food"
//       }
//     ]
//   };

//   paypal.payment.create(create_payment_json, function(error, payment) {
//     if (error) {
//       throw error;
//     } else {
//       for (let i = 0; i < payment.links.length; i++) {
//         if (payment.links[i].rel === "approval_url") {
//           res.redirect(payment.links[i].href);
//         }
//       }
//     }
//   });
// });

// app.get("/success", (req, res) => {
//   const payerId = req.query.PayerID;
//   const paymentId = req.query.paymentId;

//   const execute_payment_json = {
//     payer_id: payerId,
//     transactions: [
//       {
//         amount: {
//           currency: "AUD",
//           total: "25.00"
//         }
//       }
//     ]
//   };

//   paypal.payment.execute(paymentId, execute_payment_json, function(
//     error,
//     payment
//   ) {
//     if (error) {
//       console.log(error.response);
//       throw error;
//     } else {
//       console.log(JSON.stringify(payment));
//       res.send(200).json(payment);
//     }
//   });
// });

// app.get("/cancel", (req, res) => res.send("Cancelled"));

app.post("/paypal-transaction-complete", async function(req, res) {
  const orderID = req.body.orderID;

  // 3. Call PayPal to capture the order
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  // request.requestBody({});

  let order;
  try {
    //df
    order = client.execute(request);
    // const capture = await client.execute(request);

    // // 4. Save the capture ID to your database. Implement logic to save capture to your database for future reference.
    // const captureID = capture.result.purchase_units[0]
    //     .payments.captures[0].id;

    console.log("The order is: " + order);
  } catch (err) {
    // 5. Handle any errors from the call
    console.error(err);
    return res.send(500);
  }

  // 5. Validate the transaction details are as expected
  if (order.result.purchase_units[0].amount.value !== "0.01") {
    return res.send(400);
  }

  // 6. Return a successful response to the client
  res.send(200);
});

// Adds support for GET requests to our webhook
app.get("/webhook", (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "utslatenightfood";

  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

// Creates the endpoint for our webhook
app.post("/webhook", (req, res) => {
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === "page") {
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      // Gets the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log("Sender PSID: " + sender_psid);

      let receiveMessage = new Receive(sender_psid, webhook_event);
      return receiveMessage.handleMessage();
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

app.get("/profile", (req, res) => {
  let token = req.query["hub.verify_token"];
  let mode = req.query["hub.mode"];
  let VERIFY_TOKEN = "utslatenightfood";

  let profile = new Profile();

  if (mode && token) {
    if (token === VERIFY_TOKEN) {
      if (mode == "profile" || mode == "all") {
        profile.setThread();
        res.write(`<p>Set Messenger Profile of Page ${config.pageId}</p>`);
      }
      res.status(200).end();
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  } else {
    // Returns a '404 Not Found' if mode or token are missing
    res.sendStatus(404);
  }
});
