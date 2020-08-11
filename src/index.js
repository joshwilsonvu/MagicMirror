import React from "react";
import ReactDOM from "react-dom";
import MagicMirror from "./magic-mirror";
import config from "../config/config";

// add the CSS to the page
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "roboto-fontface/css/roboto-condensed/roboto-condensed-fontface.css";
import "./main.css";

// uncomment the next line if you want to use custom CSS
/* import ../css/custom.css */

// Create a DOM element for React to render into
const root = document.createElement("div");
document.body.appendChild(root);

// Render MagicMirror with React
function render() {
  ReactDOM.render(<MagicMirror initialConfig={config} />, root);
}
render();

// When run with `mm start`, automatically updates the screen
// when source files are changed. Certain changes will still
// require you to quit and restart `mm start`.
if (module.hot) {
  module.hot.accept();
  module.hot.accept(["./magic-mirror", "../config/config"], () => {
    ReactDOM.unmountComponentAtNode(root);
    render();
  });
}
