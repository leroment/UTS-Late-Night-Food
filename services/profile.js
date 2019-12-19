"use strict";

require("dotenv").config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

module.exports = class Profile {
  setThread() {
    let profilePayload = {
      ...this.getGetStarted(),
      ...this.getGreeting()
    };

    this.callMessengerProfileAPI(profilePayload);
  }

  getGetStarted() {
    return {
      get_started: {
        payload: "START ORDERING!"
      }
    };
  }

  getGreeting() {
    let greetings = [];

    greetings.push(this.getGreetingText());

    return {
      greeting: greetings
    };
  }

  getGreetingText() {
    let localizedGreeting = {
      locale: "en_US",
      text: "Hi, my name is Andrew"
    };

    console.log(localizedGreeting);
    return localizedGreeting;
  }

  callMessengerProfileAPI(requestBody) {
    // Send the HTTP request to the Messenger Profile API

    console.log(`Setting Messenger Profile for app ${config.appId}`);
    request(
      {
        uri: "https://graph.facebook.com/me/messenger_profile",
        qs: {
          access_token: PAGE_ACCESS_TOKEN
        },
        method: "POST",
        json: requestBody
      },
      (error, _res, body) => {
        if (!error) {
          console.log("Request sent:", body);
        } else {
          console.error("Unable to send message:", error);
        }
      }
    );
  }
};
