import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { MicroFrontendApp, getRegisteredApps, addApp } from '../registry/appRegistry';

export interface CustomMenuItem {
  id: string;
  displayName: string;
  path: string;
  iconName?: string;
}

interface AppRegistryContextType {
  apps: MicroFrontendApp[];
  customMenuItems: CustomMenuItem[];
  registerApp: (app: MicroFrontendApp) => void;
  addCustomMenuItem: (item: Omit<CustomMenuItem, 'id'>) => void;
  removeCustomMenuItem: (id: string) => void;
}

const AppRegistryContext = createContext<AppRegistryContextType>({
  apps: [],
  customMenuItems: [],
  registerApp: () => {},
  addCustomMenuItem: () => {},
  removeCustomMenuItem: () => {}
});

export const useAppRegistry = () => useContext(AppRegistryContext);

export const AppRegistryProvider = ({ children }: { children: ReactNode }) => {
  const [apps, setApps] = useState<MicroFrontendApp[]>([]);
  const [customMenuItems, setCustomMenuItems] = useState<CustomMenuItem[]>([]);

  useEffect(() => {
    // Initialize with registered apps
    setApps(getRegisteredApps());
    
    // Load custom menu items from localStorage
    const savedItems = localStorage.getItem('customMenuItems');
    if (savedItems) {
      setCustomMenuItems(JSON.parse(savedItems));
    }
  }, []);

  const registerApp = (app: MicroFrontendApp) => {
    addApp(app);
    setApps(getRegisteredApps());
  };

  const addCustomMenuItem = (item: Omit<CustomMenuItem, 'id'>) => {
    const newItem = {
      ...item,
      id: Date.now().toString()
    };
    const updatedItems = [...customMenuItems, newItem];
    setCustomMenuItems(updatedItems);
    localStorage.setItem('customMenuItems', JSON.stringify(updatedItems));
  };

  const removeCustomMenuItem = (id: string) => {
    const updatedItems = customMenuItems.filter(item => item.id !== id);
    setCustomMenuItems(updatedItems);
    localStorage.setItem('customMenuItems', JSON.stringify(updatedItems));
  };

  return (
    <AppRegistryContext.Provider value={{
      apps,
      customMenuItems,
      registerApp,
      addCustomMenuItem,
      removeCustomMenuItem
    }}>
      {children}
    </AppRegistryContext.Provider>
  );
};
