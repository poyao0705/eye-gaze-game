import {
  SvgPlus,
  SquidlyApp,
} from "https://session-app.squidly.com.au/src/Apps/app-class.js";

const images = ["dog", "cat"];

const catSvg = `<svg
  width="100%"
  height="100%"
  viewBox="0 0 64 64"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  aria-hidden="true"
  role="img"
  class="iconify iconify--emojione"
  preserveAspectRatio="xMidYMid meet"
>
  <g fill="#3e4347">
    <path d="M2.3 36.1c-.2-1-.3-2-.2-2.9c0-1.2.3-2.2.9-3.2c.6-1.1 1.6-2 2.7-2.5c1.1-.6 2.5-.8 3.8-.6c1.2.1 2.4.6 3.4 1.3c.9.6 1.7 1.4 2.4 2.3c1.1 1.5 1.9 3.3 2.3 5.4v.3c.2 1.3-.6 2.5-1.9 2.9c-.2.1-.4.1-.6.1c-.8.1-1.5-.1-2.1-.6c-.6-.5-1-1.1-1.1-1.9c-.2-1.4-.5-2.6-1.1-3.5c-.5-.9-1.3-1.6-2.1-1.8c-.3-.1-.7-.1-1 0c-.4.1-.7.4-.9.7c-.3.4-.5.8-.5 1.4c-.1.6-.1 1.2 0 1.8c.2 1.2.6 2.6 1.3 4c.3.6.7 1.3 1.1 2c.4.7.9 1.3 1.3 1.8c1.1 1.3 2.1 2.3 3.2 3.1c1.3.9 2.6 1.5 3.9 1.7c1.3.2 2.8.2 4.3-.3c1.2-.3 1.9.1 2.1.7c.2.5-.1 1.3-1.3 1.7h-.1c-1.8.6-3.7.8-5.4.5c-1.7-.2-3.5-1-5.2-2c-1.4-.9-2.6-2.1-3.9-3.5c-.5-.6-1-1.2-1.4-1.7L6 43c-.6-.7-1.1-1.4-1.5-2.1c-1.2-1.6-1.9-3.2-2.2-4.8"></path>
    <path d="M46.7 55.9c1.8 2.3 9.7 0 11-2.6c5.2-10.6 0-15.2 0-15.2l-11 1.5c0 .1-2.2 13.5 0 16.3"></path>
    <path d="M31.8 55.9c-1.8 2.3-9.7 0-11-2.6c-5.2-10.6 0-15.2 0-15.2l11 1.5c0 .1 2.3 13.5 0 16.3"></path>
  </g>
  <g fill="#ffffff">
    <path d="M34.5 55.2c-.1 1.1-2.6 1.7-5.6 1.4c-3-.3-5.3-1.3-5.3-2.4c.1-1.1 2.4.3 5.4.5c3.1.4 5.6-.5 5.5.5"></path>
    <path d="M44 55.2c.1 1.1 2.6 1.7 5.6 1.4c3-.3 5.3-1.3 5.3-2.4c-.1-1.1-2.4.3-5.4.5c-3.1.4-5.6-.5-5.5.5"></path>
  </g>
  <g fill="#4c5359">
    <path d="M39.2 60.4c2 2.2 8.9 2.1 11.1 0c3-3 2.9-16.7 3-23.3l-13-1.1c.1 0-3.6 21.5-1.1 24.4"></path>
    <path d="M39.3 60.4c-2 2.2-8.9 2.1-11.1 0c-3-3-2.9-16.7-3-23.3l13-1.1s3.6 21.5 1.1 24.4"></path>
  </g>
  <path fill="#ffffff" d="M34 43.7l5.3 11.2l5.3-11.2z"></path>
  <path d="M59.9 2.2C57.5.8 45.1 7.3 42.6 11.7l17.9 10.6c2.4-4.3 1.7-18.8-.6-20.1" fill="#4c5359"></path>
  <path d="M56.2 8.8c-.9-.5-8.2 2.8-9.6 5.2l10 5.9c1.3-2.3.4-10.6-.4-11.1" fill="#f7a4a4"></path>
  <path d="M18.7 2.2c-2.4 1.4-3.1 15.7-.6 20.1L36 11.7C33.6 7.4 21 .8 18.7 2.2z" fill="#4c5359"></path>
  <path d="M22.5 8.8c-.9.5-1.8 8.7-.4 11.1L32 14c-1.3-2.3-8.7-5.7-9.5-5.2" fill="#f7a4a4"></path>
  <path d="M39.3 9.4C18.5 9.4 16.5 24 16.5 32.1c0 3.4 10.2 13.9 22.7 13.9C51.8 46 62 35.5 62 32.1C62 24 60 9.4 39.3 9.4" fill="#4c5359"></path>
  <path d="M33.5 28.5s-2.4 3.6-6.8 2.5s-4.6-5.4-4.6-5.4s2.4-3.6 6.8-2.5c4.4 1.2 4.6 5.4 4.6 5.4" fill="#bfffab"></path>
  <path d="M33 26.7S30.9 29 28 29c-3.1 0-5-4.4-5-4.4s2.1-2.4 5.8-1.4c3.5.8 4.2 3.5 4.2 3.5" fill="#93e67f"></path>
  <path d="M29.8 26.6c0 4.9-2.4 4.9-2.4 0s2.4-4.9 2.4 0" fill="#4c5359"></path>
  <path d="M45.1 28.5s2.4 3.6 6.8 2.5s4.6-5.4 4.6-5.4s-2.4-3.6-6.8-2.5c-4.4 1.2-4.6 5.4-4.6 5.4" fill="#bfffab"></path>
  <path d="M45.5 26.7s2.1 2.3 5 2.3c3.1 0 5-4.4 5-4.4s-2.1-2.4-5.8-1.4c-3.5.8-4.2 3.5-4.2 3.5" fill="#93e67f"></path>
  <path d="M48.7 26.6c0 4.9 2.4 4.9 2.4 0c.1-4.9-2.4-4.9-2.4 0" fill="#4c5359"></path>
  <path d="M45.9 32.5c-2-1.5-4.2-6.5-6.6-6.5s-4.7 5-6.6 6.5c-3.1 2.4-11.5 5.1-11.5 5.1s8.9 7.6 18.1 7.6c9.2 0 18.1-7.6 18.1-7.6s-8.4-2.7-11.5-5.1" fill="#ffffff"></path>
  <g fill="#4c5359">
    <path d="M45.7 39.3c-.7.4-1.6.6-2.4.6c-.8-.1-1.6-.3-2.2-.8c-.6-.5-1.1-1.2-1.2-1.9l-.6-3.3l-.6 3.3c-.1.8-.6 1.4-1.2 1.9s-1.4.8-2.2.8c-.9 0-1.7-.1-2.4-.6c-.7-.4-1.4-1.1-1.7-2c0 1 .6 1.9 1.3 2.5c.7.6 1.8 1 2.7 1.1c1 .1 2-.2 2.9-.8c.5-.3.8-.7 1.2-1.2c.3.5.7.9 1.2 1.2c.9.6 1.9.9 2.9.8c1 0 2-.4 2.7-1.1c.8-.6 1.3-1.6 1.3-2.5c-.3.9-.9 1.6-1.7 2"></path>
    <path d="M42.4 33.1c-.6-.7-2.5-.8-3.1-.8c-.6 0-2.5.1-3.1.8c-.4.5-.1 1.8 1.1 3c.7.7 1.4.9 2 .9c.6 0 1.3-.2 2-.9c1.2-1.2 1.5-2.5 1.1-3"></path>
  </g>
  <g fill="#ffffff">
    <path d="M39 59.6c0 1.1-2.3 1.9-5.2 1.9c-2.9 0-5.2-.9-5.2-1.9c0-1.1 2.3.1 5.2.1c2.8 0 5.2-1.1 5.2-.1"></path>
    <path d="M49.9 59.6c0 1.1-2.3 1.9-5.2 1.9c-2.9 0-5.2-.9-5.2-1.9c0-1.1 2.3.1 5.2.1c2.9 0 5.2-1.1 5.2-.1"></path>
  </g>
  <g fill="#3e4347">
    <path d="M29.6 61.2l1.4-2.4l-.4 2.8z"></path>
    <path d="M33.1 62l.5-3.3l.5 3.3z"></path>
    <path d="M37 61.6l-.4-2.6l1.4 2.3z"></path>
    <path d="M48 61.6l-.4-2.8l1.4 2.4z"></path>
    <path d="M44.4 62l.5-3.3l.5 3.3z"></path>
    <path d="M40.5 61.3l1.4-2.3l-.4 2.6z"></path>
  </g>
</svg>`;

const dogSvg = `<svg width="800px" height="800px" viewBox="0 0 150 150" id="dog" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:#915a31;}.cls-1,.cls-2,.cls-4,.cls-5,.cls-6{stroke:#000000;stroke-miterlimit:10;}.cls-1,.cls-2{stroke-width:4px;}.cls-2{fill:#a06538;}.cls-3{fill:#d6d6d6;}.cls-4{fill:#333;}.cls-4,.cls-5,.cls-6{stroke-width:2px;}.cls-5{fill:none;}.cls-6{fill:#ffffff;}</style></defs><title/><path class="cls-1" d="M143.41,87.3c2.12,2.75,3.38,14.05-4.72,14.05-6.54,0-22.6-6.84-22.6-20.37s-18-51.44-18-51.44c22.45,0,43.66.88,43.66,28.83C141.76,58.37,141.29,84.55,143.41,87.3Z"/><path class="cls-1" d="M6.59,87.3c-2.12,2.75-3.38,14.05,4.72,14.05,6.54,0,22.6-6.84,22.6-20.37s18-51.44,18-51.44c-22.45,0-43.66.88-43.66,28.83C8.24,58.37,8.71,84.55,6.59,87.3Z"/><path class="cls-2" d="M119.27,73.22c0,47.32-16.91,61.52-44.27,61.52s-44.27-14.2-44.27-61.52,24.77-58,44.27-58S119.27,25.9,119.27,73.22Z" data-name="&lt;Path&gt;" id="_Path_"/><path class="cls-3" d="M104.69,121.79c-6.7,7.46-16.2,11-29.69,11s-23-3.49-29.69-11c2.94-12.49,8-26.67,14.06-35.75C67,74.6,69.49,38.94,67.62,17.82a48.91,48.91,0,0,1,14.76,0C80.51,38.94,83,74.6,90.63,86,96.69,95.12,101.75,109.3,104.69,121.79Z"/><path class="cls-4" d="M75.77,119.33c-3.18,0-15.65-16.29-14.62-18.84s5.21-5,14.62-5,13.59,2.42,14.64,5S79,119.33,75.77,119.33Z"/><path class="cls-5" d="M82.41,122.37c-.47,4.17-4.25,6-7.14,6s-6.67-1.84-7.13-6"/><circle class="cls-6" cx="53.02" cy="75" r="10.57"/><circle class="cls-6" cx="96.98" cy="75" r="10.57"/><circle cx="55.34" cy="75" r="5.92"/><circle cx="94.66" cy="75" r="5.92"/></svg>`;

const svgAssets = {
  cat: catSvg,
  dog: dogSvg,
};

const colours = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#000000',
  '#FFA500', '#800080', '#008000', '#000080', '#800000', '#FFFFFF'
];

class EyePaint extends SvgPlus {
  constructor(editable, app) {
    super("div");

    this.app = app;
    this.editable = editable;

    this.selectedColour = null;
    this.displayContent = this.createChild("div");

    this.styles = {
      height: "100%",
      width: "100%",
      display: "grid",
      "grid-template-columns": "20% 1fr 10%",
      "background-image": "url('http://127.0.0.1:5502/images/EyePaint/background.jfif')",
      "background-size": "cover",
      "background-position": "center",
      "background-repeat": "repeat",
      "z-index": "1"
    };

    this.props = {
      id: "eyePaint"
    };
    // this.app.onValue("selectedImage", (selectedImage) => {
    //   this.selectedImage = selectedImage;
    // });

    this.app.onValue("state", (state) => {
      this.State = state;
    });

    this.app.onValue("colorUpdates", (update) => {
      // this.applyColourUpdates(updates);
      this.applyColourUpdate(update);
    });
    this.State = ["load", null];
    // this.State = "paint";
  }

  set State(params) {
    let [state, selectedImage] = [...params];
    this.selectedImage = selectedImage;
    switch (state) {
      case "load":
        this.loadImageOptions();
        break;
      case "paint":
        this.paintImage(this.selectedImage);
        // this.paintImage("dog");
        break;
    }
  }

  loadImageOptions() {
    this.displayContent.innerHTML = "";
    for (const image of images) {
      let imageOption = this.displayContent.createChild("img", {
        src: `http://127.0.0.1:5502/images/eyepaint/${image}.svg`,
        styles: {
          width: "100px",
          height: "100px",
          cursor: "pointer",
          margin: "10px",
        },
      });
      if (this.editable) {
        imageOption.addEventListener("click", () => {
          console.log(image);
          // this.app.set("selectedImage", image);
          this.app.set("state", ["paint", image]);
        });
      }
    }
  }

  paintImage(selectedImage) {
    this.displayContent.innerHTML = "";

    const svgContent = svgAssets[selectedImage];
    const svgElement = SvgPlus.parseSVGString(svgContent);
    svgElement.style.width = "80%";
    svgElement.style.height = "80%";
    this.displayContent.appendChild(svgElement);
    
    // Reset all colors to white
    svgElement.querySelectorAll("path, g, circle, rect").forEach((element) => {
      element.style.fill = "white";
    });
    this.setupSVGInteraction(svgElement);

    // Add colour palette
    const colourPicker = this.addColourButtons();
    // Swap colourPicker with the SVG so that colourPicker is on the left
    this.insertBefore(colourPicker, this.displayContent);
  }

  shadeColour(colour, percent) {
    // Slightly darken the colour by reducing the RGB values by 0.7
    let R = Math.min(255, parseInt(parseInt(colour.substring(1, 3), 16) * percent)); // R = first two bytes of hexadecimal - 16 bits
    let G = Math.min(255, parseInt(parseInt(colour.substring(3, 5), 16) * percent));
    let B = Math.min(255, parseInt(parseInt(colour.substring(5, 7), 16) * percent)); 
    
     // RGB to hex conversion and add any required zero padding
    const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
    const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
    const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));
  
    return "#" + RR + GG + BB;
  };

  addColourButtons() {
    const colourPicker = this.createChild("div", {
      styles: {
        display: "flex",
        "flex-wrap": "wrap",
        "justify-content": "center",
      },
    });

    colours.forEach((colour) => {
      const button = colourPicker.createChild("button", {
        styles: {
          width: "40%",   
          height: "auto",
          "padding-left": "2em",
          "padding-right": "2em",   
          "border-radius": "50%", 
          background: `linear-gradient(225deg, ${colour} 70%, ${this.shadeColour(colour, 0.7)} 100%)`,
          border: "2px solid #ccc",
          margin: "1em",
          cursor: "pointer",
          transition: "transform 0.2s",
        },
      });
      button.addEventListener("click", () => {
        this.selectedColour = colour;
      });
      button.onmouseover = () => {
        button.styles = { transform: "scale(1.1)" };
      };
      button.onmouseout = () => {
        button.styles = { transform: "scale(1)" };
      };
    });

    this.addControlButtons(colourPicker);
    return colourPicker;
  }

  addControlButtons(colourPicker) {
    const eraser = colourPicker.createChild("img", {
      src: "http://127.0.0.1:5502/images/EyePaint/eraser-unselect.svg",
      class: "controls",
      styles: {
        width: "50px",
        height: "50px",
        margin: "5px",
        cursor: "pointer",
      },
    });

    eraser.onclick = () => {
      this.selectedColour = "white";
      eraser.props = {
        src: this.selectedColour === "white"
          ? "http://127.0.0.1:5502/images/EyePaint/eraser-select.svg"
          : "http://127.0.0.1:5502/images/EyePaint/eraser-unselect.svg"
      };
    };

    const resetButton = colourPicker.createChild("img", {
      src: "http://127.0.0.1:5502/images/EyePaint/reset.svg",
      class: "controls",
      styles: {
        width: "50px",
        height: "50px",
        margin: "5px",
        cursor: "pointer",
      },
    });

    resetButton.onclick = () => {
      this.resetColours();
    };
  }

  setupSVGInteraction(svgElement) {
    const elements = svgElement.querySelectorAll("path, g, circle, rect");
    elements.forEach((element, index) => {
      const elementId = `${this.selectedImage}-element-${index}`;
      element.id = elementId;
      console.log(`Setting up element: ${elementId}`);
      element.onclick = (e) => {
        if (this.selectedColour) {
          const update = { id: elementId, color: this.selectedColour };
          console.log('Sending color update:', update);
          this.applyColourUpdate(update);
          this.app.set("colorUpdates/"+element.id, this.selectedColour);
        }
      };
    });
    console.log(`Total elements set up: ${elements.length}`);
  }
  
  applyColourUpdate(update) {
    if (!update) {
      console.warn('Invalid update received:', update);
      return;
    }
    for (const id in update) {
      const element = this.displayContent.querySelector(`#${id}`);
      if (element) {
        element.style.fill = update[id];
        console.log(`Applied color ${update[id]} to element with id ${id}`);
      } else {
        console.warn(`Element with id ${id} not found`);
      }
    }
    
    // const element = this.displayContent.querySelector(`#${update.id}`);
    // if (element) {
    //   element.style.fill = update.color;
    //   console.log(`Applied color ${update.color} to element with id ${update.id}`);
    // } else {
    //   console.warn(`Element with id ${update.id} not found`);
    // }
  }

  resetColours() {
    this.displayContent.querySelectorAll("path, g, circle, rect").forEach((element, index) => {
      const elementId = `${this.selectedImage}-element-${index}`;
      const update = { id: elementId, color: "white" };
      this.applyColourUpdate(update);
      this.app.set("colorUpdates", update);
    });
  }
}

export default EyePaint;
