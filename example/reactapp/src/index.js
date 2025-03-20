import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import App from './App';

// Single-SPA React wrapper
const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: App,
  errorBoundary(err, info, props) {
    // Error handling
    return <div>Error occurred: {err.message}</div>;
  },
  renderType: 'render',
  suppressComponentDidCatchWarning: true,
  domElementGetter: () => document.getElementById('single-spa-application')
});

// Export the Single-SPA lifecycle methods
export const { bootstrap, mount, unmount } = lifecycles;
