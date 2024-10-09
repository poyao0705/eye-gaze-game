import {
  SvgPlus,
  Vector,
  SquidlyApp,
} from "https://session-app.squidly.com.au/src/Apps/app-class.js";
import ColorButton from "./ColorButton.js";
import { Loader } from "./Loader.js";
import ControlButton from "./ControlButton.js";
import html2canvas from 'https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.esm.js';

async function loadSVGs(images) {
  let svglib = {};
  let svgFetchPromises = images.map((image) => {
    let fetchSVG = async () => {
      let url = `https://eyepaint.squidly.com.au/images/EyePaint/${image}.svg`;
      svglib[image] = await (await fetch(url)).text();
    };
    return fetchSVG();
  });
  await Promise.all(svgFetchPromises);
  return svglib;
}

const images = [
  "dog",
  "cat",
  "horse",
  "parrot",
  "pig",
  "rabbit",
  "sheep",
  "turtle",
];
const svgAssets = await loadSVGs(images);
const categories = {
  Pets: ["dog", "cat", "parrot", "turtle"],
  Farm: ["horse", "pig", "rabbit", "sheep"],
};

const displayContentDefaultStyle = {
  id: "displayContent",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "grid",
  gap: "1em 2em",
  width: "60%",
  height: "60%",
  "aspect-ratio": "1 / 1",
  // "box-sizing": "border-box"
};

// load page styles to prevent the image options container being cropped
// by grid template columns and rows
// center the container, right now the lower part is cropped

const loadPageDefaultStyle = {
  height: "auto",
  width: "40%",
  position: "absolute",
  top: "50%",
  left: "50%",
  display: "grid",
  "grid-template-columns": "repeat(2, 1fr)",
  "grid-template-rows": "repeat(2, 1fr)",
  "justify-content": "center",
  "align-items": "center",
  gap: "1em",
  margin: "auto",
  transform: "translate(-50%, -50%)",
};
const colours1 = ["#FF0000", "#00FF00", "#000080", "#FFFF00", "#000000"];

const colours2 = ["#FFA500", "#800080", "#800000", "#FFFFFF"];

class EyePaint extends SvgPlus {
  constructor(editable, app) {
    super("div");

    this.app = app;
    this.editable = editable;

    this.selectedColour = null;

    // Main container styles
    this.styles = {
      height: "100%",
      width: "100%",
      position: "relative",
      display: "flex",
      "background-image":
        "url('https://eyepaint.squidly.com.au/images/EyePaint/background.jfif')",
      "background-size": "cover",
      "background-position": "center",
      "background-repeat": "repeat",
      // overflow: "hidden",
    };

    this.props = {
      id: "eyePaint",
    };

    this.music = this.createChild("audio", {
      src: "https://eyepaint.squidly.com.au/sounds/EyePaint/music_menu.ogg",
    });

    // Create separate divs for each page
    this.initPage = this.createChild("div", {
      id: "initPage",
      styles: { display: "none" },
    });
    this.loadPage = this.createChild("div", {
      id: "loadPage",
      styles: { display: "none" },
    });
    this.paintPage = this.createChild("div", {
      id: "paintPage",
      styles: { display: "none" },
    });

    this.app.onValue("state", (stateObj) => {
      this.State = stateObj;
    });

    this.app.onValue("colorUpdates", (update) => {
      this.applyColourUpdate(update);
    });

    this.createVolumeButton();
    this.createHomeButton();
    this.app.set("muted", true);

    this.app.onValue("selectedColour", (colour) => {
      // this.selectedColour = colour;
      if (this.paintIndicator) {
        this.paintIndicator.styles = {"--colour": colour};
      }
    });

    this.app.onValue("muted", (value) => {
      console.log("muted", value);
      if (value) {
        this.volumeButton.src =
          "https://eyepaint.squidly.com.au/images/EyePaint/volume-mute.png";
        this.music.muted = true;
      } else {
        this.volumeButton.src =
          "https://eyepaint.squidly.com.au/images/EyePaint/volume.png";
        this.music.muted = false;
        this.music.volume = 0.5;
        this.music.loop = true;
        this.music.play();
      }
    });

    // this.app.set("state", { page: "init", selectedImage: null, pageNumber: null });
    this.State = { page: "init", selectedImage: null, pageNumber: null };

    
    // this.loader = this.createChild(Loader, {});
  }

  set State(stateObj) {
    // if (!stateObj){ 
    //   stateObj = { page: "init", selectedImage: null, pageNumber: null };
    // }
    const { page, selectedImage, pageNumber } = stateObj;
    this.selectedImage = selectedImage;
    this.pageNumber = pageNumber;
    console.log(page);
    this.hideAllPages();
    switch (page) {
      case "init":
        this.init();
        break;
      case "load":
        this.loadImageOptions();
        break;
      case "paint":
        this.paintImage(this.selectedImage);
        break;
    }
  }

  hideAllPages() {
    this.initPage.style.display = "none";
    this.loadPage.style.display = "none";
    this.paintPage.style.display = "none";
  }

  createHomeButton() {
    this.homeButton = this.createChild("img", {
      src: "https://eyepaint.squidly.com.au/images/EyePaint/back-icon.png",
      styles: {
        position: "absolute",
        top: "0",
        right: "6.5%",
        width: "6.3%",
        height: "auto",
        margin: "5px 5px 0 0",
        cursor: "pointer",
        display: "none",
      },
    });
    this.homeButton.addEventListener("click", async () => {
      // get the state from database
      const state = await this.app.get("state");
      if (state){
        const {page, selectedImage, pageNumber} = state;
        if (page === "paint"){
          this.app.set("state", {
            page: "load",
            selectedImage: null,
            pageNumber: 1,
          });
        } else {
          this.app.set("state", {
          page: "init",
            selectedImage: null,
            pageNumber: null,
          });
        }
      }
      
    });
  }

  async createVolumeButton() {
    this.volumeButton = this.createChild("img", {
      id: "volume",
      src: "https://eyepaint.squidly.com.au/images/EyePaint/volume-mute.png",
      styles: {
        position: "absolute",
        top: "0",
        right: "0",
        width: "6.3%",
        height: "auto",
        margin: "5px 5px 0 0",
        cursor: "pointer",
      },
    });

    this.volumeButton.addEventListener("click", async () => {
      const isMuted = await this.getMuted(); // Get current mute state
      this.app.set("muted", !isMuted); // Toggle mute state
    });

    this.addButtonAnimation(this.volumeButton);
  }

  async getMuted() {
    let isMuted = await this.app.get("muted");
    return isMuted;
  }

  init() {
    this.hideAllPages();
    this.initPage.innerHTML = "";
    this.homeButton.style.display = "none";
    this.initPage.style.display = "block";
    // console.log("init page");
    // this.createVolumeButton(this.app, this.initPage);

    // Center logo in the middle of the page
    const logo = this.initPage.createChild("img", {
      src: "https://eyepaint.squidly.com.au/images/EyePaint/main_page.jfif",
      styles: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "70%",
        height: "auto",
        "object-fit": "cover",
        "border-radius": "2%",
      },
    });

    // Start button under the logo
    const startButton = this.initPage.createChild("img", {
      src: "https://eyepaint.squidly.com.au/images/EyePaint/play.png",
      innerHTML: "Start",
      id: "startButton",
      styles: {
        position: "absolute",
        width: "15%",
        height: "auto",
        bottom: "10%",
        left: "50%",
        transform: "translateX(-50%)",
        cursor: "pointer",
      },
    });
    startButton.addEventListener("click", () => {
      this.app.set("state", {
        page: "load",
        selectedImage: null,
        pageNumber: 1,
      });
      console.log("start button clicked");
    });
  }

  createPaginationButtons(id, position) {
    return this.loadPage.createChild("img", {
      src: `https://eyepaint.squidly.com.au/images/EyePaint/${id}.png`,
      id: id,
      styles: {
        position: "absolute",
        top: "50%",
        [position]: "-20%",
        cursor: "pointer",
        "z-index": "1000",
      },
    });
  }

  loadImageOptions() {
    if (
      this.music.src !== "https://eyepaint.squidly.com.au/sounds/EyePaint/music_game.ogg"
    ) {
      this.music.src = "https://eyepaint.squidly.com.au/sounds/EyePaint/music_game.ogg";
      this.music.play();
    }

    this.hideAllPages();
    this.homeButton.style.display = "block";
    this.loadPage.style.display = "block";
    this.loadPage.innerHTML = "";
    // this.createVolumeButton(this.app, this);

    // Update loadPage styles
    // limit the width and height of the container to prevent the image options from being cropped
    this.loadPage.styles = loadPageDefaultStyle;
    // sort by value of imageCategories first, then by key
    // Determine the current category based on the page number
    const categoryNames = Object.keys(categories);
    const currentCategory = categoryNames[this.pageNumber - 1];
    // put the category name on the top of the page 
    const categoryTitle = this.loadPage.createChild("div", {
      id: "categoryTitle",
      innerHTML: currentCategory,
      styles: {
        position: "absolute",
        top: "-15%",
        left: "50%",
        transform: "translateX(-50%)",
        "font-size": "2em",
        "font-weight": "bold",
        color: "black",
      },
    });
    this.loadPage.appendChild(categoryTitle);
    const imagesToShow = categories[currentCategory] || [];

    console.log(`Displaying category: ${currentCategory}`);
    console.log(imagesToShow);

    // Create next and previous buttons
    if (this.editable) {
      if (this.pageNumber < categoryNames.length) {
        this.nextButton = this.createPaginationButtons("next", "right");
        this.addButtonAnimation(this.nextButton);
        this.nextButton.addEventListener("click", () => {
          this.app.set("state", {
            page: "load",
            selectedImage: null,
            pageNumber: this.pageNumber + 1,
          });
          this.loadImageOptions();
        });
      }

      if (this.pageNumber > 1) {
        this.previousButton = this.createPaginationButtons("previous", "left");
        this.addButtonAnimation(this.previousButton);
        this.previousButton.addEventListener("click", () => {
          this.app.set("state", {
            page: "load",
            selectedImage: null,
            pageNumber: this.pageNumber - 1,
          });
          this.loadImageOptions();
        });
      }
    }

    imagesToShow.forEach((image) => {
      let imageOption = this.loadPage.createChild("div", {
        id: "imageOption",
        styles: {
          position: "relative",
          display: "flex",
          width: "100%",
          height: "auto",
          cursor: "pointer",
          transition: "transform 0.2s",
          border: "2px solid white",
        },
      });

      let canvasImage = imageOption.createChild("img", {
        src: `https://eyepaint.squidly.com.au/images/EyePaint/canvas.svg`,
        styles: {
          width: "100%",
          height: "auto",
          display: "block",
          position: "relative",
        },
      });

      let img = imageOption.createChild("img", {
        src: `https://eyepaint.squidly.com.au/images/EyePaint/${image}.svg`,
        styles: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          height: "auto",
          margin: "auto",
          "object-fit": "contain",
        },
      });

      if (this.editable) {
        imageOption.addEventListener("click", () => {
          console.log(image);
          this.app.set("state", {
            page: "paint",
            selectedImage: image,
            pageNumber: this.pageNumber,
          });
        });
        imageOption.onmouseover = () => {
          imageOption.style.transform = "scale(1.1)";
        };
        imageOption.onmouseout = () => {
          imageOption.style.transform = "scale(1)";
        };
      }
    });
  }

  async captureCanvas() {
    const canvas = await html2canvas(this.canvas);
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas-screenshot.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // console.log(dataURL);
  }

  paintImage(selectedImage) {
    this.hideAllPages();
    this.homeButton.style.display = "block";
    this.paintPage.style.display = "block";
    this.paintPage.innerHTML = "";
    // if (this.volumeButton) {
    //   this.volumeButton = null;
    // }

    this.paintPage.styles = {
      height: "100%",
      width: "100%",
      display: "grid",
      "grid-template-columns": "20% 7% 1fr 20%",
      position: "relative",
    };

    // Add colour palette and control buttons
    const colourPicker = this.addColourButtons();
    const controls = this.addControlButtons();
    this.paintPage.appendChild(colourPicker);
    this.paintPage.appendChild(controls);
    // this.loaderForControlButtons = this.paintPage.createChild(Loader, {});

    this.canvas = this.createChild("div", {
      id: "canvas",
      styles: {
        border: "10px solid white",
        margin: "1em",
        "box-shadow": "0 4px 8px rgba(0, 0, 0, 0.2)",
      },
    });
    // Add in SVG to paint on
    const svgContent = svgAssets[selectedImage];
    const svgElement = SvgPlus.parseSVGString(svgContent);
    svgElement.style.width = "90%";
    svgElement.style.height = "100%";
    svgElement.style.display = "block"; // Center the SVG, by default element is inline
    svgElement.style.margin = "auto";
    this.canvas.appendChild(svgElement);
    this.paintPage.appendChild(this.canvas);

    // Reset all colors to white
    svgElement
      .querySelectorAll(
        "path:not([fixed]), g:not([fixed]), circle:not([fixed]), rect:not([fixed])"
      )
      .forEach((element) => {
        element.style.fill = "white";
      });
    // Add this to clear the colours for the previous painting state
    this.resetColours();

    // this is the initial loader
    this.loader = new Loader();
    this.hoverElement = null;
    svgElement.appendChild(this.loader);
    // this.loader.progress = 0.5;
    this.setupSVGInteraction(svgElement);
    // this.setupSVGClickEvents(svgElement);
    // console.log(svgElement);

    // Create a container for the right column content
    this.contentRight = this.paintPage.createChild("div", {
      id: "contentRight",
      styles: {
        position: "absolute",
        top: "0",
        right: "0",
        width: "20%",
        height: "100%",
        display: "flex",
        "flex-direction": "column",
        "justify-content": "space-between",
        "align-items": "flex-end",
      },
    });

    const cameraButton = this.contentRight.createChild(ControlButton, {
      src: "https://eyepaint.squidly.com.au/images/EyePaint/camera.png",
      class: "controls",
      events: {
        click: () => {
          this.captureCanvas();
        },
      },
      styles: {
        position: "absolute",
        left: "0%",
        width: "31.5%",
        height: "auto",
        margin: "5px 5px 0 0",
        cursor: "pointer",
      },
    });

    this.reference = this.contentRight.createChild("img", {
      src: `https://eyepaint.squidly.com.au/images/EyePaint/${selectedImage}.svg`,
      styles: {
        position: "absolute",
        bottom: "0",
        width: "90%",
        height: "auto",
        "margin-bottom": "10px",
        "align-self": "flex-end",
      },
    });
  }

  addButtonAnimation(button) {
    button.addEventListener("mousedown", () => {
      button.style.transform = "scale(0.9)";
      button.style.transition = "transform 0.1s ease-in-out";
    });

    button.addEventListener("mouseup", () => {
      button.style.transform = "scale(1)";
      button.style.transition = "transform 0.1s ease-in-out";
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "scale(1)";
      button.style.transition = "transform 0.1s ease-in-out";
    });
  }

  shadeColour(colour, percent) {
    // Slightly darken the colour by reducing the RGB values by 0.7
    let R = Math.min(
      255,
      parseInt(parseInt(colour.substring(1, 3), 16) * percent)
    ); // R = first two bytes of hexadecimal - 16 bits
    let G = Math.min(
      255,
      parseInt(parseInt(colour.substring(3, 5), 16) * percent)
    );
    let B = Math.min(
      255,
      parseInt(parseInt(colour.substring(5, 7), 16) * percent)
    );

    // RGB to hex conversion and add any required zero padding
    const RR =
      R.toString(16).length === 1 ? "0" + R.toString(16) : R.toString(16);
    const GG =
      G.toString(16).length === 1 ? "0" + G.toString(16) : G.toString(16);
    const BB =
      B.toString(16).length === 1 ? "0" + B.toString(16) : B.toString(16);

    return "#" + RR + GG + BB;
  }

  createButton(colour, colourPicker) {
    const button = colourPicker.createChild(ColorButton, {}, [
      colour,
      this.editable,
    ]);

    button.onmouseover = () => {
      button.hover = true;
      button.styles = { transform: "scale(1.1)" };
    };
    button.onmouseout = () => {
      button.hover = false;
      button.styles = { transform: "scale(1)" };
    };
    // Creates a border when the button is clicked on and removes it when it is not
    button.onfocus = () => {
      button.styles = {
        outline: "none",
        "box-shadow": "0 0 0 3px rgba(66, 153, 225, 0.5)",
      };
    };
    button.onblur = () => {
      button.styles = { "box-shadow": "none" };
    };

    button.addEventListener("click", () => {
      // add blur to all other buttons if the selected colour is not the same as the clicked colour
      if (this.selectedColour !== colour) {
        this.paintPage.querySelectorAll("button").forEach((button) => {
          button.styles = { "box-shadow": "none" };
        });
      }
      this.selectedColour = colour;
      this.app.set("selectedColour", colour);
    });

    return button;
  }

  addColourButtons() {
    const background = this.createChild("div", {
      styles: {
        display: "flex",
        "flex-direction": "row",
        "background-image":
          "url('https://eyepaint.squidly.com.au/images/EyePaint/palette.png')",
        "background-size": "100% 100%",
        "background-position": "left",
        "background-repeat": "no-repeat",
      },
    });

    const colourPicker1 = background.createChild("div", {
      styles: {
        display: "flex",
        "flex-wrap": "wrap",
        "align-content": "center",
        width: "45%",
        "justify-content": "flex-end",
      },
    });

    const colourPicker2 = background.createChild("div", {
      id: "colourPicker",
      styles: {
        display: "flex",
        "flex-wrap": "wrap",
        "align-content": "center",
        width: "45%",
        "justify-content": "flex-start",
        "margin-bottom": "1em",
      },
    });

    colours1.forEach((colour) => {
      colourPicker1.appendChild(this.createButton(colour, colourPicker1));
    });

    colours2.forEach((colour) => {
      colourPicker2.appendChild(this.createButton(colour, colourPicker2));
    });

    return background;
  }

  addControlButtons() {
    const controls = this.paintPage.createChild("div", {
      styles: {
        display: "flex",
        "flex-wrap": "wrap",
        "align-content": "flex-start",
      },
    });

    const eraser = controls.createChild(ControlButton, {
      src: "https://eyepaint.squidly.com.au/images/EyePaint/eraser.svg",
      class: "controls",
      styles: {
        width: "90%",
        height: "auto",
        margin: "5px",
        cursor: "pointer",
      },
    });

    eraser.onclick = () => {
      this.selectedColour = "white";
    };

    const resetButton = controls.createChild(ControlButton, {
      src: "https://eyepaint.squidly.com.au/images/EyePaint/reset.svg",
      class: "controls",
      styles: {
        width: "90%",
        height: "auto",
        margin: "5px",
        cursor: "pointer",
      },
    });

    this.paintIndicator = controls.createChild("div", {
      content: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 100 100">
  <defs>
    <style>
      .paint-bucket-fill {
        fill: var(--colour);
        stroke: #15b6ff;
        stroke-miterlimit: 10;
      }
    </style>
  </defs>
  <!-- Generator: Adobe Illustrator 28.7.1, SVG Export Plug-In . SVG Version: 1.2.0 Build 142)  -->
  <g>
    <g id="Layer_1">
      <path class="paint-bucket-fill" d="M83.75,18.21c.38-4.11-11.95-8.59-27.54-10.03-15.59-1.43-28.53.74-28.9,4.84-.33,3.58,6.92,10.14,19.68,12.02l-4.9,15.33,5.4,9.63,6.41-2.08-4.4,21.99,12.57,9.3,11.31-5.91,4.52-21.62-1.85-29.17c4.62-.9,7.53-2.39,7.7-4.31Z"/>
      <image width="76" height="86" transform="translate(7.52 1.44) scale(1.13)" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE0AAABXCAYAAABBRMhNAAAACXBIWXMAAAnXAAAJ1wGxbhe3AAAgAElEQVR4nO18aZQkV3Xmd+97EblVZVV1VfVe6lILLUhCEiBAC0ZsRiy2WWQBGowAHZvFYDGDMD4IzNieAYHlBQyeEeCD2QwCCdvDcFjMIiEhGbQBArWWltSreq2uLddY3r3zIyIyI7OyqqtbgvnDPacqIzMiXtz3xb333S0C+A39hn4dRL/uC77kyo8XzjnvxPJQwRZHi75fKvqGUaRiMWElAKBtRVNbGkZOgjiSVr0Z1xZNuDve2b7h7e9oApBfN995+pWC9r5P37jlKSdvPqHh5JKCtS8fKVemi56BEsGpwikQiUBU4JxCoBAFFIBAoSAQEZQAJQAKOCga7QjNVvtgqx3eVCr6/7ZYb+w+cujIgevedtnOX+V8MnrCQfvLz3/9hC1T6183Uip8cKRSIhWFAmiGEYIgxFy9hZlaDbVGE63YAUhAUgCUgiYEqFNICpSodsb3Cz6KpSKGykWUSkUYa+F5BmwMIhEszNd3RlF0XRyGN+3Ydv/DN/zFu2af6Dk+YaD9xee+tvbUk6av3zBSfZ6DggDU2xEOz89jx/7DiGKBoVSKFAAEAkqlKiEBoKJAepxTAJn0EaCa3ACIwgFQTSUy/X1kZAjV0SrKhSJswYKIUV+ot5vt9tW1+bnvfPKKV297Iub6eEFjAPLRr3//JWedOPXN7McoFmzbuRcH5xdhmTuqpSIpaAlMAkqASs8TKFQSrkRzYKoOBg3d3xQ5FVaFczGqI1VMTKyBXyzAWIsoDLEwO/c/W7Pzn/3UWy575Hgn/XhAYwD0nk9ff8pLz3v6tmxS7SjGbb98CJxKkaKrWup6QXMgqEgEIIxBIZNGMZKTVOGpii9EPjnx1ZjUzgEiOaBSaQO60oj0dwdABXAao1QuY+OmdfCKBRARGouLs0GtfsknLvu9W3CMC8vxgsbpp9x42z1fGh8ZvgxQEDFuu2872kGYSFYONIndY6L6kLN8DxHfcO3lr/jJ8Vz4yuu+8rKI6LecuLNCYD0TtghoTV7SJL14jC6ImeorBBunNmKoOgwQIQpCzB888KJ/uvyS76bzOiqAxwXa+ZdeWipMP/P35o7MXv/aFz174bwzTxkBFIYMvnnHz+BZCygQOXe/GvMPH7n85dcdz3VyxLltSv8yYRMAeOM1/3uah6vviQjnCdEpIKokdi8BzaUCn8CWmIrNJ56AoaEyFILmQnPvgft+8bQbrr7yMI4C3rGAxgDope/7+9eK8b5Ym1/Awuws3vCqi+eecerWMRGBMQa33PsAGkHw6Gwretqn3vqaheME4/FsA0D71FNPHX7mH7/vH0NDF4HNCTEAylQXgNNE2cuVIUxt2QShxGzMPLjzdz//tsu+gRWAWw1oDECec8XVkxNbt9znVCfrtTpmZ2bgROWVL31++PTpTcXhcgGqirl668Al55+9AYB5HAD08zfot6NtZ99DAO3X/v1nvhRb+xJlM4oOaMkhXsHH9JOmIeqgYMw+9OhrP/fWy25Iz18CHPf/MGj/K6++9pwzn/2MQwXPTjYaDdQWFsPJ0aFP3vvZj4wPVyrFnzy8C80gAgEYHSqt/+rtP729cOK0B8AiAY9z22YV2/Y4tvvH4PSzBGDs+v92xZ/c+CeXb4j2770kjt2B/CTb7QCHD84AYKgqhrduuf6MM84op2MswWglSWMA9Or3fvjE6ac8Zfv8fA2PPbYPQTv8xb5/uua5/nhh/Enn//aJ577mzd+pN+qIneCcLRuxdnQYCkWtGcjtd95z1l+/443bAXhYXoqeqO1jkcD27773I7/P69f/I4wpOCgKxRKmT5qCE4UQITh88Opb3/z6v922sJB5Nx2JW07SOB3crdu69c41w2XMzy3ABcGNOz/5wRf61cK4jV2humlqWiUZy2PGvbv347b7dyIIIgyXi/ziiy745We//+Pvvf7d71+bjvvrlLSVJLDyf6/5s2//n3e+YYLiaAcAMHexVVW4QqHaHOPs+CXgLAcY/+HH/vnPzz1t6+jOPQfRatR/+ovrPvT2NWuLox45n5js0MjkRqeCxYUamu0ABEIzDPHDbY/iru27UW+F2Dwx+ltvvPzyRz/7gx/f885rPnpqsTjqp+M/HgC83DmDtvuPzyaf/WUIjfz7f33TOaYd/HR8chxInW82jLlt22uFurUnD1eXqKgdAFoGXLR2bM27JRbU6w3EP/vWH0yOlUacCDMAItLC6Nj44Zk57HjsAKCK00/ZCmYDIsJsvYlbtz0Ma02ittWhU1/2khff8YIX/jYe2LPvn39+y3/8w9e/9LlDtUOHwnRSwPJqla1kAiBCYtyj9Lvmjs/smAXgp5+M5c2Q23DuhRs2nzw9WqyUkhiXCTOP7kXjwMHDfkXsYpkdanArgcYA+OThKr/g6g9euGliTXWx0YKP6N/23vXjVmmo5IlAhclJEGu5VJk8NF/D4YOHEqAmxzExPoZyuYhSoQQlRTsI8LPdB9AKAoyUizh10zqcMrXhTaddfsWbLr38Cuw6cPiXOx5+4MPb77r7wdtvvml2bvdDzRwASEE5AqB98003FbeetLVUKVdGrbVFNiaTWhXnIlEJozAKmq1me2FhoXX22ee0UmA9AGvS+QoAetorXrf27Fe86gNrT9z8SiepG+IEj969DQhj6OLCAd+pqaqjHD8KQPtBIwBUrKodXjN5QankY6HeRDx/6FumULZxpGJYhQDMLkYSKLbU601UhqtoN5tohRF8z8NItQoVgQCoWItyuQKoIogi3PPoXrTbAdgwpteOY93E2JnrnnX+Fy+88EK84corMVtrNA4cmfvh4T27vvTwXXc+8J1/+fTdhw4eXD86OvJ6AGNIHf2lQuMlH2VgdHSENm7YwGHQ9kT00Uaj8c3xiYk9z33zu0879bee/bHxTetfJMYAKnACxEGMPdt34ODDu2ELHqrVKhqPPbA/csJhVOTTR5i2LXRdzjxoBAAnD1e5HfgGhtYaAirFItCuHWKoipU4jigeGvbMy9/78Y+34Z0XRhGMMbDGQJ2DZ203sAaSIBAKVcCzBmsnxxFEMQ4fnsGOA4fxyP5DyYqlivHqENaOj1U2r5t86ZZN6156xjlPve7G6/6uXfC916VgxZlapduZemaSkKmnSfcFzLRpeHjoj9qt1tzln7rhzsmpTS+KohDtZoCDO/fiwK7HIOliRtaAmaBKeOw/b99bWesRoqW3Jw+aAqBo3PAoKR8+ONMKtpyADWNVVDdMnxW0w5/GVuJnveYtW7ae/4JbNq8Ztbf+4gE4JzDWwDkHYwyMzXza/MjUiUEVBN8YbNq4Afv2HYC4GIYITMDsQgOzC40k1HGCufm5T1zy5KkZa6s3OSeztdri7g0bNh5eOo2ltGf37jVjY2umjOUpAk0BKHz1nZf/6HnvvhZKXc8bIDBzBziAIBJGPjOnN2dF0ACAhqOY22SNNud/fu8jO3Hys8/FhRdc+Ffjf/OZc8pDw89/8tSG0UYY4rt334f5uRoqBR+z8/Ow1qDg+2A26I1ouqKQJRqVGKKKDRvWYs/efX34JsF2FEULX/vAO+772gfeAQDfXQ1QeZo64YRZALMAft4zYWsSgNJ0U8ZmmpFK/gsOK0DcUrV+W++bqfVIQX/sB1FQScA/+Og1PzxyZP6RG2+9C5aAC88+41VPnto4+tNH9+Jfb74DC7OLwVlnnIwnn3YS1q6dwPjkBMbXjMLY7pC98taVtE76RhTFUgnpdUHUXeaCIPjSsQK1GlLVmRX2gg1BXbi/YIUMUX4KnZV6OZcDE+sKlZ/97Z++4Kl/eu3t13/vto0iAhCBABkqmFva99/+wdJTz/hus9XEk7ZMQZCsPoYTwc9L1yDKFDbRgj7WRRC7+HtHmf/xEaOVKV2WRVcFjBKEFEQGGjV3ecYwMSl3U3cdGggaMykFJIVKufiL//XeF5iGxM9627svbM0eOvCjL3zugdHJ0si5l731onzuPhuWDSOLEjKJojQdk1HXwuViIE0KKQqg0Wzhxj9/+78eJywrEqu2BxqqbD8AiaJ9OmypGYq2jFly3/sXAtStEVUVj0gsIMzW8pAW7/7Cx+4WSzQxWRyNndri8NgGiICU0sypwhhOko+aT3gNlrf8Xe4sEgoQCKKy47gQWQXJcqKfERNI44ADUmYoMS05o183lGdjiVomdl4ci+diEY6FyBGgUCZVJaug4vDIhEvDjkxarDHoJ0rdjR7GiUDpSaqSwEoEkIIYmJ9f+PfVAHA8REwuYyjjgSitgClgiEGCVkQQw6w0Ex1VPaVkjDTKcVx0JrREFHsOiFjVwKiIOgMj7VCLlfJ6ySX1RAFi7qjkINJ8NKMKShntnKKEdhiiVCr9fOAATwApYEHUw2dSc0j1ggmuXd9PRMo8eDL9kkbbFhbEnxMnURi1VQPXci0Fmhqh5ZG2JOJ2q+1a1i+v79guAEyJPQN6F4AeoPonQNzjjygpgmYbm8bHbj4eQFZFTgodHjXjPjELAAA2iPY9dB8DSnVSS7xE0vpBcwBke23RhTWKEIdhK7LtmKXVINdQUMuKtJsRWlQorFdVIFV50Uw9+x1bWRIus3ZVNl+tIiXE4vCJd7xuV/9cL730UtNutd4QBu1rGo3Gs1aLUT+pqoclXKbAKWAI2HHTTQ8xQ+sK9QbYtOVcDtleW1TUICcOqakNeVSR2ETELi6I7mnUxRizDmEMBYE0sW2GTW5hyKhXFVT6ZE+zlRYgBpxzewcx9C9f/MLVKb+hZ83Lmo1GpVyp/GBFhAZNTMnn5Rwh7mTJNTCxMuyq1BPopmAUgOyo16OdO+eisEaRC8MoDpMY0LO+r6kzmhhUTdyNPqlakq4lglD3F6ddxxYAgiC4v5+hVqt5MQDrRH4UhNFXAbC15nmDZ74yqYgPoIfPzB1SYoiLYwDIooFtCwtHXT3zJEjUtaOyNc+KZ1he9opXbHaSLQJddyFxbFMGkNgz6nwbMAEkkpedDwCL8wtLWgdUNL7rrrs//IzL3/DD4eHh+5zIXQDM/v37JlfgfxnSQs8kRTsgeCCoxHsLzGSIlKnDeE9x5WiFlc7Y2YYToY1nPn0qc1cZ3QmzSSx6t7ykPTYLSBxe6hjfbrWdCFAnIHWN/ouXK5Xvf+hr3z93fOPZwXPe/t+/HMfuIQDke35xlfx3yKkkNi1li4g6ixVZgobte21ZLXdt2TFJ2hJSURIFVUbHN0pafU2nDCICpXAkK1MXmD4L1zumSqceKaoQkXwCskNt8m/ZuGkDjOdddOTIzD4ARlRWcu4HzyGKEx5z6skdlhguDPZ4ZZ8bUF0cEA1gEHMrUdU5qoCoNDS0XiE5w6DdwkT/ZQZctsf7ke5CICJQhQVQzR//3Le//2/Y8+AXfHietdPTJ84DMJOTa3tTJKug2Lmcu5EHT0HMYEFgAhLPsAyKBoBjA41EQSJKfrm8TvrikUGBd8JKLwlRz2122o0GmBnlcuUsJPn9TQA2ANjIxcpVa0ZHQAo4pwsA4BeKVx0D7wCAP/vKf4xkXOYlLeuDs4ahEs6HBDWMgdEAsEKWo486iMwuxo6svyWzTVk04BmzJLORjzuzo1kVXf87deOIgCyiMPbi3BDuhVd96CvGWhSLBThRREF7oEuyGtqz57ENPWghWQgyIma42vweIlKqI3Nsl9BqQcPpIyMUhz7VXV2Z7WbXyUok0Bimjswvnw4iCHV7KpxzHXclc1+YDV541YcPDZUKt9SD9lOj0A2vXb8GIgLnHFqt5nGHWM16fT2lGtGNBpJbrUgkfeHO791tGbKouXvfR8dk0wRKR1otMZ7dmDm0nYxsLo/WIdVE9XLfe6KBnD2jNAYdHx+FqGCh2XpOHOvwxMQ4fM+HghCFEYZLpceOhec8tVrt9cRm2ZvKxJjb9dgMp3d1UDQAHIOkRaI0lLhdysau06g3k2eYQEr9sHX2d2WyN1DuxJ3p70NDFRRLRQTtAH6xkB6e7A3DEJWSeWC1PPdTs9aa4II3cF/iZxICEbXslo0GgNVLGsUqpENKm4aGi9b3IaqdaEAVMNZ0FtO8XGcuRuYL5aOBThWI01S3Jo6mYUah2PVBkxANCKIYhx564I5V8ryEas16lYkHRAOJajoXN0rG9EcDx9w11GV8wiMnoAte8+ppUiSpnbzJp95gvRsN5MZQBWk3MyIqXbPSM4ncOVmoBkBdjJ98/csHV8tzP4VhON5Tw1CA09GZGIjjR2NV4xkW7ncoc7RqSQOSaGBy+pTNKt2pdaIBygVMuZV16Uh5SdNOYLqce5cWpwAQ4jA4bnsGAEPDQ6cnCYQcO51ohhG3ancND/sm59g+Pj8tiwaK1TUbXFr+yqIBoLfrpsNQH3D9Wdz8QtD9MbdsdSI/RRCGiKPw3tXyO4g8Y04C0O91JLwRgUUaALCSlAHHIGmdaKAytB7aGw1kNkG7gpPYsBUvndg06iylmZOb+mydo5L9YRAibIePK6Oriqn0M5kUZY6tgq2BqmsRoIZ5YG0go1VLmiio1g5gfH9TT34MieHup0Hqma8NAGnYlEYDQFaRygGWbggI7SDEcMnfvVp+B1EsWgQGS5ohAsLo8NGiAWB1oHHi2BYpaLMY60+J5FZFBTCodtkjK72+WkZZeqk/Cec0y6Bk7gwQBAEojh5cBb8D6c2f/NKEInEGMxYkl94yxiCcP/CwIZJcmnsgrV7SoLSrXhOy3uZuXwbSaCDpQlqpONxPBIZzLlXL7Bq9PU3oYEqI4xh3XP/Jn62W337at3v/03s1YmnsvPvrN96ZpbljlWWnsyrQIumIghhr1gOa631IY8f+K/RHA+itDXSOWbJsdgvLCoKKwqULxtzc7OJq+B1EC7MLT7Ke7U9MJfwjAS1WiZlUGaQlY5Z9jmA1oBEApNEAPK8w2rFp6WfSntR7kub2Zz/kHVtlwMUud/AyF2dCHMWwoDq6HZPHTLNHjkxZ2xsNdG4OJ71qABAEsQDAoDR3RqsKo7Jo4Lzx6TFmSqOBxICLJgXWjHpdjBWCdwFEHShL/aYFl/6sogJwUQxlPYJjjJXz5JXLzzXWJED1qgQsMSR2B31mNkTO+u2OszNorFVJWhYNbL34khM0fYq1x+fibpo7YWNpbaA/GgAELtbsBg/kMDMKcRyDRRZwDLFyPxlrzso7tkltII0GDENccJ9vhZk7tYHHtxCoKDkRGl8/tQlAX4luqcsxqDaQtAt31TMWBbjjlvVeLxtHk8SuqMABTXR6RI+ZSiJU6o6vaW0g+WbYwLWbD9rRglkpzZ2fyqpIFORXRzZkq1oukAKIu/6VZpLYp6rSa/RlUDSQO6cTnkEhoiAlxfFJGp//xitfYaxB1gqR6UHmVLBhkEPS9EKDm156BlzFRanqHJUEPFQqr++ZUbpp2aTpnZShTj4yF2cuyZg69KdFshvS9ZAU0mkX4CEk96q8Cp7zVF1sxk/3PQ+aY72n6cUYaNSeWanpJU+rejZKFNQOIyG/sEm0E0F32pYoXdN6LRvSbzmwMtdEkwZALHNDtVPoTpkgAhjTSJqTK0fhOU8eABSHqn/kFQu5wnY+zZ20iEljdgcRqVm2/J7j52gHZNHAoYYTMvYEIHuTQZcoNamJcFEvUEig49xCAGRVIVri2EpfNEBQWGsRRfEwkoJLAclDYquhyQuveNfvhHFcNam70W8OCEmjcuuhex5aqeklT6uyaWmaW8l6mzp2C13J4r6Udv86mNQGuscQpZLWR6oKThuJVLNyM8HzLMQJLnrL1W9KJ7MGCYAr0UYAjcAW/7pcKnfi2vRKyDAxxkAVOPyL+/et1PSSp6OC1nKu8+SIZ8x6Iu1kbYFEw5asgNqXW+mrDQCAONepDWRE6JRBO5NTAMViEaoEKpSvAZBV4CcBrAOQr7JbABNIyn84941XXd2sNzcUh5fXaDaE2MURAAQmFl7OZuTPOcp+ssSaRgNi/UKpa6O160FQvzrmBkiXhx5JAxC5OD1WO4wokuJG/zixKIaGSohV6flXfehWAPV0lwUwjgSkTUhALACQC654138JhN5TLpVgjEWnBT6lzlMDbEDO7VN0W+BXigYyXlekWIXisvLFF1+8KTuFkADWWQgGxJ752kB/KgkAxElPbaAzGRXk5TRT0pGRKlQFYRCd+dwr/8fO0575zAoGe+wLz37b+79cd3wtRDA8vqZn/F5SWGMgEu/LWuCXa3rJ09H8niQacELrz37WVBJg9/pX3eTK0QbKu8QMcXHOTcnFgcnRnf/JW2EUvl9EpVJGs9FEJDI6/ozfefDZT3/JTLni30IiD4vQ2vl6/aIwclsWGm0mKKqjYyDiDrM9LfBgiCbP3WuzsduvWIaSLvLyae7VgpamuYl4qHoSMUHdgMxE5+DuMt5DDKQvzQCQevjSV3oZMKjLmijTktfk5AT2uwMI22ES9wITc4vNV0VhlBsjGadaraIwVEFPnJbnLV0Y2FhEUXufeIZa4VF7vzvTWZGyNDe80oa9Bw8nhY4++0SaS3OvIhqI4jhxN/L3lKh7burlMrL2he7Ja9etw/jEODRdfSVOXBdC8uYXIou169ehNDycqOUSGKhnkwnQKDzCAelKTS95Oqp6AoCIEiRaPHh4FqVCAf2pvO6jcGnmQ7JTU8ki6gb4CsQuXl5acySgzrNSeSqVy9g8PQXnFPVaHYKkFEiZkQQQi3RZyFykVNiJAEdJj7AAkFZ9fxINIJ9fXZaOKmmiIKdKt33kA9f71sPOPftQb7Y6+wlAEIQdn63rjPRFA7k+jyiKl+TpFTnHNnezSQHSfHmw9yxjGZ6xsNYCzJ1xGJk7Q6nDnZtT2gJvTLJmx7Mz+yh9Dso7MsCB7KOVQOvZNzLmFdrbf/IHALDrsf04NDMHTt9tNjc3n2AyqGLRR0RAHEU9WrIkzZ0dm0s2ZQtG9p2RrMA9Y+dX4dyxQK/aJ98J1ngACLU7vr3DMoTqtGKaO6NjSuo99I2v/LJ97w9fb63FzOwcHnx0F7L3ox04eAhx7AYa9LxjS2CEYZSsnD2CqB1uVClNlvTazrzsCgixizGIMl+vYyXQj0LCj/EMGvOLcE1dZFKtK1ZMc3fGX2GfAMmzUp5hiQ2cYbhdt3/74X03/t2LfZYHoyjGg4/swu69ybtBZg7PYHZuvkfiVPrZFUTRUpvWHw30Rxn59hlK8XW5E1ze9KXGk4Eem9Z7NcXcwUNot5qu7QQtdrqaaAA4es6dx8ZKXDDMGrM1BlaFLMI2Zu68+dslcreXpk5+casdmJnZeSzWGyhaiyAI0A5CFAs+iDlNMSf81BsttNrtruSkIVmiovknkJN/XQlNneksm+scXNR9VjpT8bzfl1fprlQTFufnUZudhfULsAaPNH7+4897RI5sFG2bWYyxzBPFqwZt0vnknMc+xySWGEhaUw0zNw/vXly86+brjWvfOjx9yrntMBqenV/EkfkF1BsNhFGEMAhQrzdQa7ZQq9fRarY6N5/SWXZfLpdFA5lO9XbWZUCSAnHskhJgHjTKBEt7HOcMtIXZOdRm5xCFIdgYGGsx4ub/UvdtexSCQEmiQ7XQYYVoAOgxx8uCytPTY3asYXxbQQmqZShKDlwkoGgJfkywEkc69qTTJ6unn38BrTvxHUE7TNwFEDxmlMslVIeH4Ps+NHVuRRNJk3SicaZumq7EonDQtOEvOT4z5q1WC7FLH6tOJTJ74UDnTYAiaCzU0Gg2IOI6OTRSBXse1hf12iPf+MxnUeRGK5R6i7W1a/d8iO4LBo4LNAZAp4+MmMYI2TFjfE+pGJEWjVKRgaIABTB55NSSMVbimBjK1ZPPWluaPv3M4ubT/rAWRmuSlU5A4CS9DMCzFqViEV7Bg+d5id+kaZ1Tswp8+s7HHtCAeqPZCemAJNUUBAGCVP1FHMS5nNomN0FEMTpU2qc/+/Yfy6Hd+2LihnNYVKONGkl758656PGClgHHp4+McGOE7JqW9ZyNCzDW94gLTK6oxL6yeHDsMaslwGhS4jESxVJZu67irTthsrjp1CcXNm79/XqkUy6Ou+8zU01fiJlmaYnSV74kktp17FMwnUM7BQaSLAiavkwyX5OVVCpFBIVCERVt3KDb7/h6e/dDe+HZmBwasVDdM1Kbr6OJIAy2145u01YDWgYcIVXVQt1aU4q9ijG+RPCVyVdW32PyEMODUeuYLIuaBEAQK5vYCeAUbIiGTjhlXCvVKkrDY9WtT3mOFstPCZU2Be0wkQrVdOXNIoluzBVFMaIoAlSSN5Omn9nDH4YtKiWv5kvwn/WH7/lWIWrNhjvvP+AANUwORJGStmOHBow2ONRGqFHL1TnatrCQve/jcYPWA9zJw1UOx9j4TWtN0XnD1nhBDFsw6iuRB1GPmCw5ss6ogZA1Biyihgms6YOhrMqqSk7S14mSoFAuet6atRUqjpS44Bcc2DowO1GjaVLOuRBOksYYyyzE6lgRWxcFrjnXCA7sW3AOgElCpVhVDdQp4KAcOdXAQNogtFpGGl7NtOdb7WBHvZ4B9oSBlgGXndcDXrGixkZiYawHTzyOjCUjlkStM8aQqGWjRgTMykaMMqsyFMRKrKSkDEqeuEwAzS6q2v9s34CJpGGQECU+rTghJRVWJ46cYXVwFMeWQlIJHWnbU2pHpO0558LKgsaD3pX2RICW0RLwonHDhbq1ZVIOis7YWK2xnjWiJvbVcMyWjRqXvG/TGIERJTYCdlbYKDGUyWVgWZBRUE++ddBjymmsRSB1BEUMZSIlElGGczGJYXUqGoMpItUocBTCxaGJbRD7QZyqZSZhR40Ijhe0QeDR6SMjHIlSOMam2PRMmZTjsrLv1AS+Gi+yxqmy8dV4Ao4dG+uBnSiLgo0qizFsoSQCVnR8X9hlnuuOM9AIyqRCRBqDVEViJohz7Dx2TmKKhSl2cRSrb6KwwXEwFMflOXHHAtgTAVqeBgIYjRsejmIOg2Hw1jwAAAELSURBVCJnIEZOuCTgqAguOMuxgFWVPAVLQcmTpOLnkle1QY6SCeDUETEsEjHEhJS8/pvJWaMSh84FBq7QNi70AtfwrfOOONleW+y8mBmrBCyb4K+CegBEAiJFohSrkKyxPBQ7jsMiCZQqw8pOQE6ESkosaT9cVEzGKYlZkc8WJ89RckvVEGmLIZ5hMQxt1Eh8P5C6NeLPifOYNJWsfAp01YBlk/p1UB7E7LMHSJ3wkpKqKFWdo+xR9zgsrorHrD2KCbpojBKTZrmx7bXFPEjHBVSefl2gDaL+l0PlAQWQVPez7Vw3Zg/lC7u50lsenMcNUj/9/wRtNXSsTXxPGDAr0XG3Y/6GfkPHRP8PNRqTEZHyUfgAAAAASUVORK5CYII="/>
    </g>
  </g>
</svg>`,
      styles: {
        width: "90%",
        height: "auto",
        margin: "5px",
        cursor: "pointer",
      },
    });

    this.addButtonAnimation(eraser);
    this.addButtonAnimation(resetButton);

    resetButton.onclick = () => {
      this.resetColours();
    };

    return controls;
  }

  setupSVGInteraction(svgElement) {
    const elements = svgElement.querySelectorAll(
      "path:not([fixed]), g:not([fixed]), circle:not([fixed]), rect:not([fixed])"
    );
    elements.forEach((element, index) => {
      const elementId = `${this.selectedImage}-element-${index}`;
      element.id = elementId;
      console.log(`Setting up element: ${elementId}`);

      element.onclick = (e) => {
        if (this.selectedColour) {
          const update = { id: elementId, color: this.selectedColour };
          console.log("Sending color update:", update);
          this.applyColourUpdate(update);
          this.app.set("colorUpdates/" + element.id, this.selectedColour);
        }
      };
    });
    console.log(`Total elements set up: ${elements.length}`);
  }
  applyColourUpdate(update) {
    if (!update) {
      console.warn("Invalid update received:", update);
      return;
    }
    for (const id in update) {
      const element = this.paintPage.querySelector(`#${id}`);
      if (element) {
        element.style.fill = update[id];
        console.log(`Applied color ${update[id]} to element with id ${id}`);
      } else {
        console.warn(`Element with id ${id} not found`);
      }
    }
  }

  resetColours() {
    this.paintPage
      .querySelectorAll(
        "path:not([fixed]), g:not([fixed]), circle:not([fixed]), rect:not([fixed])"
      )
      .forEach((element, index) => {
        const elementId = `${this.selectedImage}-element-${index}`;
        const update = { [elementId]: "white" };
        this.applyColourUpdate(update);
        this.app.set("colorUpdates", update);
      });
  }

  checkVectorOnItem(vector) {
    let x = vector.x;
    let y = vector.y;
    // let items = this.items.children;
    let items = this.paintPage.querySelectorAll("button, img");
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      let rect = item.getBoundingClientRect();
      // enlarge clickbox by 10%
      if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
        return item;
      }
    }
    return null;
  }

  checkVectorOnElement(vector) {
    let x = vector.x;
    let y = vector.y;
    let elements = this.canvas.querySelectorAll("path:not([fixed])");
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      let rect = element.getBBox();

      // add canvas width and height to the rect
      let canvasRect = this.canvas.getBoundingClientRect();
      if (
        x > rect.x + canvasRect.left &&
        x < rect.x + rect.width + canvasRect.left &&
        y > rect.y + canvasRect.top &&
        y < rect.y + rect.height + canvasRect.top
      ) {
        return element;
      }
    }
    return null;
  }

  // // check if eye position is on an item and call the opacity animation
  set eyePosition(vector) {
    let item = this.checkVectorOnItem(vector);
    let element = this.checkVectorOnElement(vector);
    [...this.paintPage.querySelectorAll("button, img")].forEach((i) => {
      i.hover = false;
    });
    if (item) {
      console.log("item: ", item);
      item.hover = true;
    }

    if (element) {
      this.setLoaderSVG(element);
      this.loader.hover = true;
    } else {
      this.loader.hover = false;
    }

    if (this.loader.progress >= 0.95) {
      const event = new Event("click");
      if (element) {
        element.dispatchEvent(event);
        this.loader.progress = 0;
      } else {
        console.warn("No element to click");
      }
    }
  }

  setLoaderSVG(element) {
    const bbox = element.getBBox();
    this.loader.position = new Vector(
      bbox.x + bbox.width / 2,
      bbox.y + bbox.height / 2
    );
    this.loader.size = 3;
    this.loader.hover = true;
  }
}

export default EyePaint;
