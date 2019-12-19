"use strict";

require("dotenv").config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const Response = require("./response"),
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
          //   responses = this.handleQuickReply();
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
        text: `An error has occured: '${error}'. We have been notified and \
        will fix the issue shortly!`
      };
    }

    if (Array.isArray(responses)) {
      let delay = 0;
      for (let response of responses) {
        this.sendMessage(response, delay * 2000);
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
    if (postback.referral && postback.referral.type == "OPEN_THREAD") {
      payload = postback.referral.ref;
    } else {
      // Get the payload of the postback
      payload = postback.payload;
    }
    return this.handlePayload(payload.toUpperCase());
  }

  handlePayload(payload) {
    console.log("Received Payload:", `${payload}`);

    let response;

    if (payload === "GET_STARTED") {
      response = Response.genNuxMessage();
    }

    return response;
  }

  // Handles messages events with text
  handleTextMessage() {
    let message = this.webhookEvent.message.text.trim().toLowerCase();

    console.log(message);

    let response;

    response = Response.genText("HELLO!!! This is a robot generated message!");

    return response;
  }

  // Sends response messages via the Send API
  sendMessage(sender_psid, response) {
    // Construct the message body
    let request_body = {
      recipient: {
        id: sender_psid
      },
      message: response
    };

    // Send the HTTP request to the Messenger Platform
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
  }
};
