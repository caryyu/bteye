import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/App';

let container = document.querySelector('.article .subjectwrap')
let renderer = document.createElement('div')
container.append(renderer)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  renderer
)

