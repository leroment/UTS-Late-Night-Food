"use strict";

const Response = require("./response"),
  Order = require("./order");

require("dotenv").config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const SERVER_URL = process.env.SERVER_URL;

module.exports = class Payment {
  constructor() {}

  static handlePayload(payload) {
    let response = [];

    if (payload === "PAYMENT_SELECTED") {
      response.push(Order.generateReceiptSummary());
      response.push(
        Response.genButtonTemplate(`Please finalise your payment!`, [
          Response.genWebViewButton("PAY NOW", `${SERVER_URL}/paypal`)
        ])
      );
    }

    return response;
  }
};
