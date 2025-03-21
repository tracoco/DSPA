import { registerApplication } from 'single-spa';

declare const System: {
  import: (module: string) => Promise<any>;
  set: (name: string, exports: any) => void;
  resolve: (name: string) => string;
};

export interface MicroFrontendApp {
  name: string;
  path: string;
  appUrl: string;
  displayName: string;
  iconName?: string;
}

// Initial apps 
const initialApps: MicroFrontendApp[] = [
  {
    name: '@spa/reactapp',
    path: '/reactapp',
    appUrl: 'http://localhost:4000/react-app.js',
    displayName: 'React MFE App',
    iconName: 'react'
  },
  {
    name: '@spa/reactapp1',
    path: '/reactapp1',
    appUrl: 'http://localhost:4001/react-app.js',
    displayName: 'React MFE App1',
    iconName: 'react'
  },
  {
    name: '@spa/angularapp',
    path: '/angularapp',
    appUrl: 'http://localhost:4002/angularapp.js',
    displayName: 'Angular MFE App',
    iconName: 'angular'
  }
];

// Store for registered apps
let registeredApps = [...initialApps];

// Register a single application with single-spa
export const registerMicroFrontend = (app: MicroFrontendApp) => {
  console.log(`Registering application: ${app.name} at path ${app.path}`);

  // Register application with single-spa
  registerApplication({
    name: app.name,
    app: () => System.import(app.appUrl),
    activeWhen: (location: Location) => {
      return location.pathname.startsWith(app.path);
    },
    customProps: {
      domElementGetter: () => {
        // Make sure the container element exists
        const mainContent = document.querySelector('main');
        let el = document.getElementById('single-spa-application');
        if (!el) {
          el = document.createElement('div');
          el.id = 'single-spa-application';
          mainContent?.appendChild(el);
        }
        return el;
      }
    }
  });
  
  // Add to registry if not already present
  if (!registeredApps.some(registeredApp => registeredApp.name === app.name)) {
    registeredApps = [...registeredApps, app];
  }
};

// Register all applications from the registry
export const registerAllApps = () => {
  registeredApps.forEach(app => {
    registerMicroFrontend(app);
  });
};

// Add a new app to the registry
export const addApp = (app: MicroFrontendApp) => {
  registerMicroFrontend(app);
};

// Get all registered apps
export const getRegisteredApps = (): MicroFrontendApp[] => {
  return [...registeredApps];
};
