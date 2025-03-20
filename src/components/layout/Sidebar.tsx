import { useState } from 'react';
import { navigateToUrl } from 'single-spa';
import { useAppRegistry, type CustomMenuItem } from '../../context/AppRegistryContext';
import { useSidebar } from '../../context/SidebarContext';

const MenuLink = ({ path, iconName, displayName, onDelete }: {
  path: string;
  iconName?: string;
  displayName: string;
  onDelete?: () => void;
}) => (
  <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
    <a
      href={path}
      onClick={(e) => {
        e.preventDefault();
        navigateToUrl(path);
      }}
      style={{
        color: 'white',
        textDecoration: 'none',
        padding: '10px',
        display: 'block',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
        backgroundColor: 'transparent',
        flex: 1
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = '#2c3e50';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {iconName && (
        <span style={{ marginRight: '8px' }}>
          <i className={`icon-${iconName}`}></i>
        </span>
      )}
      {displayName}
    </a>
    {onDelete && (
      <button
        onClick={onDelete}
        style={{
          background: 'none',
          border: 'none',
          color: '#e74c3c',
          cursor: 'pointer',
          padding: '5px',
          marginLeft: '5px'
        }}
      >
        ×
      </button>
    )}
  </li>
);

const Sidebar = () => {
  const context = useAppRegistry();
  const { apps, customMenuItems, addCustomMenuItem, removeCustomMenuItem } = context;
  const { isCollapsed, sidebarWidth } = useSidebar();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({ displayName: '', path: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add workspace path prefix
    addCustomMenuItem({
      ...newMenuItem,
      path: `/ws/${newMenuItem.path}`
    });
    setNewMenuItem({ displayName: '', path: '' });
    setShowAddForm(false);
  };

  return (
    <aside className="sidebar" style={{
      width: `${sidebarWidth}px`,
      transition: 'width 0.3s ease',
      padding: isCollapsed ? 0 : '20px',
      overflow: 'hidden'
    }}>
      <nav>
        <section style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', fontSize: '1.2em' }}>Applications</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {apps.map((item) => (
              <MenuLink key={item.path} {...item} />
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2em' }}>Custom Menu</h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                background: 'none',
                border: '1px solid white',
                color: 'white',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer'
              }}
            >
              {showAddForm ? '−' : '+'}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleSubmit} style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Display Name"
                value={newMenuItem.displayName}
                onChange={(e) => setNewMenuItem(prev => ({ ...prev, displayName: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '8px',
                  backgroundColor: '#2c3e50',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white'
                }}
              />
              <input
                type="text"
                placeholder="Path"
                value={newMenuItem.path}
                onChange={(e) => setNewMenuItem(prev => ({ ...prev, path: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '8px',
                  backgroundColor: '#2c3e50',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white'
                }}
              />
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#27ae60',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Add Menu Item
              </button>
            </form>
          )}

          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {customMenuItems.map((item) => (
              <MenuLink
                key={item.id}
                {...item}
                onDelete={() => removeCustomMenuItem(item.id)}
              />
            ))}
          </ul>
        </section>
      </nav>
    </aside>
  );
};

export default Sidebar;
