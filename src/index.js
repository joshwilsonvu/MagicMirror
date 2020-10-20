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

// Get the DOM element for React to render into
const root = document.getElementById("root");

// Render MagicMirror with React
ReactDOM.render(<MagicMirror initialConfig={config} />, root);

// Automatically updates the screen when source files are changed.
// Certain changes will still require you to quit and restart `mm start`.
if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.accept(['../config/config', './magic-mirror'], ({ deps }) => {
    const config = deps[0].default;
    const MagicMirror = deps[1].default;
    ReactDOM.render(<MagicMirror initialConfig={config} />, root);
  });
  import.meta.hot.dispose(() => ReactDOM.unmountComponentAtNode(root));
}
