import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import {MagicMirror} from './core';
import config from '../config/config';

// make CSS globally available
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'roboto-fontface/css/roboto-condensed/roboto-condensed-fontface.css';
import './main.css';

var x = 2;

ReactDOM.render(
  <StrictMode>
    <MagicMirror config={config}/>
  </StrictMode>,
  document.getElementById('root'),
);
