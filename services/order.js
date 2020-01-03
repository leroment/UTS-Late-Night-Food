"use strict";

let dish;

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
      console.log(`The number of dishes for ${dish} is ${quantityOfDish}!`);
    }
  }

  generateOrderSummary() {
    let orderSummary = `Order Summary:\n`;

    this._orderItems.forEach(item => {
      orderSummary += `${item}`;
    });
  }
};
