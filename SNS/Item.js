import {
    SvgPlus,
    SquidlyApp,
  } from "https://session-app.squidly.com.au/src/Apps/app-class.js";


class Item extends SvgPlus {
    constructor(params) {
      super("img");
      this.props = {
        name: params[0].name,
        src: `http://127.0.0.1:5502/images/${params[0].name}.svg`,
        styles: {
          position: "absolute",
          top: params[0].top,
          left: params[0].left,
          width: "8%",
        },
      };
      this.editable = params[1];
      this.progress = 0;
      this.animate();
    }
  
    async animate() {
      // animation: fade out items only on user side
      if (!this.editable) {
        while (true) {
          await waitFrame();
          if (!this.hover) {
            this.progress -= 0.005;
          } else {
            this.progress += 0.02;
          }
        }
      }
    }
  
    set hover(value) {
      this._hover = value;
    }
  
    get hover() {
      return this._hover;
    }
  
    set progress(value) {
      if (value < 0) {
        value = 0;
      } else if (value > 1) {
        value = 1;
      }
      // if the opacity is 0, trigger the click event
      if (value === 1 && this._progress < 1) {
        const event = new Event("click");
        this.dispatchEvent(event);
      }
      this._progress = value;
      this.style.opacity = 1 - value;
    }
  
    get progress() {
      return this._progress;
    }
  }
  