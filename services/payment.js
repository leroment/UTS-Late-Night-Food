"use strict";

const Response = require("./response"),
  Order = require("./order");

module.exports = class Payment {
  constructor() {}

  static handlePayload(payload) {
    let response = [];

    if (payload === "PAYMENT_SELECTED") {
      response = response.concat(Order.generateReceiptSummary());
    }

    return response;
  }
};
