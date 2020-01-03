"use strict";

const Response = require("./response");

let dish;

var response;

module.exports = class Order {
  static get dish() {
    return dish;
  }

  static set dish(d) {
    dish = d;
  }

  static handlePayload(payload, message) {
    if (payload === "NUMBEROFORDERS") {
      let quantityOfDish = message;
      response = Response.genText(
        `You have selected ${quantityOfDish} sets of ${dish}.`
      );
      dish = "";
    }

    return response;
  }

  generateOrderSummary() {
    let orderSummary = `Order Summary:\n`;

    this._orderItems.forEach(item => {
      orderSummary += `${item}`;
    });
  }
};
