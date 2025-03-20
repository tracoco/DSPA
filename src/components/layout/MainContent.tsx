import React, { useState, useEffect } from 'react';
import HomePage from '../../apps/HomePage';

const MainContent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  // Listen for route changes
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handleLocationChange);
    
    // Custom event from single-spa navigation
    window.addEventListener('single-spa:routing-event', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('single-spa:routing-event', handleLocationChange);
    };
  }, []);
  
  return (
    <main style={{
      marginLeft: '250px',
      marginTop: '60px',
      padding: '20px',
      minHeight: 'calc(100vh - 60px)',
      backgroundColor: '#f5f6fa'
    }}>
      {(currentPath === '/' || currentPath === '') ? (
        <HomePage />
      ) : (
        <div id="single-spa-application"></div>
      )}
    </main>
  );
};

export default MainContent;
