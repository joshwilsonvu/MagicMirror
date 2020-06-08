import React from 'react';
import ReactDOM from 'react-dom';
import MagicMirror from './magic-mirror';
import config from '../config/config';

// make CSS globally available
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'roboto-fontface/css/roboto-condensed/roboto-condensed-fontface.css';
import './main.css';
/* import ../css/custom.css */

const root = document.getElementById('root');

function render() {
  ReactDOM.unmountComponentAtNode(root);
  ReactDOM.render(
    <React.StrictMode>
      <MagicMirror initialConfig={config}/>
    </React.StrictMode>,
    root,
  );
}

render();

// In development, this lets the app quickly restart when source files are changed
if (module.hot) {
  module.hot.accept();
  module.hot.accept(["./magic-mirror", "../config/config"], render);
}