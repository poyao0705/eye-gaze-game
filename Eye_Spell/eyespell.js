import {
    SvgPlus,
    SquidlyApp,
  } from "https://session-app.squidly.com.au/src/Apps/app-class.js";

  //   constant that stores the images and the words to be spelled

  class KitchenWindow extends SvgPlus {
    constructor(editable, app, effect) {
        this.app = app;
        this.effect = effect;
        this.editable = editable;
        // database value listeners
        // listens to item_selection change
        // listens to letter_selection change
        // listens to state change
    }
  }