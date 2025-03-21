# Single-SPA with Module Federation Architecture

## Overview

This repository demonstrates a micro-frontend architecture using Single-SPA with Webpack Module Federation. This approach enables you to build a modular application where different parts (micro-frontends) can be developed, deployed, and maintained independently while functioning together as a cohesive application.

## Architecture

### Core Components

1. **Shell Application**: The container application that integrates all micro-frontends
2. **Micro-frontends**: Independent applications that are loaded into the shell
   - Angular App
   - React App

![Architecture Diagram](https://mermaid.ink/img/pako:eNp1kc1uwjAQhF_F2lMrNSp_BQ5VD1wqVT30UnGwYhNbOHZkO0AR8O59AyGgXHzYnfk8M97dQaYFQQQbk9e0r4l3edHyJuutfMgLxpFxLjmTtWyfDY1Oxtmq6qTKuTI8UY1uJvRgAsNroyUzXroCJab1gYejk1QbpjB6hxjm0aVQC58VfTBy8JKau1A2thOcVow2ZoCO3zcD8FhxrrRr4OKwAadJfTfKeEfECnL_E9cZbRxoakDfmS_i9Gbm3i6Cy-TCeR5_PR6rthUCQrCy2VM_j1c1xLBSJRmYl5qKHUSwbZTKqYmeJMztJnPVOjP4YGUFUdfZVquCIvDvcnzgz5qnXl7jMPjxK3zv42sUhhhGsE8pLikrKKGdtdAvPDGnNQ?type=png)

## Key Technologies

- **Single-SPA**: Framework for bringing together multiple JavaScript microfrontends
- **Webpack Module Federation**: Enables loading remote modules dynamically
- **SystemJS**: Used for importing modules at runtime

## Benefits of This Architecture

1. **Independent Development**: Teams can work autonomously on different micro-frontends
2. **Technology Diversity**: Different frameworks (Angular, React) can coexist
3. **Incremental Updates**: Applications can be updated independently
4. **Scalability**: New teams and features can be added without affecting existing code

## Getting Started

### Prerequisites

- Node.js 14+
- npm or yarn

### Running the Application

1. Clone this repository
2. Install dependencies in each application directory:
   ```bash
   # In shell application
   cd shell
   npm install
   
   # In angular app
   cd example/angularapp
   npm install
   
   # In react app
   cd example/reactapp
   npm install
   ```
3. Start all applications:
   ```bash
   # Start the shell
   cd shell
   npm start
   
   # Start the Angular app
   cd example/angularapp
   npm start
   
   # Start the React app
   cd example/reactapp
   npm start
   ```
4. Navigate to http://localhost:9000 to see the shell application with loaded micro-frontends

## Onboarding Guide

### Adding a New Angular Application

1. **Create a new Angular application** (if not existing)
   ```bash
   ng new my-angular-app --routing
   ```

2. **Add Single-SPA support**
   ```bash
   cd my-angular-app
   ng add single-spa-angular
   ```

3. **Update the webpack configuration** in `single-spa.webpack.config.js`:
   ```javascript
   const { merge } = require('webpack-merge');
   const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;
   const path = require('path');

   module.exports = (config, options) => {
     const singleSpaWebpackConfig = singleSpaAngularWebpack({
       libraryName: "myAngularApp",
       orgName: "spa",
       projectName: "angular-app",
       webpackConfigEnv: options
     });

     const mergedConfig = merge(config || {}, singleSpaWebpackConfig, {
       output: {
         path: path.resolve(__dirname, 'dist'),
         filename: 'my-angular-app.js'
       },
       externals: {
         'single-spa': 'single-spa'
       }
     });
     
     return mergedConfig;
   };
   ```

4. **Modify your main.single-spa.ts file**
   ```typescript
   import { enableProdMode, NgZone } from '@angular/core';
   import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
   import { Router } from '@angular/router';
   import { AppModule } from './app/app.module';
   import { environment } from './environments/environment';
   import { singleSpaAngular, getSingleSpaExtraProviders } from 'single-spa-angular';

   if (environment.production) {
     enableProdMode();
   }

   const lifecycles = singleSpaAngular({
     bootstrapFunction: singleSpaProps => {
       return platformBrowserDynamic(getSingleSpaExtraProviders()).bootstrapModule(AppModule);
     },
     template: '<app-root />',
     Router,
     NgZone,
   });

   export const bootstrap = lifecycles.bootstrap;
   export const mount = lifecycles.mount;
   export const unmount = lifecycles.unmount;
   ```

5. **Register the application in the shell's import-map**
   ```json
   {
     "imports": {
       "spa-angular-app": "http://localhost:4200/my-angular-app.js"
     }
   }
   ```

6. **Register the route in the shell's config**
   ```javascript
   registerApplication({
     name: "@spa/angular-app",
     app: () => System.import("spa-angular-app"),
     activeWhen: ["/angular-app"]
   });
   ```

### Updating an Existing Angular Application

1. **Update Angular dependencies** in `package.json`:
   ```json
   {
     "dependencies": {
       "@angular/common": "^19.2.0",
       "@angular/compiler": "^19.2.0",
       "@angular/core": "^19.2.0",
       "@angular/forms": "^19.2.0",
       "@angular/platform-browser": "^19.2.0",
       "@angular/platform-browser-dynamic": "^19.2.0",
       "@angular/router": "^19.2.0",
       "rxjs": "~7.8.0",
       "single-spa": ">=4.0.0",
       "single-spa-angular": "^9.2.0",
       "tslib": "^2.3.0",
       "zone.js": "~0.15.0"
     },
     "devDependencies": {
       "@angular-builders/custom-webpack": "19.0.0",
       "@angular-devkit/build-angular": "^19.2.4",
       "@angular/cli": "^19.2.4",
       "@angular/compiler-cli": "^19.2.0",
       "@types/jasmine": "~5.1.0",
       "jasmine-core": "~5.6.0",
       "karma": "~6.4.0",
       "karma-chrome-launcher": "~3.2.0",
       "karma-coverage": "~2.2.0",
       "karma-jasmine": "~5.1.0",
       "karma-jasmine-html-reporter": "~2.1.0",
       "style-loader": "^3.3.1",
       "typescript": "~5.7.2"
     }
   }
   ```

2. **Update the main.single-spa.ts file** to ensure compatibility:
   ```typescript
   import 'zone.js';
   import { enableProdMode, NgZone } from '@angular/core';
   import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
   import { Router, NavigationStart } from '@angular/router';
   import { singleSpaAngular, getSingleSpaExtraProviders } from 'single-spa-angular';
   import { AppModule } from './app/app.module';
   import { environment } from './environments/environment';
   import { singleSpaPropsSubject } from './single-spa/single-spa-props';

   if (environment.production) {
     enableProdMode();
   }

   const lifecycles = singleSpaAngular({
     bootstrapFunction: singleSpaProps => {
       singleSpaPropsSubject.next(singleSpaProps);
       return platformBrowserDynamic(getSingleSpaExtraProviders()).bootstrapModule(AppModule);
     },
     template: '<app-root />',
     Router,
     NavigationStart,
     NgZone,
   });

   export const bootstrap = lifecycles.bootstrap;
   export const mount = lifecycles.mount;
   export const unmount = lifecycles.unmount;
   ```

3. **Update the Angular CLI configuration** to ensure proper build and serve commands:
   ```json
   {
     "scripts": {
       "ng": "ng",
       "start": "ng serve --port 4002",
       "build": "ng build",
       "watch": "ng build --watch --configuration development",
       "test": "ng test",
       "build:single-spa:angularapp": "ng build angularapp --configuration production",
       "serve:single-spa:angularapp": "ng s --project angularapp --disable-host-check --port 4002 --live-reload false"
     }
   }
   ```

4. **Ensure the import map in the shell application** is updated to point to the correct URL:
   ```json
   {
     "imports": {
       "spa-angular-app": "http://localhost:4002/angularapp.js"
     }
   }
   ```

### Adding a New React Application

1. **Create a new React application**
   ```bash
   npx create-react-app my-react-app
   ```

2. **Add Single-SPA support**
   ```bash
   cd my-react-app
   npm install single-spa-react
   ```

3. **Create a webpack config file** (webpack.config.js)
   ```javascript
   const { merge } = require("webpack-merge");
   const singleSpaDefaults = require("webpack-config-single-spa-react");

   module.exports = (webpackConfigEnv, argv) => {
     const defaultConfig = singleSpaDefaults({
       orgName: "spa",
       projectName: "react-app",
       webpackConfigEnv,
       argv,
     });

     return merge(defaultConfig, {
       externals: ["react", "react-dom", "single-spa"],
     });
   };
   ```

4. **Create a root component file** (src/spa-root.jsx)
   ```jsx
   import React from 'react';
   import ReactDOM from 'react-dom';
   import singleSpaReact from 'single-spa-react';
   import App from './App';

   const lifecycles = singleSpaReact({
     React,
     ReactDOM,
     rootComponent: App,
     errorBoundary(err, info, props) {
       return <div>Error occurred: {err.message}</div>;
     },
   });

   export const { bootstrap, mount, unmount } = lifecycles;
   ```

5. **Register the application in the shell's import-map**
   ```json
   {
     "imports": {
       "spa-react-app": "http://localhost:8080/spa-react-app.js"
     }
   }
   ```

6. **Register the route in the shell's config**
   ```javascript
   registerApplication({
     name: "@spa/react-app",
     app: () => System.import("spa-react-app"),
     activeWhen: ["/react-app"]
   });
   ```

## Best Practices

1. **Shared Dependencies**: Use Module Federation to share common libraries
2. **Communication**: Use custom events or a state management library for cross-app communication
3. **Styling**: Use scoped CSS or CSS-in-JS to prevent style conflicts
4. **Testing**: Test each micro-frontend independently before integration
5. **Versioning**: Implement proper versioning for each micro-frontend

## Troubleshooting

- **Loading Issues**: Check the browser console for module loading errors
- **Route Conflicts**: Ensure route paths are correctly configured in the shell
- **Performance**: Monitor bundle sizes and consider lazy loading

## Resources

- [Single-SPA Documentation](https://single-spa.js.org/docs/getting-started-overview)
- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)
- [SystemJS Documentation](https://github.com/systemjs/systemjs)