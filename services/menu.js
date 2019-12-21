"use strict";

require("dotenv").config();

const Response = require("./response");

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

module.exports = class Menu {
  static handlePayload(payload, message) {
    let response;

    if (payload === "MENU_SELECTED") {
      response = Response.genGenericTemplate(
        "https://techcrunch.com/wp-content/uploads/2017/04/facebook-messenger-f8.jpg",
        "Hi",
        "Yo",
        [this.genPostbackButton("Select", "FOOD_SELECTED")]
      );
    }

    return response;
  }
};
