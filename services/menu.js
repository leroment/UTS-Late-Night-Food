"use strict";

require("dotenv").config();

const Response = require("./response");

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

module.exports = class Menu {
  static handlePayload(payload, message) {
    let response;

    if (payload === "MENU_SELECTED") {
      response = Response.genMultipleGenericTemplate([
        Response.genGenericTemplateElement("", "Set A", "$11.00", [
          Response.genPostbackButton("Select Quantity")
        ]),
        Response.genGenericTemplateElement("", "Set B", "$13.00", [
          Response.genPostbackButton("Select Quantity")
        ]),
        Response.genGenericTemplateElement("", "Set C", "$9.00", [
          Response.genPostbackButton("Select Quantity")
        ])
      ]);
    }

    return response;
  }
};
