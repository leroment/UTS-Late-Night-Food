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

    let response;

    try {
      if (event.message) {
        let message = event.message;

        if (message.quick_reply) {
          //   response = this.handleQuickReply();
        } else if (message.attachments) {
          //   response = this.handleAttachmentMessage();
        } else if (message.text) {
          response = this.handleTextMessage();
        }
      } else if (event.postback) {
        // response = this.handlePostback();
      } else if (event.referral) {
        // response = this.handleReferral();
      }
    } catch (error) {
      console.error(error);
      response = {
        text: `An error has occured: '${error}'. We have been notified and \
        will fix the issue shortly!`
      };
    }

    this.sendMessage(this.psid, response);
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
