import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { start } from 'single-spa';
import App from './App';
import { registerAllApps } from './registry/appRegistry';
import './index.css';

// Register all micro-frontend applications
registerAllApps();

// Start single-spa
start();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
