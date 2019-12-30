"use strict";

require("dotenv").config();

const Response = require("./response");

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

module.exports = class Menu {
  static handlePayload(payload, message) {
    let responses = [];

    if (payload === "MENU_SELECTED") {
      let text = Response.genText(
        "Please select from the following menu items:"
      );
      let menu = Response.genGenericCarouselTemplate([
        Response.genElements(
          "https://techcrunch.com/wp-content/uploads/2017/04/facebook-messenger-f8.jpg",
          "Menu A",
          "13.00",
          [
            Response.genPostbackButton("Select", {
              menu_name: "Menu A",
              price: "13.00"
            })
          ]
        ),
        Response.genElements(
          "https://techcrunch.com/wp-content/uploads/2017/04/facebook-messenger-f8.jpg",
          "Menu B",
          "14.00",
          [
            Response.genPostbackButton("Select", {
              menu_name: "Menu B",
              price: "14.00"
            })
          ]
        ),
        Response.genElements(
          "https://techcrunch.com/wp-content/uploads/2017/04/facebook-messenger-f8.jpg",
          "Menu C",
          "12.40",
          [
            Response.genPostbackButton("Select", {
              menu_name: "Menu C",
              price: "12.40"
            })
          ]
        )
      ]);
      responses.push(text);
      responses.push(menu);
    } else {
      let text = Response.genText(`You have selected ${payload.menu_name}.`);
      let buttons = Response.genButtonTemplate(
        "Please select from the following options",
        [
          Response.genPostbackButton("Update Location", "LOCATION_SELECTED"),
          Response.genPostbackButton("Update Menu", "MENU_SELECTED"),
          Response.genPostbackButton("Finalise Payment", "PAYMENT_SELECTED")
        ]
      );
      responses.push(text);
      responses.push(buttons);
    }

    return responses;
  }
};
