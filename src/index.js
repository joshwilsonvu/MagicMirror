import React from 'react';
import ReactDOM from 'react-dom';
import MagicMirror from './magic-mirror';
import config from '../config/config';

// make CSS globally available
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'roboto-fontface/css/roboto-condensed/roboto-condensed-fontface.css';
import './main.css';
/* import ../css/custom.css */


// Create a DOM element for React to render into
const root = document.createElement('div');
document.body.appendChild(root);

// Render MagicMirror with React
function render() {
  ReactDOM.render(
    <MagicMirror initialConfig={config}/>,
    root,
  );
}

render();

// In development, this lets the app quickly restart when source files are changed
if (module.hot) {
  module.hot.accept();
  module.hot.accept(["./magic-mirror", "../config/config"], () => {
    ReactDOM.unmountComponentAtNode(root);
    render();
  });
}