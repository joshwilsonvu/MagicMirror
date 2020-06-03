import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import {MagicMirror} from './core';
import config from '../config/config';

// make CSS globally available
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'roboto-fontface/css/roboto-condensed/roboto-condensed-fontface.css';
import './main.css';

function render() {
  console.log("Rendering");
  ReactDOM.render(
    <StrictMode>
      <MagicMirror initialConfig={config}/>
    </StrictMode>,
    document.getElementById('root'),
  );
}

render();

if (module.hot) {
  module.hot.accept(["./core", "../config/config"], render);
}