"use strict";

require("dotenv").config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const Response = require("./response"),
  Location = require("./location"),
  Menu = require("./menu"),
  Order = require("./order"),
  request = require("request");

module.exports = class Receive {
  constructor(psid, webhookEvent) {
    this.psid = psid;
    this.webhookEvent = webhookEvent;
  }

  // Check if the event is a message or postback and
  // call the appropriate handler function
  handleMessage() {
    let event = this.webhookEvent;

    let responses;

    try {
      if (event.message) {
        let message = event.message;

        if (message.quick_reply) {
          responses = this.handleQuickReply();
        } else if (message.attachments) {
          //   responses = this.handleAttachmentMessage();
        } else if (message.text) {
          responses = this.handleTextMessage();
        }
      } else if (event.postback) {
        responses = this.handlePostback();
      } else if (event.referral) {
        // responses = this.handleReferral();
      }
    } catch (error) {
      console.error(error);
      responses = {
        text: `An error has occured: '${error}'. We have been notified and
        will fix the issue shortly!`
      };
    }

    if (Array.isArray(responses)) {
      let delay = 0;
      for (let response of responses) {
        this.sendMessage(response, delay * 1000);
        delay++;
      }
    } else {
      this.sendMessage(responses);
    }
  }

  // Handles postbacks events
  handlePostback() {
    let postback = this.webhookEvent.postback;
    // Check for the special Get Starded with referral
    let payload;
    let title;
    if (postback.referral && postback.referral.type == "OPEN_THREAD") {
      payload = postback.referral.ref;
      title = postback.title;
    } else {
      // Get the payload of the postback
      payload = postback.payload;
      title = postback.title;
    }
    return this.handlePayload(payload.toUpperCase(), title);
  }

  handlePayload(payload, title) {
    console.log("Received Payload:", `${payload}`);

    let response;

    if (payload === "GET_STARTED") {
      response = Response.genNuxMessage();
    } else if (payload.includes("LOCATION")) {
      response = Location.handlePayload(payload);
    } else if (payload.includes("MENU")) {
      response = Menu.handlePayload(payload, title);
      else if (payload.includes("ORDER")) {
        response = Order.handlePayload(payload);
      }
    } else {
      response = {
        text: `This is a default postback message for payload: ${payload}!`
      };
    }

    return response;
  }

  // Handles mesage events with quick replies
  handleQuickReply() {
    // Get the payload of the quick reply
    let payload = this.webhookEvent.message.quick_reply.payload;

    let message = this.webhookEvent.message;

    let response;

    if (payload.includes("LOCATION")) {
      response = Location.handlePayload(payload, message);
    }
    return response;
  }

  // Handles messages events with text
  handleTextMessage() {
    let message = this.webhookEvent.message.text.trim().toLowerCase();
    let response;

    if (Number(message)) {
      response = Order.handlePayload("NUMBEROFORDERS", Number(message));
    } else {
      response = Response.genText(
        "HELLO!!! This is a robot generated message!"
      );
    }

    return response;
  }

  // Sends response messages via the Send API
  sendMessage(response, delay = 0) {
    // Construct the message body
    let request_body = {
      recipient: {
        id: this.psid
      },
      message: response
    };

    setTimeout(() => {
      request(
        {
          uri: "https://graph.facebook.com/v2.6/me/messages",
          qs: {
            access_token: PAGE_ACCESS_TOKEN
          },
          method: "POST",
          json: request_body
        },
        (err, res, body) => {
          if (!err) {
            console.log("message sent!");
          } else {
            console.error("Unable to send message:" + err);
          }
        }
      );
    }, delay);

    // Send the HTTP request to the Messenger Platform
  }
};
