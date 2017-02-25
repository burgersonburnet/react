import React from 'react';
import ReactDOM from 'react-dom';
import Map from './Map';
import './index.css';
import restaurants from './restaurants';

ReactDOM.render(
  <Map restaurants={restaurants} />,
  document.getElementById('root')
);
