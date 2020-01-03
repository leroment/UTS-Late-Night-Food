"use strict";

const Response = require("./response"),
  Database = require("./database");

let dish;
let order = [];

module.exports = class Order {
  static get dish() {
    return dish;
  }

  static set dish(d) {
    dish = d;
  }

  static handlePayload(payload, message) {
    let responses = [];

    if (payload === "NUMBEROFORDERS") {
      let quantityOfDish = message;
      let q = Response.genText(
        `You have selected ${quantityOfDish} sets of ${dish}.`
      );
      console.log(`The dish is ${dish}`);

      order.push({
        dish: dish,
        quantity: quantityOfDish
      });

      let orderSummary = this.generateOrderSummary();

      responses.push(q);

      let buttons = Response.genButtonTemplate(
        "Please select from the following options",
        [
          Response.genPostbackButton("Add more to order", "ADD_ORDER"),
          Response.genPostbackButton("Revise order", "REVISE_ORDER"),
          Response.genPostbackButton("Finalise Order", "FINALISE_ORDER")
        ]
      );

      responses.push(buttons);

      dish = "";
    } else {
      responses = [];
    }

    return responses;
  }

  static generateOrderSummary() {
    let orderSummary = `Here is your order:\n`;

    order.forEach((item, index) => {
      orderSummary += `${index + 1}. ${item.dish} x ${item.quantity}\n`;
    });

    let response = Response.genText(orderSummary);

    return response;
  }
};
