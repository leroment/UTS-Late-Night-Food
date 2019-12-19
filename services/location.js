"use strict";

const Response = require("./response");

module.exports = class Location {
  static handlePayload(payload) {
    let response;

    response = Response.genQuickReply("Pick a location", [
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
  }
};
