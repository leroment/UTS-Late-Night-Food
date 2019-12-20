"use strict";

require("dotenv").config();

const Response = require("./response");

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

module.exports = class Menu {
  static handlePayload(payload, message) {
    let response;

    if (payload === "MENU_SELECTED") {
      //   response = Response.genMultipleGenericTemplate([
      //     Response.genGenericTemplateElement(
      //       "https://www.bbcgoodfood.com/sites/default/files/recipe-collections/collection-image/2016/11/one-pot-paneer-curry-pie.jpg",
      //       "Set A",
      //       "$11.00",
      //       [Response.genPostbackButton("Select Quantity")]
      //     ),
      //     Response.genGenericTemplateElement(
      //       "https://www.bbcgoodfood.com/sites/default/files/recipe-collections/collection-image/2016/11/one-pot-paneer-curry-pie.jpg",
      //       "Set B",
      //       "$13.00",
      //       [Response.genPostbackButton("Select Quantity")]
      //     ),
      //     Response.genGenericTemplateElement(
      //       "https://www.bbcgoodfood.com/sites/default/files/recipe-collections/collection-image/2016/11/one-pot-paneer-curry-pie.jpg",
      //       "Set C",
      //       "$9.00",
      //       [Response.genPostbackButton("Select Quantity")]
      //     )
      //   ]);

      response = Response.genText("HI!");
    }

    return response;
  }
};
