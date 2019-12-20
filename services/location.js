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
    } else {
      let response = Response.genText(`You have selected ${message.text}.`);
      let menu = Response.genNuxMessage();

      let responses = [];

      responses.push(response);
      responses.concat(menu);

      return responses;
    }
  }
};
