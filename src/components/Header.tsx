import React from 'react';
import { useSidebar } from '../context/SidebarContext';
import '../styles/header.css';

const Header: React.FC = () => {
  const { isCollapsed, setIsCollapsed } = useSidebar();

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => setIsCollapsed(prev => !prev)}
          style={{
            padding: '8px',
            backgroundColor: 'transparent',
            color: '#666',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            fontSize: '18px'
          }}
        >
          {isCollapsed ? '☰' : '⬱'}
        </button>
        <h1>Micro Frontend Shell</h1>
      </div>
    </header>
  );
};

export default Header;
