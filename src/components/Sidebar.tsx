import React from 'react';
import { NavLink } from 'react-router-dom';
import { getRegisteredApps } from '../registry/appRegistry';

const Sidebar: React.FC = () => {
  const apps = getRegisteredApps();

  return (
    <aside className="sidebar">
      <h2>Applications</h2>
      <ul className="sidebar-menu">
        {apps.map((app) => (
          <li key={app.name}>
            <NavLink to={app.path}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              {app.iconName && (
                <span className="app-icon">
                  {app.iconName === 'react' && '⚛️'}
                  {app.iconName === 'angular' && '🅰️'}
                  {!['react', 'angular'].includes(app.iconName) && '📱'}
                </span>
              )}
              {app.displayName}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
