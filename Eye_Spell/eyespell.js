import {
    SvgPlus,
    SquidlyApp,
  } from "https://session-app.squidly.com.au/src/Apps/app-class.js";

  //   constant that stores the images and the words to be spelled
  const items = [
    'fork', 'spoon', 'knife', 'plate', 'burger', 'fries', 'pizza'
  ]

  class KitchenWindow extends SvgPlus {
    constructor(editable, app, effect) {
        this.app = app;
        this.effect = effect;
        this.editable = editable;
        this.itemSelection = [];
        this.itemsOnScreen = [];
        this.itemsDisplay = this.createChild("div");
        // database value listeners

        // listens to itemSelection change
        // this contains a list of items waiting to be spelled
        app.onValue("state", (state) => {
          this.state = state;
        });

        // listens to itemsOnScreen change
        app.onValue("itemsOnScreen", (itemsOnScreen) => {
          this.itemsOnScreen = itemsOnScreen;
        });

        // listens to itemSelection change
        app.onValue("itemSelection", (itemSelection) => {
          this.itemSelection = itemSelection;

        });
        

        
    }
    set State(params){
      switch (params) {
        case null:
          this.app.set("state", "init");
          break;
        case "init":
          // call the function to display the items (randomly select 6 items)
          this.displayItems(items);
          this.app.set("state", "select");
          break;

        case "select":
          // call the function to display the items (randomly select 6 items)
          // this.displayItems(items);
          break;
        case "spell":
          break;
      
        default:
          break;
      }
    }

    // function to display the items
    displayItems(items){
      // randomly order the items and put them in the itemOnScreen
      items = items.sort(() => Math.random() - 0.5);
      items = items.slice(0, 6);
      this.app.set("itemsOnScreen", items);
    }
  }