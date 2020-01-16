"use strict";

require("dotenv").config();

// Imports dependencies and set up http server
const express = require("express"),
  Receive = require("./services/receive"),
  Database = require("./services/database"),
  Profile = require("./services/profile"),
  bodyParser = require("body-parser"),
  MongoClient = require("mongodb").MongoClient,
  ejs = require("ejs"),
  app = express().use(bodyParser.json());

var db;
var database;

MongoClient.connect(
  "mongodb+srv://leroment:db12345678@utslatenightfood-px2cd.mongodb.net/utslatenightfood",
  function(err, server) {
    if (err) {
      console.log("database error!");
      console.log(err);
      return;
    }
    console.log("Database success!");

    db = server.db("utslatenightfood");

    Database.database = db;

    app.set("view engine", "ejs");

    // Sets server port and logs message on sucess
    app.listen(process.env.PORT || 8000, () =>
      console.log("webhook is listening")
    );

    app.use(express.static("public"));
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

    res.render("public/paypal.ejs");
  }
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
