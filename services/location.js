"use strict";

const Response = require("./response");

module.exports = class Location {
  static handlePayload(payload, quickReply) {
    let response;

    if (payload === "LOCATION_SELECTED") {
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
    } else {
      console.log(quickReply);
      response = Response.genText(`You have selected ${quickReply}!`);
    }

    return response;
  }
};
