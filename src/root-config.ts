import { start } from 'single-spa';
import { registerAllApps } from './registry/appRegistry';

// Setup SystemJS import map overrides for local development
if (process.env.NODE_ENV === 'development') {
  System.set('@spa/react-app', System.newModule(import('./react-app')));
  // When angular app is implemented:
  // System.set('@spa/angular-app', System.newModule(import('./angular-app')));
  
  // Try to load the React app from the dev server if it's running
  try {
    System.import('@spa/reactapp');
  } catch (e) {
    console.warn('Could not load @spa/reactapp. Make sure it is running on port 4000.');
  }
}

// Register all applications from the registry
registerAllApps();

// Start single-spa
start({
  urlRerouteOnly: true
});

// This empty export makes this file a module
export {};