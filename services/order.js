"use strict";

module.exports = class Order {
  constructor(orderItems) {
    this._orderItems = orderItems;
  }

  static getOrderItems() {
    return this._orderItems;
  }

  static setOrderItems(orderItems) {
    this._orderItems = orderItems;
  }

  generateOrderSummary() {
    let orderSummary = `Order Summary:\n`;

    this._orderItems.forEach(item => {
      orderSummary += `${item}`;
    });
  }
};
