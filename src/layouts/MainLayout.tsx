import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/layout/Sidebar';
import HomePage from '../apps/HomePage';

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
          {location.pathname === '/' ? (
            <HomePage />
          ) : (
            <div id="single-spa-application"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
