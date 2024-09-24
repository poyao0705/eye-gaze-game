import {
  SvgPlus,
  SquidlyApp,
} from "https://session-app.squidly.com.au/src/Apps/app-class.js";

async function loadSVGs(images) {
  let svglib = {};
  let promises = images.map((image) => {
    let a = async () => {
      let url = `http://127.0.0.1:5502/images/eyepaint/${image}.svg`;
      svglib[image] = await (await fetch(url)).text();
    }
    return a();
  });
  await Promise.all(promises);
  return svglib;
}

const images = ["dog", "cat", "horse", "parrot", "pig", "rabbit", "sheep", "turtle"];
const svgAssets = await loadSVGs(images);
// console.log(svgAssets);

const displayContentDefaultStyle = {
  id: "displayContent",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "grid",
  gap: "20px",
  width: "60%",
  height: "60%",
  aspectRatio: "1 / 1",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  borderRadius: "10px",
  padding: "20px",
  boxSizing: "border-box",
};

const colours1 = [
  '#FF0000', '#00FF00', '#000080', '#FFFF00', '#000000'
];

const colours2 = [
  '#FFA500', '#800080', '#800000', '#FFFFFF'
];

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
      // justifyContent: "center",
      // alignItems: "center",
      "background-image": "url('http://127.0.0.1:5502/images/EyePaint/background.jfif')",
      "background-size": "cover",
      "background-position": "center",
      "background-repeat": "repeat",
      // overflow: "hidden",
    };

    this.props = {
      id: "eyePaint"
    };

    // Create separate divs for each page
    this.initPage = this.createChild("div", { id: "initPage", styles: { display: "none" } });
    this.loadPage = this.createChild("div", { id: "loadPage", styles: { display: "none" } });
    this.paintPage = this.createChild("div", { id: "paintPage", styles: { display: "none" } });

    this.app.onValue("state", (stateObj) => {
      this.State = stateObj;
    });

    this.app.onValue("colorUpdates", (update) => {
      this.applyColourUpdate(update);
    });

    this.app.set("state", { page: "init", selectedImage: null, pageNumber: null });
  }

  set State(stateObj) {
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

  init() {
    this.hideAllPages();
    this.initPage.innerHTML = "";
    this.initPage.style.display = "block";
    // console.log("init page");

    // Center logo in the middle of the page
    const logo = this.initPage.createChild("img", {
      src: "http://127.0.0.1:5502/images/eyepaint/main_page.jfif",
      styles: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "48%",
        height: "75%",
        "border-radius": "2%",
        border: "0.8em solid white",
      },
    });

    // Start button under the logo
    const startButton = this.initPage.createChild("button", {
      innerHTML: "Start",
      id: "startButton",
      styles: {
        position: "absolute",
        bottom: "10%",
        left: "50%",
        transform: "translateX(-50%)",
        "background-color": "#ebb434",
        "border": "3px solid white",
        "border-radius": "5px",
        "color": "black",
        "padding": "12px 20px",
        "font-size": "16px",
        "font-weight": "bold",
        "cursor": "pointer",
      },
    });
    startButton.addEventListener("click", () => {
      this.app.set("state", { page: "load", selectedImage: null, pageNumber: 1 });
      console.log("start button clicked");
    });
  }

  createPaginationButtons(innerHTML, id, position) {
    return this.loadPage.createChild("button", {
      innerHTML: innerHTML,
      id: id,
      styles: {
        position: "absolute",
        top: "50%",
        [position]: "0",
        "background-color": "orange",
        "border": "2px solid white",
        "border-radius": "5px",
        "color": "black",
        "padding": "10px 20px",
        "font-size": "16px",
        "font-weight": "bold",
        "cursor": "pointer",
        "z-index": "1000",
      },
    });
  }

  loadImageOptions() {
    this.hideAllPages();
    this.loadPage.style.display = "block";
    this.loadPage.innerHTML = "";
    
  
    // Update loadPage styles
    this.loadPage.styles = displayContentDefaultStyle;
    this.loadPage.style.gridTemplateColumns = "repeat(2, 1fr)";
    this.loadPage.style.gridTemplateRows = "repeat(2, 1fr)";

    let images = Object.keys(svgAssets).sort();
    let startIndex = (this.pageNumber - 1) * 4;
    let endIndex = startIndex + 4;
    // end page is the length of the images array
    let endPage = Math.ceil(images.length / 4);
    let imagesToShow = images.slice(startIndex, endIndex);
    console.log(imagesToShow);
    // create next button and previous button
    if (this.editable) {
      const nextButton = this.createPaginationButtons("&#9654;", "nextButton", "right");
      nextButton.addEventListener("click", () => {
        if (!(this.pageNumber + 1 > endPage)) {
          this.app.set("state", { page: "load", selectedImage: null, pageNumber: this.pageNumber + 1 });
        }
        this.loadImageOptions();
      });

      const previousButton = this.createPaginationButtons("&#9664;", "previousButton", "left");
      previousButton.addEventListener("click", () => {
        if (!(this.pageNumber - 1 < 1)) {
          this.app.set("state", { page: "load", selectedImage: null, pageNumber: this.pageNumber - 1 });
        }
        this.loadImageOptions();
      });
    }
  
    imagesToShow.forEach((image, index) => {
      let imageOption = this.loadPage.createChild("div", {
        id: "imageOption",
        styles: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          cursor: "pointer",
          transition: "transform 0.2s",
          "border": "2px solid white",
        },
      });
  
      let img = imageOption.createChild("img", {
        src: `http://127.0.0.1:5502/images/eyepaint/${image}.svg`,
        styles: {
          width: "40%",
          height: "40%",
          margin: "auto",
          objectFit: "contain",
        },
      });
      if (this.editable) {
        imageOption.addEventListener("click", () => {
          console.log(image);
          this.app.set("state", { page: "paint", selectedImage: image, pageNumber: this.pageNumber });
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

  paintImage(selectedImage) {
    this.hideAllPages();
    this.paintPage.style.display = "block";
    this.paintPage.innerHTML = "";
    // this.contentContainer.style.gridTemplateColumns = "20% 5% 1fr 20%"; // Restore original grid
    this.paintPage.styles = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "grid",
    };
    this.paintPage.style.gridTemplateColumns = "20% 5% 1fr 20%";
    this.paintPage.style.gridTemplateRows = "1fr";
    // Update displayContent styles to center its content
    this.paintPage.styles = {
      gridColumn: "3",
      gridRow: "1",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: "10px solid white",
      margin: "1em",
      padding: "2em", // Add padding to give more space around the image
      boxSizing: "border-box", // Ensure padding is included in the element's total width and height
      overflow: "hidden",
    };

    const svgContent = svgAssets[selectedImage];
    console.log(svgContent);
    const svgElement = SvgPlus.parseSVGString(svgContent);
    
    // Set a fixed size for the SVG container
    svgElement.style.width = "100%";
    svgElement.style.height = "100%";
    svgElement.style.maxWidth = "500px"; 
    svgElement.style.maxHeight = "500px";
    svgElement.style.objectFit = "contain"
    
    this.paintPage.appendChild(svgElement);
    
    // Reset all colors to white
    svgElement.querySelectorAll("path:not([fixed]), g:not([fixed]), circle:not([fixed]), rect:not([fixed])").forEach((element) => {
      element.style.fill = "white";
    });
    this.setupSVGInteraction(svgElement);

    // Add colour palette
    const colourPicker = this.addColourButtons();
    const controls = this.addControlButtons();
    // Swap colourPicker with the SVG so that colourPicker is on the left
    this.paintPage.insertBefore(colourPicker, this.displayContent);
    this.paintPage.insertBefore(controls, this.displayContent);

    // Create a container for the right column content
    this.contentRight = this.paintPage.createChild("div", {
      id: "contentRight",
      styles: {
        gridColumn: "4",
        gridRow: "1",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-end",
        // padding: "1em",
        position: "absolute", // Add this to make it a positioning context
        // bottom right corner
        // make sure button is not covered
        bottom: "0",
        right: "0",
        height: "100%", // Ensure it takes full height of its grid cell
        width: "20%",
      },
    });
      // Create a container for the top buttons (camera and back)
    const topButtons = this.contentRight.createChild("div", {
      id: "topButtons",
      styles: {
        display: "flex",
        justifyContent: "flex-end",
        width: "100%",
      },
    });

    // Add camera button
    const camera = topButtons.createChild("img", {
      id: "camera",
      src: "http://127.0.0.1:5502/images/EyePaint/camera.svg",
      styles: {
        width: "31.5%",
        height: "11%",
        margin: "5px 5px 0 0",
        cursor: "pointer",
      },
    });

    // Add back button
    const back = topButtons.createChild("img", {
      id: "back",
      src: "http://127.0.0.1:5502/images/EyePaint/back.svg",
      styles: {
        width: "31.5%",
        height: "11%",
        margin: "5px 5px 0 0",
        cursor: "pointer",
      },
    });

    this.addButtonAnimation(back);
    this.addButtonAnimation(camera);

    back.addEventListener("click", () => {
      // set it to page 1
      this.app.set("state", { page: "load", selectedImage: null, pageNumber: 1 });
      this.loadImageOptions();
    });

    // Add reference image at the bottom
    this.reference = this.contentRight.createChild("img", {
      src: `http://127.0.0.1:5502/images/eyepaint/${selectedImage}.svg`,
      styles: {
        position: "absolute", // Position it absolutely within contentRight
        bottom: "3em", // Distance from the bottom
        right: "3em", // Distance from the right
        width: "80%", // Width relative to contentRight
        maxHeight: "50%", // Maximum height
        objectFit: "contain", // Maintain aspect ratio
        zIndex: "1", // Ensure it is below the drawing image
      }
    });
  }

  addButtonAnimation(button) {
      button.addEventListener('mousedown', () => {
        button.style.transform = 'scale(0.9)';
        button.style.transition = 'transform 0.1s ease-in-out';
      });

      button.addEventListener('mouseup', () => {
        button.style.transform = 'scale(1)';
        button.style.transition = 'transform 0.1s ease-in-out';
      });
  
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
        button.style.transition = 'transform 0.1s ease-in-out';
      });
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
    const background = this.createChild("div", {
      styles: {
        display: "flex",
        "flex-direction": "row",
        "background-image": "url('http://127.0.0.1:5502/images/EyePaint/palette.png')",
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
        "justify-content": "flex-end"
      }
    })

    const colourPicker2 = background.createChild("div", {
      id: "colourPicker",
      styles: {
        display: "flex",
        "flex-wrap": "wrap",
        "align-content": "center",
        width: "45%",
        "justify-content": "flex-start",
        "margin-bottom": "1em",
      }
    })

    colours1.forEach((colour) => {
      colourPicker1.appendChild(this.createButton(colour, colourPicker1));
    });

    colours2.forEach((colour) => {
      colourPicker2.appendChild(this.createButton(colour, colourPicker2));
    });

    return background;
  }

  createButton(colour, colourPicker) {
    const button = colourPicker.createChild("button", {
      styles: {
        width: "88%",   
        height: "15%",
        "padding-left": "2em",
        "padding-right": "2em",   
        "border-radius": "50%", 
        background: `linear-gradient(225deg, ${colour} 40%, ${this.shadeColour(colour, 0.7)} 100%)`,
        border: "6px solid white",
        margin: "1em 0em",
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
    // Creates a border when the button is clicked on and removes it when it is not
    button.onfocus = () => {
      button.styles = { 
          outline: "none",
          "box-shadow": "0 0 0 3px rgba(66, 153, 225, 0.5)"
      }
    };
    button.onblur = () => {
        button.styles = { "box-shadow": "none" };
    };

    return button;
  };

  addControlButtons() {
    const controls = this.paintPage.createChild("div", {
      styles: {
        display: "flex",
        "flex-wrap": "wrap",
        "align-content": "flex-start"
      },
    });

    const eraser = controls.createChild("img", {
      src: "http://127.0.0.1:5502/images/EyePaint/eraser.svg",
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
      // eraser.props = {
      //   src: this.selectedColour === "white"
      //     ? "http://127.0.0.1:5502/images/EyePaint/eraser-select.svg"
      //     : "http://127.0.0.1:5502/images/EyePaint/eraser-unselect.svg"
      // };
    };

    const resetButton = controls.createChild("img", {
      src: "http://127.0.0.1:5502/images/EyePaint/reset.svg",
      class: "controls",
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
    const elements = svgElement.querySelectorAll("path:not([fixed]), g:not([fixed]), circle:not([fixed]), rect:not([fixed])");
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
      const element = this.paintPage.querySelector(`#${id}`);
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
    this.paintPage.querySelectorAll("path:not([fixed]), g:not([fixed]), circle:not([fixed]), rect:not([fixed])").forEach((element, index) => {
      const elementId = `${this.selectedImage}-element-${index}`;
      const update = { id: elementId, color: "white" };
      this.applyColourUpdate(update);
      this.app.set("colorUpdates", update);
    });
  }
}

export default EyePaint;
