import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
/* Ensure global styles are loaded after any other CSS to win the cascade */
import './index.css';
import './styles/app.css';
import App from './App';

/**
 * Set runtime CSS variable for public logo to avoid css-loader resolution issues.
 * Public assets are served from the root (e.g., /nisse2.png). Assign it to --bg-logo.
 */
(function setBgLogoVar() {
  try {
    const root = document.documentElement;
    // Use absolute public path; this is not resolved by css-loader since it's set at runtime.
    root.style.setProperty('--bg-logo', "url('/nisse2.png')");
  } catch (_) {}
})();

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
