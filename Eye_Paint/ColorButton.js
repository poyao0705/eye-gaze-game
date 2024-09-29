import {
    SvgPlus,
    SquidlyApp,
} from "https://session-app.squidly.com.au/src/Apps/app-class.js";

class ColorButton extends SvgPlus {
    constructor(params) {
        super("button");
        this.color = params[0];
        this.editable = params[1];
        this._progress = 0;
        this.hover = false;
        this.setupButton();
        this.animate();
    }

    setupButton() {
        this.styles = {
            width: "88%",   
            height: "15%",
            "padding-left": "2em",
            "padding-right": "2em",   
            "border-radius": "50%", 
            background: `linear-gradient(225deg, ${this.color} 40%, ${this.shadeColour(this.color, 0.7)} 100%)`,
            "border-width": "6px",
            border: "6px solid white",
            margin: "1em 0em",
            cursor: "pointer",
            transition: "transform 0.2s",
            position: "relative",
        };
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

    async animate() {
        if (!this.editable) {
            while (true) {
                await this.waitFrame();
                if (!this.hover) {
                    this.progress -= 0.005; // Decrease progress when not hovered
                } else {
                    this.progress += 0.02; // Increase progress on hover
                }
            }
        }
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
            const focusEvent = new Event("focus");
            this.dispatchEvent(focusEvent);
        }

        this._progress = value;
        
        // Update the border progress bar
        // this.updateProgressRing(value);
        // opacity
        this.style.opacity = 1 - value;
    }

    get progress() {
        return this._progress;
    }

    waitFrame() {
        return new Promise(resolve => requestAnimationFrame(resolve));
    }
}

export default ColorButton;
