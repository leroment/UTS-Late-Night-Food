"use strict";

const Response = require("./response");

module.exports = class Location {
  static handlePayload(payload, message) {
    if (payload === "LOCATION_SELECTED") {
      let response = Response.genQuickReply("Pick a location", [
        {
          title: "Yura Mudang",
          payload: "LOCATION_YM"
        },
        {
          title: "Gumal Ngurang",
          payload: "LOCATION_GN"
        },
        {
          title: "Bulga Ngurra",
          payload: "LOCATION_BN"
        },
        {
          title: "Geegal",
          payload: "LOCATION_GE"
        },
        {
          title: "Wattle Lane",
          payload: "LOCATION_WL"
        }
      ]);
      return response;
    } else if (
      payload === "LOCATION_YM" ||
      payload === "LOCATION_GN" ||
      payload === "LOCATION_BN" ||
      payload === "LOCATION_GE" ||
      payload === "LOCATION_WL"
    ) {
      let response = Response.genText(`You have selected ${message.text}.`);
      // let buttons = Response.genButtonTemplate(
      //   "Please select from the following options",
      //   [
      //     Response.genPostbackButton("Update Location", "LOCATION_SELECTED"),
      //     Response.genPostbackButton("Choose Menu", "MENU_SELECTED"),
      //     Response.genPostbackButton("Finalise Payment", "PAYMENT_SELECTED")
      //   ]
      // );
      let buttons = Response.genOptions("LOCATION_UPDATED");

      let responses = [];

      responses.push(response);

      responses.push(buttons);

      return responses;
    }
  }
};
