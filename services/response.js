"use strict";

let status = [];

module.exports = class Response {
  static get status() {
    return status;
  }

  static set status(s) {
    status = s;
  }

  static genQuickReply(text, quickReplies) {
    let response = {
      text: text,
      quick_replies: []
    };

    for (let quickReply of quickReplies) {
      response["quick_replies"].push({
        content_type: "text",
        title: quickReply["title"],
        payload: quickReply["payload"]
      });
    }

    return response;
  }

  static genGenericTemplate(image_url, title, subtitle, buttons) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: title,
              subtitle: subtitle,
              image_url: image_url,
              buttons: buttons
            }
          ]
        }
      }
    };

    return response;
  }

  static genGenericCarouselTemplate(elements) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: elements
        }
      }
    };

    return response;
  }

  static genElements(image_url, title, subtitle, buttons) {
    let response = {
      title: title,
      subtitle: subtitle,
      image_url: image_url,
      buttons: buttons
    };

    return response;
  }

  static genImageTemplate(image_url, title, subtitle = "") {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: title,
              subtitle: subtitle,
              image_url: image_url
            }
          ]
        }
      }
    };

    return response;
  }

  static genButtonTemplate(title, buttons) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: title,
          buttons: buttons
        }
      }
    };

    return response;
  }

  static genText(text) {
    let response = {
      text: text
    };

    return response;
  }

  static genTextWithPersona(text, persona_id) {
    let response = {
      text: text,
      persona_id: persona_id
    };

    return response;
  }

  static genPostbackButton(title, payload) {
    let response = {
      type: "postback",
      title: title,
      payload: payload
    };

    return response;
  }

  static genWebUrlButton(title, url) {
    let response = {
      type: "web_url",
      title: title,
      url: url,
      messenger_extensions: true
    };

    return response;
  }

  static genNuxMessage() {
    let welcome = this.genText("Hi, Welcome to UTS Late Night Food.");

    let buttons = this.genButtonTemplate(
      "Please select from the following options:",
      [
        this.genPostbackButton("Choose Location", "LOCATION_SELECTED"),
        this.genPostbackButton("Choose Menu", "MENU_SELECTED"),
        this.genPostbackButton("Finalise Payment", "PAYMENT_SELECTED")
      ]
    );

    return [welcome, buttons];
  }

  static genOptions(payload) {
    let buttons;

    if (!status.includes(payload)) {
      status.push(payload);
    }

    if (status.length == 1) {
      buttons = this.genButtonTemplate(
        "Please select from the following options:",
        [
          status[0] == "LOCATION_UPDATED"
            ? this.genPostbackButton("Update Location", "LOCATION_SELECTED")
            : this.genPostbackButton("Choose Location", "LOCATION_SELECTED"),
          status[0] == "MENU_UPDATED"
            ? this.genPostbackButton("Update Menu", "MENU_SELECTED")
            : this.genPostbackButton("Choose Menu", "MENU_SELECTED"),
          this.genPostbackButton("Finalise Payment", "PAYMENT_SELECTED")
        ]
      );
    } else if (status.length == 2) {
      if (
        status.includes("LOCATION_UPDATED") &&
        status.includes("MENU_UPDATED")
      ) {
        buttons = this.genButtonTemplate(
          "Please select from the following options:",
          [
            this.genPostbackButton("Update Location", "LOCATION_SELECTED"),
            this.genPostbackButton("Update Menu", "MENU_SELECTED"),
            this.genPostbackButton("Finalise Payment", "PAYMENT_SELECTED")
          ]
        );
      }
    }

    return buttons;
  }
};
