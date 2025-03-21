import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppRegistry } from '../context/AppRegistryContext';
import { useSidebar } from '../context/SidebarContext';
import { registerApplication, unregisterApplication, start } from 'single-spa';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

declare const System: {
  import: (module: string) => Promise<any>;
};

interface Card {
  id: string;
  appName: string;
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

interface WorkspaceState {
  cards: Card[];
}

interface ReactGridLayoutItem extends GridLayout.Layout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const Workspace: React.FC = () => {
  const { path } = useParams<{ path: string }>();
  const { apps } = useAppRegistry();
  const [workspace, setWorkspace] = useState<WorkspaceState>(() => {
    const saved = localStorage.getItem(`workspace-${path}`);
    return saved ? JSON.parse(saved) : { cards: [] };
  });
  const [showAppSelector, setShowAppSelector] = useState(false);
  const [selectedApp, setSelectedApp] = useState('');
  const [ready, setReady] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [gridWidth, setGridWidth] = useState(0);
  const containerRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Handle container width changes
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth - 40; // 40px for padding
        setGridWidth(containerWidth);
      }
    };

    // Create ResizeObserver to watch container width changes
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Initial width calculation
    updateWidth();

    return () => resizeObserver.disconnect();
  }, []);

  // Track state
  const [isRegistering, setIsRegistering] = useState(false);
  const mountedAppsRef = React.useRef<Set<string>>(new Set());
  const isInitializedRef = React.useRef(false);

  useEffect(() => {
    if (!path || !workspace || !apps || isRegistering) return;

    const registerApplications = async () => {
      // Skip if already initialized with the same configuration
      const currentConfig = JSON.stringify(workspace.cards.map(c => ({ id: c.id, appName: c.appName })));
      if (isInitializedRef.current && mountedAppsRef.current.size > 0) {
        console.log('Applications already initialized, skipping registration');
        return;
      }
      
      setIsRegistering(true);
      console.log('Starting application registration process');
      try {
        const currentAppIds = new Set(workspace.cards.map(card => `${card.appName}-${card.id}`));
        const previousAppIds = new Set(mountedAppsRef.current);

        // Only unregister applications that are no longer needed
        for (const appId of previousAppIds) {
          if (!currentAppIds.has(appId)) {
            try {
              console.log(`Unregistering removed application: ${appId}`);
              await Promise.resolve(unregisterApplication(appId));
              mountedAppsRef.current.delete(appId);
            } catch (error) {
              console.warn(`Failed to unregister application ${appId}: ${error}`);
            }
          }
        }

        // Brief pause to ensure cleanup
        await new Promise(resolve => setTimeout(resolve, 300));

        // Register new applications sequentially
        for (const card of workspace.cards) {
          const appId = `${card.appName}-${card.id}`;
          
          // Skip if already mounted
          if (mountedAppsRef.current.has(appId)) {
            console.log(`Skipping already mounted application: ${appId}`);
            continue;
          }

          const app = apps.find(a => a.name === card.appName);
          if (app) {
            // Longer delay between registrations
            await new Promise(resolve => setTimeout(resolve, 300));
            try {
              console.log(`Registering application ${appId} with URL ${app.appUrl}`);
              await Promise.resolve(registerApplication({
                name: appId,
                app: async () => {
                  try {
                    console.log(`Loading module for ${appId} from ${app.appUrl}`);
                    const module = await System.import(app.appUrl);
                    console.log(`Successfully loaded module for ${appId}`);
                    return module;
                  } catch (error) {
                    console.error(`Failed to load module for ${appId}: ${error}`);
                    throw error;
                  }
                },
                activeWhen: () => true,
                customProps: {
                  domElementGetter: () => {
                    const element = document.getElementById(`spa-container-${card.id}`);
                    console.log(`DOM element for ${appId}:`, element);
                    return element;
                  }
                }
              }));
              // Add to mounted apps set after successful registration
              mountedAppsRef.current.add(appId);
              console.log(`Successfully registered application ${appId}`);
            } catch (error) {
              console.error(`Failed to register application ${appId}:`, error);
            }
          }
        }

        // Wait longer to ensure all apps are properly loaded
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Start single-spa and wait for it to complete
        await start();
        console.log('Single-spa started, verifying mounts...');

        // Verify all registered applications
        const registeredAppIds = Array.from(mountedAppsRef.current);
        for (const appId of registeredAppIds) {
          const card = workspace.cards.find(c => `${c.appName}-${c.id}` === appId);
          if (card) {
            const container = document.getElementById(`spa-container-${card.id}`);
            const isMounted = Boolean(container && container.children && container.children.length > 0);
            console.log(`Mount verification for ${appId}:`, isMounted ? 'Success' : 'Not mounted');
            
            if (!isMounted) {
              console.warn(`Application ${appId} failed to mount properly, removing from tracked mounts`);
              mountedAppsRef.current.delete(appId);
            }
          }
        }

        // Mark as initialized after successful registration
        isInitializedRef.current = true;
        console.log('All applications initialized successfully');
      } finally {
        setIsRegistering(false);
        console.log('Registration process completed');
      }
    };

    // Save workspace state and start registration
    localStorage.setItem(`workspace-${path}`, JSON.stringify(workspace));
    registerApplications().catch(error => {
      console.error('Failed to register applications:', error);
      setIsRegistering(false);
    });

    // Cleanup on unmount
    return () => {
      const cleanup = async () => {
        // Get all currently mounted apps
        const mountedApps = Array.from(mountedAppsRef.current);
        console.log('Cleaning up mounted applications:', mountedApps);

        // Clean up each mounted app
        for (const appId of mountedApps) {
          try {
            console.log(`Unregistering application during cleanup: ${appId}`);
            await Promise.resolve(unregisterApplication(appId));
            mountedAppsRef.current.delete(appId);
          } catch (error) {
            console.warn(`Failed to cleanup application ${appId}: ${error}`);
          }
        }
      };

      // Run cleanup and handle any errors
      cleanup().catch(error => {
        console.error('Error during cleanup:', error);
      });
    };
  }, [workspace, path, apps, ready, isRegistering]);

  // Set ready after initial render
  useEffect(() => {
    setReady(true);
    return () => setReady(false);
  }, []);

  const handleAddCard = () => {
    if (!selectedApp) return;

    const newCard: Card = {
      id: Date.now().toString(),
      appName: selectedApp,
      layout: {
        x: 0,
        y: workspace.cards.reduce((maxY: number, card: Card) => Math.max(maxY, card.layout.y), 0),
        w: 6,
        h: 4
      }
    };

    setWorkspace((prev: WorkspaceState) => ({
      ...prev,
      cards: [...prev.cards, newCard]
    }));
    setShowAppSelector(false);
    setSelectedApp('');
  };

  const handleDeleteCard = async (cardId: string) => {
    const card = workspace.cards.find((c: Card) => c.id === cardId);
    if (!card) {
      console.warn('Card not found:', cardId);
      return;
    }

    const appId = `${card.appName}-${card.id}`;
    console.log(`Deleting card ${cardId} with app ${appId}`);

    // First unregister the application
    if (mountedAppsRef.current.has(appId)) {
      try {
        console.log(`Unregistering application for deletion: ${appId}`);
        await Promise.resolve(unregisterApplication(appId));
        mountedAppsRef.current.delete(appId);
        console.log(`Successfully unregistered application: ${appId}`);
      } catch (error) {
        console.warn(`Failed to unregister application: ${error}`);
      }
    }

    // Then update the workspace state
    setWorkspace((prev: WorkspaceState) => {
      console.log(`Updating workspace state to remove card: ${cardId}`);
      return {
        ...prev,
        cards: prev.cards.filter((c: Card) => c.id !== cardId)
      };
    });
  };

  const handleLayoutChange = (layout: ReactGridLayoutItem[]) => {
    setWorkspace((prev: WorkspaceState) => ({
      ...prev,
      cards: prev.cards.map((card: Card) => {
        const updatedLayout = layout.find(l => l.i === card.id);
        if (updatedLayout) {
          return {
            ...card,
            layout: {
              x: updatedLayout.x,
              y: updatedLayout.y,
              w: updatedLayout.w,
              h: updatedLayout.h
            }
          };
        }
        return card;
      })
    }));
  };

  return (
    <div ref={containerRef} style={{ padding: '20px', width: '100%', height: '100%', boxSizing: 'border-box', overflow: 'auto' }}>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>Workspace: {path}</h2>
        <button
          onClick={() => setShowAppSelector(true)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Card
        </button>
      </div>

      {showAppSelector && (
        <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <h3>Select Application</h3>
          <select
            value={selectedApp}
            onChange={(e) => setSelectedApp(e.target.value)}
            style={{ marginRight: '10px', padding: '8px' }}
          >
            <option value="">Select an app...</option>
            {apps.map(app => (
              <option key={app.name} value={app.name}>
                {app.displayName}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddCard}
            disabled={!selectedApp}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedApp ? '#27ae60' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: selectedApp ? 'pointer' : 'not-allowed'
            }}
          >
            Add
          </button>
          <button
            onClick={() => setShowAppSelector(false)}
            style={{
              padding: '8px 16px',
              marginLeft: '10px',
              backgroundColor: 'transparent',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      )}

      <GridLayout
        className="layout"
        layout={workspace.cards.map(card => ({
          i: card.id,
          x: card.layout.x,
          y: card.layout.y,
          w: card.layout.w,
          h: card.layout.h,
          minW: 3,
          minH: 2
        }))}
        cols={12}
        rowHeight={100}
        width={gridWidth}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".card-header"
      >
        {workspace.cards.map(card => (
          <div key={card.id} className="card" style={{ backgroundColor: 'white', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div className="card-header" style={{ 
              padding: '10px', 
              borderBottom: '1px solid #eee', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              cursor: 'move'
            }}>
              <h3 style={{ margin: 0, fontSize: '1em' }}>
                {apps.find(app => app.name === card.appName)?.displayName || card.appName}
              </h3>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  console.log('Delete button clicked for card:', card.id);
                  handleDeleteCard(card.id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#e74c3c',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  lineHeight: 1,
                  zIndex: 1000
                }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '10px', height: 'calc(100% - 41px)' }}>
              <div
                id={`spa-container-${card.id}`}
                style={{ 
                  height: '100%', 
                  border: '1px solid #eee', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}
              />
            </div>
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default Workspace;