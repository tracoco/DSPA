import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/layout/Sidebar';
import { SidebarProvider } from '../context/SidebarContext';

const MainLayout: React.FC = () => {
  const location = useLocation();
  
  return (
    <SidebarProvider>
      <div className="app-container">
        <Header />
        <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
          <Sidebar />
          <div style={{ flex: 1, overflow: 'auto' }}>
            {!location.pathname.startsWith('/ws/') && location.pathname !== '/' ? (
              <div id="single-spa-application"></div>
            ) : (
              <Outlet />
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
