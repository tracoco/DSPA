import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/layout/Sidebar';

const MainLayout: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="content-area">
          {!location.pathname.startsWith('/ws/') && location.pathname !== '/' ? (
            <div id="single-spa-application"></div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
