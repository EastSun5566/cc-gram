import React from 'react';
import { hydrate, render } from 'react-dom';

import ReactGA from 'react-ga';

import './index.scss';

import App from './App';
// import * as serviceWorker from './serviceWorker';

const rootElement = document.getElementById('root');
if (rootElement?.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}

ReactGA.initialize('G-YGB6NCEQVB');
ReactGA.pageview(window.location.pathname + window.location.search);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
