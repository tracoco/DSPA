import React from 'react';
import { navigateToUrl } from 'single-spa';
import { useAppRegistry } from '../../context/AppRegistryContext';

const Sidebar: React.FC = () => {
  const { apps } = useAppRegistry();

  return (
    <aside style={{
      width: '250px',
      backgroundColor: '#34495e',
      color: 'white',
      position: 'fixed',
      top: '60px',
      left: 0,
      bottom: 0,
      padding: '20px'
    }}>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {apps.map((item) => (
            <li key={item.path} style={{ marginBottom: '10px' }}>
              <a
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigateToUrl(item.path);
                }}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '10px',
                  display: 'block',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s',
                  backgroundColor: 'transparent'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#2c3e50';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {item.iconName && (
                  <span style={{ marginRight: '8px' }}>
                    <i className={`icon-${item.iconName}`}></i>
                  </span>
                )}
                {item.displayName}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
