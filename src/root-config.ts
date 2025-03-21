import { start } from 'single-spa';
import { registerAllApps } from './registry/appRegistry';

declare const __webpack_public_path__: string;
declare const System: any;

// Setup SystemJS import map overrides for local development
const loadApps = async () => {
  try {
    await Promise.all([
      System.import('@spa/reactapp').catch((e: Error) => {
        console.warn('Could not load @spa/reactapp. Make sure it is running on port 4000.', e);
      }),
      System.import('@spa/reactapp1').catch((e: Error) => {
        console.warn('Could not load @spa/reactapp. Make sure it is running on port 4001.', e);
      }),
      System.import('@spa/angularapp').catch((e: Error) => {
        console.warn('Could not load @spa/angularapp. Make sure it is running on port 4002.', e);
      })
    ]);
    console.log('MFE applications loaded successfully');
  } catch (error) {
    console.error('Error loading MFE applications:', error);
  }
};

// Register all applications from the registry first
registerAllApps();

if (process.env.NODE_ENV === 'development') {
  loadApps();
}

// Start single-spa
start({
  urlRerouteOnly: true
});

export {};