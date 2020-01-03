"use strict";

const Response = require("./response"),
  Order = require("./order");

module.exports = class Menu {
  static handlePayload(payload, message = "") {
    let responses = [];

    if (payload === "MENU_SELECTED") {
      responses = this.generateMenu();
    } else {
      let text = Response.genText(`You have selected ${message}.`);
      // assign dish property to order class
      Order.dish = message;

      let number = Response.genText("How many?");

      responses.push(text);
      responses.push(number);
    }

    return responses;
  }

  static generateMenu() {
    let responses = [];

    let text = Response.genText("Please select from the following menu items:");
    let menu = Response.genGenericCarouselTemplate([
      Response.genElements(
        "https://techcrunch.com/wp-content/uploads/2017/04/facebook-messenger-f8.jpg",
        "Menu A",
        "13.00",
        [Response.genPostbackButton("Menu A", "MENU_A_SELECTED")]
      ),
      Response.genElements(
        "https://techcrunch.com/wp-content/uploads/2017/04/facebook-messenger-f8.jpg",
        "Menu B",
        "14.00",
        [Response.genPostbackButton("Menu B", "MENU_B_SELECTED")]
      ),
      Response.genElements(
        "https://techcrunch.com/wp-content/uploads/2017/04/facebook-messenger-f8.jpg",
        "Menu C",
        "12.40",
        [Response.genPostbackButton("Menu C", "MENU_C_SELECTED")]
      )
    ]);
    responses.push(text);
    responses.push(menu);

    return responses;
  }
};
