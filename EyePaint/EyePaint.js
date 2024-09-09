import {
    SvgPlus,
  } from "https://session-app.squidly.com.au/src/Apps/app-class.js";

class EyePaint extends SvgPlus {
    constructor(isSender, app) {
        super("div");

        this.isSender = isSender;
        this.app = app;

        this.styles = {
            display: "flex",
            "justify-content": "center",
            height: "100vh",
            margin: "0"
        }
        this.props = {
            id: "eyePaint"
        }

        const svgString = `
        <svg width="50vw" height="50vh" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:#915a31;}.cls-1,.cls-2,.cls-4,.cls-5,.cls-6{stroke:#000000;stroke-miterlimit:10;}.cls-1,.cls-2{stroke-width:4px;}.cls-2{fill:#a06538;}.cls-3{fill:#d6d6d6;}.cls-4{fill:#333;}.cls-4,.cls-5,.cls-6{stroke-width:2px;}.cls-5{fill:none;}.cls-6{fill:#ffffff;}</style></defs><title/><path class="cls-1" d="M143.41,87.3c2.12,2.75,3.38,14.05-4.72,14.05-6.54,0-22.6-6.84-22.6-20.37s-18-51.44-18-51.44c22.45,0,43.66.88,43.66,28.83C141.76,58.37,141.29,84.55,143.41,87.3Z"/><path class="cls-1" d="M6.59,87.3c-2.12,2.75-3.38,14.05,4.72,14.05,6.54,0,22.6-6.84,22.6-20.37s18-51.44,18-51.44c-22.45,0-43.66.88-43.66,28.83C8.24,58.37,8.71,84.55,6.59,87.3Z"/><path class="cls-2" d="M119.27,73.22c0,47.32-16.91,61.52-44.27,61.52s-44.27-14.2-44.27-61.52,24.77-58,44.27-58S119.27,25.9,119.27,73.22Z" data-name="&lt;Path&gt;" id="_Path_"/><path class="cls-3" d="M104.69,121.79c-6.7,7.46-16.2,11-29.69,11s-23-3.49-29.69-11c2.94-12.49,8-26.67,14.06-35.75C67,74.6,69.49,38.94,67.62,17.82a48.91,48.91,0,0,1,14.76,0C80.51,38.94,83,74.6,90.63,86,96.69,95.12,101.75,109.3,104.69,121.79Z"/><path class="cls-4" d="M75.77,119.33c-3.18,0-15.65-16.29-14.62-18.84s5.21-5,14.62-5,13.59,2.42,14.64,5S79,119.33,75.77,119.33Z"/><path class="cls-5" d="M82.41,122.37c-.47,4.17-4.25,6-7.14,6s-6.67-1.84-7.13-6"/><circle class="cls-6" cx="53.02" cy="75" r="10.57"/><circle class="cls-6" cx="96.98" cy="75" r="10.57"/><circle cx="55.34" cy="75" r="5.92"/><circle cx="94.66" cy="75" r="5.92"/></svg>`;
        
        // SVG that can be coloured in
        this.svg = SvgPlus.parseSVGString(svgString);
        // Reference image
        this.reference = this.createChild("img", {
            src: "http:/127.0.0.1:5502/images/EyePaint/dog.svg",
            styles: {
                position: "absolute",
                top: "0",
                right: "0",
                width: "500px",
                height: "500px"
            },
        });
        
        // Reset the SVG so nothing is coloured in yet
        this.svg.querySelectorAll("path, circle, rect").forEach(section => {
            section.style.fill = "white";
        });
           
        const gameContainer = this.createChild("div");
        gameContainer.appendChild(this.svg);

        // Contains all the colours, eraser and reset button
        const colourPicker = gameContainer.createChild("div", {
            styles: {
                display: "flex",
                "flex-wrap": "wrap",
                "justify-content": "center",
                "max-width": "800px",
                margin: "0 auto"
            },
        });

        let selectedColour;
        const colours = [
            '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#000000',
            '#FFA500', '#800080', '#008000', '#000080', '#800000', '#008080'
        ];

        colours.forEach(colour => {
            const button = colourPicker.createChild('button');
            button.styles = {
                width: "100px",
                height: "100px",
                border: "3px solid #ccc",
                "border-radius": "50%",
                margin: "10px",
                cursor: "pointer",
                transition: "transform 0.2s",
                "background-color": colour
            }

            // "Selects" the colour
            button.onclick = () => {
                selectedColour = colour;
            };

            // Hover effect
            button.onmouseover = () => {
                button.styles = { transform: "scale(1.2)" };
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
            }
            button.onblur = () => {
                button.styles = { "box-shadow": "none" };
            }

            colourPicker.appendChild(button);
        });

        // Colour in any section when it is clicked on
        this.svg.querySelectorAll("path, circle, rect").forEach(section => {
            section.onclick = () => {
                if (selectedColour) {
                    section.style.fill = selectedColour;
                }
            }
        });

        let eraser = colourPicker.createChild("img", {
            src: "http:/127.0.0.1:5502/images/EyePaint/eraser-unselect.svg",
            class: "controls",
            styles: {
                width: "100px",
                height: "100px",
                margin: "10px",
                cursor: "pointer"
            },
        });

        // Change the eraser icon
        this.eraserSelected = true;
        eraser.onclick = () => {
            if (this.eraserSelected) {
                eraser.props = {
                    src: "http:/127.0.0.01:5502/images/EyePaint/eraser-unselect.svg"
                }
                this.eraserSelected = false;
            } else {
                eraser.props = {
                    src: "http:/127.0.0.01:5502/images/EyePaint/eraser-select.svg"
                }
                this.eraserSelected = true;
            }
        }
        
        const resetButton = colourPicker.createChild("img", {
            src: "http:/127.0.0.1:5502/images/EyePaint/reset.svg",
            class: "controls",
            styles: {
                width: "100px",
                height: "100px",
                margin: "10px",
                cursor: "pointer"
            }
        });

        // Reset to default SVG
        resetButton.onclick = () => {
            this.svg.querySelectorAll("path, circle, rect").forEach(section => {
                section.style.fill = "white";
            });
        }
    }
}

export default EyePaint;