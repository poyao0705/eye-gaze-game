import {
    SvgPlus,
    SquidlyApp,
  } from "https://session-app.squidly.com.au/src/Apps/app-class.js";

import Item from "./Item.js";

const itemPositions = {
    Standard: [
      { top: "53%", left: "47%", name: "teddybear" },
      { top: "80%", left: "73%", name: "bag" },
      { top: "53%", left: "27%", name: "books" },
      { top: "43%", left: "70%", name: "clothes" },
      { top: "20%", left: "57%", name: "clock" },
      { top: "40%", left: "2%", name: "bird" },
    ],
    Birthday: [
      { top: "53%", left: "47%", name: "dachshund" },
      { top: "80%", left: "73%", name: "gift" },
      { top: "56%", left: "22%", name: "birthday_cake" },
      { top: "65%", left: "2%", name: "birthday_card" },
      { top: "37%", left: "79.5%", name: "birthday_hat" },
      { top: "37%", left: "4%", name: "dancers" },
    ],
    Halloween: [
      { top: "53%", left: "47%", name: "cat" },
      { top: "80%", left: "65%", name: "lollipop" },
      { top: "49%", left: "18%", name: "witchhat" },
      { top: "65%", left: "80%", name: "Broom" },
      { top: "20%", left: "57%", name: "bat" },
      { top: "40%", left: "5%", name: "owl" },
      { top: "65%", left: "25%", name: "Pumpkin" },
    ],
    Christmas: [
      { top: "53%", left: "47%", name: "santaclaus" },
      { top: "39%", left: "3%", name: "elf" },
      { top: "52%", left: "25%", name: "chicken" },
      { top: "80%", left: "80%", name: "gingerbread" },
      { top: "21.5%", left: "37%", name: "christmas_socks" },
      { top: "73%", left: "26%", name: "snowglobe" },
      { top: "27%", left: "73%", name: "star" },
    ],
};

const backgroundAspectRatio = 1077 / 600;

class BedroomWindow extends SvgPlus {
    constructor(editable, app, effect) {
      super("div");
      window.addEventListener("mousemove", (e) => {
        this.eyePosition = { x: e.clientX, y: e.clientY };
      });
  
      this.app = app;
      this.effect = effect;
  
      this.styles = {
        position: "absolute",
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
        width: "100%",
        height: "100%",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
  
      // database query for the background image
      app.onValue("level", (level) => {
        if (level) {
          console.log("level: ", level);
          this.level = level;
          if (!this.background) {
            this.background = this.createChild("img", {
              src: `http://127.0.0.1:5502/images/${level}.svg`,
              styles: {
                position: "relative",
                width: "100%",
                height: "100%",
                "object-fit": "contain",
                "z-index": "-1",
              },
            });
          } else {
            this.background.src = `http://127.0.0.1:5502/images/${level}.svg`;
          }
        } else {
          // default level
          this.level = "Standard";
          if (!this.background) {
            this.background = this.createChild("img", {
              src: `http://127.0.0.1:5502/images/standard.svg`,
              styles: {
                position: "relative",
                width: "100%",
                height: "100%",
                "object-fit": "contain",
                "z-index": "-1",
              },
            });
          } else {
            this.background.src = `http://127.0.0.1:5502/images/standard.svg`;
          }
        }
      });
  
      this.promptWindow = this.createChild("div", {
        styles: {
          position: "absolute",
          top: "0%",
          left: "50%",
          transform: "translateX(-50%)",
          "font-size": "30px",
        },
      });
  
      this.items = this.createChild("div");
      this.editable = editable;
      this.correctItems = [];
      this.selectedItems = [];
      this.itemsOnScreen = [];
  
      app.onValue("itemsOnScreen", (itemsOnScreen) => {
        if (this.state && this.state === "play" && !this.effect.muted) {
          this.effect.load();
          this.effect.play();
        }
  
        // compare the value from the database and within the app
        // if the app has more items, fade out the extra items
        // in the play state
        if (itemsOnScreen) {
          if (this.itemsOnScreen.length > itemsOnScreen.length) {
            // find the item that should be removed
            let itemToRemove = this.itemsOnScreen.find(
              (i) => !itemsOnScreen.find((j) => j.name === i.name)
            );
            this.fadeOutEffect(itemToRemove.name);
          }
          this.itemsOnScreen = itemsOnScreen;
        } else {
          console.log("itemsOnScreen is null");
          console.log(
            "load items on screen:",
            this.state && this.state !== "end"
          );
          if (this.state && this.state !== "end") {
            this.itemsOnScreen = itemPositions[this.level];
            this.app.set("itemsOnScreen", this.itemsOnScreen);
          }
        }
      });
  
      app.onValue("correctItems", (correctItems) => {
        console.log("onvalue correctItems:", correctItems);
        if (this.correctItems) {
          this.correctItems = correctItems;
          if (this.correctItems && this.correctItems.length !== 0) {
            this.app.set(
              "prompt",
              `Select the ${this.correctItems[0]
                .replace(/_/g, " ")
                .toUpperCase()}`
            );
          }
        }
      });
  
      app.onValue("prompt", (prompt) => {
        console.log("onvalue prompt:", prompt);
        if (this.promptWindow) {
          if (typeof prompt !== "string") prompt = "";
          this.promptWindow.textContent = prompt;
        }
      });
  
      app.onValue("state", async (state) => {
        this.state = state;
        console.log("onvalue state:", state);
        await this.setStateAsync(state);
      });
  
      this.updateAspectRatio();
    }
  
    async updateAspectRatio() {
      while (true) {
        let parent = this.offsetParent;
        if (parent) {
          let aspectRatio = parent.offsetWidth / parent.offsetHeight;
          if (aspectRatio < backgroundAspectRatio) {
            this.style.width = "100%";
            this.style.height = "auto";
            if (this.background) {
              this.background.style.width = "100%";
              this.background.style.height = "auto";
            }
          } else {
            this.style.width = "auto";
            this.style.height = "100%";
            if (this.background) {
              this.background.style.width = "auto";
              this.background.style.height = "100%";
            }
          }
        }
        await waitFrame();
      }
    }
  
    async getItemsOnScreen() {
      return await this.app.get("itemsOnScreen");
    }
  
    fadeOutEffect(element) {
      if (typeof element === "string") {
        element = this.querySelector(`[name=${element}]`);
      }
      element.style.display = "none";
    }
  
    loadButtons() {
      if (this.editable) {
        let selButton = document.getElementsByName("selectButton");
        if (selButton.length > 0) {
          selButton[0].style.display = "block";
        } else {
          this.createChild("button", {
            name: "selectButton",
            content: "Select",
            styles: {
              position: "absolute",
              "font-size": "0.8em",
              bottom: "15%",
              left: "47%",
              padding: "10px 20px",
              background: "#FFCC00",
              color: "white",
              border: "2px solid #CC9900",
              "border-radius": "5px",
            },
          }).addEventListener("click", () => {
            if (this.correctItems.length === 0) {
              alert("Please select at least one item");
              return;
            }
            console.log("set to play state", this.correctItems);
            this.app.set("correctItems", this.correctItems);
            this.app.set("state", "play");
          });
          let selectButton = document.getElementsByName("selectButton")[0];
          selectButton.addEventListener("mouseover", () => {
            selectButton.styles = { cursor: "pointer" };
          });
          selectButton.addEventListener("mouseleave", () => {
            selectButton.styles = { cursor: "auto" };
          });
  
          this.createChild("button", {
            name: "resetButton",
            content: "&#8634;",
            styles: {
              position: "absolute",
              "font-size": "0.8em",
              bottom: "15%",
              left: "53%",
              "margin-left": "25px",
              padding: "9.2px 15px",
              background: "#FFCC00",
              color: "white",
              border: "2px solid #CC9900",
              "border-radius": "5px",
            },
          }).addEventListener("click", () => {
            console.log("reset button clicked");
            this.app.set("prompt", "");
            this.app.set("itemsOnScreen", itemPositions[this.level]);
            this.app.set("state", "reset");
          });
          let resetButton = document.getElementsByName("resetButton")[0];
          resetButton.addEventListener("mouseover", () => {
            resetButton.styles = { cursor: "pointer" };
          });
          resetButton.addEventListener("mouseleave", () => {
            resetButton.styles = { cursor: "auto" };
          });
        }
      }
    }
  
    async setStateAsync(params) {
      switch (params) {
        case null:
          this.app.set("state", "init");
          break;
        case "reset":
          // reset the game state when clicked on the reset button, and new theme is selected
          console.log("state=[reset]");
          this.app.set("itemsOnScreen", itemPositions[this.level]);
          this.app.set("prompt", "");
          this.app.set("state", "init");
          if (this.editable) {
            let selButton = document.getElementsByName("selectButton")[0];
            if (selButton) {
              selButton.style.pointerEvents = "auto";
            }
          }
          break;
  
        case "init":
          // load the items on the screen
          let itemsOnScreen = await this.getItemsOnScreen();
  
          console.log("state=[init]");
          console.log("[init] itemsOnScreen:", itemsOnScreen);
          if (!itemsOnScreen) {
            console.log("itemsOnScreen is null");
            console.log("level:", this.level);
            itemsOnScreen = itemPositions[this.level];
          }
          this.itemsOnScreen = itemsOnScreen;
          this.app.set("itemsOnScreen", itemsOnScreen);
          this.app.set("state", "setup");
          break;
  
        case "setup":
          console.log("state=[setup]");
          this.correctItems = [];
          this.items.innerHTML = "";
          this.loadButtons();
          console.log("[setup] itemsOnScreen:", this.itemsOnScreen);
          // Ensure this.correctItems is an array
          for (const item of this.itemsOnScreen) {
            let itemImg = this.items.createChild(Item, {}, [item, this.editable]);
  
            if (this.editable) {
              itemImg.addEventListener("click", () => {
                // select/deselect the item
                console.log("[setup] this.correctItems:", this.correctItems);
                if (!this.correctItems) {
                  this.correctItems = [];
                }
                const itemIndex = this.correctItems.indexOf(item.name);
                if (itemIndex > -1) {
                  this.correctItems.splice(itemIndex, 1);
                  console.log(this.correctItems);
                  itemImg.style.border = "";
                } else {
                  this.correctItems.push(item.name);
                  console.log(this.correctItems);
                  // highlight the selected item
                  itemImg.style.border = "2px solid yellow";
                }
              });
            }
          }
          break;
  
        case "play":
          console.log("state=[play]");
          this.items.innerHTML = "";
  
          if (this.editable) {
            this.loadButtons();
          }
  
          for (const item of this.itemsOnScreen) {
            // create the items on the screen
            let itemImg = this.items.createChild(Item, {}, [item, this.editable]);
  
            if (!this.editable) {
              itemImg.addEventListener("click", () => {
                let currentItem = this.correctItems[0];
                //  if the selected item is not the correct item, display the error message
                if (item.name !== currentItem) {
                  this.app.set(
                    "prompt",
                    `Try again! This is not the ${currentItem
                      .replace(/_/g, " ")
                      .toUpperCase()}`
                  );
                } else {
                  // On the last item, set state to end immediately so that items are not reloaded since itemsOnSscreen is null
                  if (this.correctItems.length === 1) {
                    this.state = "end";
                  }
                  // remove the selected item from the screen
                  this.app.set(
                    "itemsOnScreen",
                    [...this.itemsOnScreen].filter((i) => i.name !== item.name)
                  );
                  // remove the item from the correct items
                  this.app.set("correctItems", this.correctItems.slice(1));
                  // if correct items are empty, set the state to end
                  if (!this.correctItems) {
                    this.app.set("state", "end");
                  } else {
                    // update the prompt
                    this.app.set(
                      "prompt",
                      `Select the ${this.correctItems[0]
                        .replace(/_/g, " ")
                        .toUpperCase()}`
                    );
                  }
                }
              });
            }
          }
          break;
  
        case "end":
          console.log("state=[end]");
          this.items.innerHTML = "";
          this.app.set("prompt", "Congratulations!");
          this.loadButtons();
          if (this.editable) {
            document.getElementsByName("selectButton")[0].style.pointerEvents =
              "none";
          }
          let images = await this.getItemsOnScreen();
          if (images) {
            // disable all the items
            for (const item of images) {
              let itemImg = this.items.createChild(Item, {}, [
                item,
                this.editable,
              ]);
              itemImg.style.pointerEvents = "none";
            }
          }
          break;
  
        default:
          break;
      }
    }
  
    checkVectorOnItem(vector) {
      let x = vector.x;
      let y = vector.y;
      let items = this.items.children;
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let rect = item.getBoundingClientRect();
        // enlarge clickbox by 10%
        if (
          x > rect.left * 0.9 &&
          x < rect.right * 1.1 &&
          y > rect.top * 0.9 &&
          y < rect.bottom * 1.1
        ) {
          return item;
        }
      }
      return null;
    }
  
    // check if eye position is on an item and call the opacity animation
    set eyePosition(vector) {
      let item = this.checkVectorOnItem(vector);
      [...this.items.children].forEach((i) => {
        i.hover = false;
      });
      if (item) {
        item.hover = true;
      }
    }
  }