"use strict";

let order = [];
let editDishQty = false;

require("dotenv").config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const SERVER_URL = process.env.SERVER_URL;

const Response = require("./response"),
  Menu = require("./menu");

module.exports = class Order {
  static handlePayload(payload, message = "") {
    let responses = [];

    if (payload === "NUMBEROFORDERS") {
      let quantityOfDish = message;
      let dish = Menu.dish;

      if (editDishQty) {
        order.find(o => o.dish == dish).quantity = quantityOfDish;
        responses.push(
          Response.genText(
            `You have changed quantity of dish ${dish} to ${quantityOfDish}`
          )
        );
        editDishQty = false;
        responses = responses.concat(this.generateOrderSummary());
      } else {
        responses.push(
          Response.genText(
            `You have selected ${quantityOfDish} sets of ${dish}.`
          )
        );
        console.log(`The dish is ${dish}`);

        if (!order.some(o => o.dish == dish)) {
          order.push({
            dish: dish,
            quantity: quantityOfDish
          });
        } else {
          let oldOrder = order.find(o => o.dish == dish);

          oldOrder.quantity += quantityOfDish;

          let index = order.indexOf(oldOrder);

          order.splice(index, 1);

          order.push(oldOrder);
        }
        responses = responses.concat(this.generateOrderSummary());
      }
      dish = "";
      Menu.dish = "";
    } else if (payload === "ADD_ORDER") {
      responses = responses.concat(Menu.handlePayload("MENU_SELECTED"));
    } else if (payload === "REVISE_ORDER") {
      order.forEach((item, index) => {
        responses.push(
          Response.genButtonTemplate(`${index + 1}. Edit ${item.dish}`, [
            Response.genPostbackButton(
              "Edit Quantity",
              `EDIT_ORDER_QTY_${index}`
            ),
            Response.genPostbackButton(
              "Delete Selection",
              `DELETE_ORDER_${index}`
            ),
            Response.genPostbackButton(
              "Cancel Revise Selection",
              "CANCEL_ORDER_SELECTION"
            )
          ])
        );
      });
    } else if (payload === "FINALISE_ORDER") {
      responses.push(
        Response.genText("Your menu selection has been confirmed!")
      );
      responses.push(Response.genOptions("MENU_UPDATED"));
    } else if (payload === "CANCEL_ORDER_SELECTION") {
      responses.push(
        Response.genButtonTemplate("Please select from the following", [
          Response.genPostbackButton("Add Menu Selection", "ADD_ORDER"),
          Response.genPostbackButton("Revise Menu Selection", "REVISE_ORDER"),
          Response.genPostbackButton(
            "Finalise Menu Selection",
            "FINALISE_ORDER"
          )
        ])
      );
    } else if (payload.includes("EDIT_ORDER_QTY")) {
      let index = payload.slice(15);
      responses.push(Response.genText("How many?"));
      Menu.dish = order[index].dish;
      editDishQty = true;
    } else if (payload.includes("DELETE_ORDER")) {
      let index = payload.slice(13);
      let dish = order[index].dish;
      order.splice(index, 1);
      responses.push(Response.genText(`Selection ${dish} has been deleted.`));
      responses = responses.concat(this.generateOrderSummary());
    } else {
      responses = [];
    }

    return responses;
  }

  static generateOrderSummary() {
    let orderSummary = `Here is your menu selection:\n`;

    order.forEach((item, index) => {
      orderSummary += `${index + 1}. ${item.dish} x ${item.quantity}\n`;
    });

    let response = Response.genText(orderSummary);
    let buttons = Response.genButtonTemplate(
      "Please select from the following",
      [
        Response.genPostbackButton("Add Menu Selection", "ADD_ORDER"),
        Response.genPostbackButton("Revise Menu Selection", "REVISE_ORDER"),
        Response.genPostbackButton("Finalise Menu Selection", "FINALISE_ORDER")
      ]
    );
    return [response, buttons];
  }

  static generateReceiptSummary() {
    let response = [];
    if (order.length == 0) {
      response.push(
        Response.genText(
          "Sorry, you have no orders. Please select the menu before proceeding to payment!"
        )
      );

      return response;
    }

    let orderSummary = `Here is your order:\n`;

    order.forEach((item, index) => {
      orderSummary += `${index + 1}. ${item.dish} x ${item.quantity}\n`;
    });

    response.push(Response.genText(orderSummary));

    response.push(
      Response.genButtonTemplate(`Please finalise your payment!`, [
        Response.genWebViewButton("PAY NOW", `${SERVER_URL}/paypal`)
      ])
    );

    return response;
  }
};
