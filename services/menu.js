"use strict";

require("dotenv").config();

const Response = require("./response");

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

module.exports = class Menu {
  static handlePayload(payload, message) {
    let response;

    if (payload === "MENU_SELECTED") {
      // response = Response.genGenericTemplate(
      //   "https://techcrunch.com/wp-content/uploads/2017/04/facebook-messenger-f8.jpg",
      //   "",
      //   "Yo",
      //   [Response.genPostbackButton("Select", "FOOD_SELECTED")]
      // );

      response = Response.genGenericCarouselTemplate([
        Response.genElements(
          "https://techcrunch.com/wp-content/uploads/2017/04/facebook-messenger-f8.jpg",
          "Menu A",
          "13.00",
          [Response.genPostbackButton("Select", "MENU_A_SELECTED")]
        ),
        Response.genElements(
          "https://techcrunch.com/wp-content/uploads/2017/04/facebook-messenger-f8.jpg",
          "Menu B",
          "14.00",
          [Response.genPostbackButton("Select", "MENU_B_SELECTED")]
        ),
        Response.genElements(
          "https://techcrunch.com/wp-content/uploads/2017/04/facebook-messenger-f8.jpg",
          "Menu C",
          "12.40",
          [Response.genPostbackButton("Select", "MENU_C_SELECTED")]
        )
      ]);
    }

    return response;
  }
};
