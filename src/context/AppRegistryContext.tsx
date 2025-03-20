import React, { createContext, useContext, useState, useEffect } from 'react';
import { MicroFrontendApp, getRegisteredApps, addApp } from '../registry/appRegistry';

interface AppRegistryContextType {
  apps: MicroFrontendApp[];
  registerApp: (app: MicroFrontendApp) => void;
}

const AppRegistryContext = createContext<AppRegistryContextType>({
  apps: [],
  registerApp: () => {}
});

export const useAppRegistry = () => useContext(AppRegistryContext);

export const AppRegistryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apps, setApps] = useState<MicroFrontendApp[]>([]);

  useEffect(() => {
    // Initialize with registered apps
    setApps(getRegisteredApps());
  }, []);

  const registerApp = (app: MicroFrontendApp) => {
    addApp(app);
    setApps(getRegisteredApps());
  };

  return (
    <AppRegistryContext.Provider value={{ apps, registerApp }}>
      {children}
    </AppRegistryContext.Provider>
  );
};
