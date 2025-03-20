import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Workspace from './components/Workspace';
import HomePage from './apps/HomePage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="ws/:path" element={<Workspace />} />
        <Route path="*" element={<div id="single-spa-application" />} />
      </Route>
    </Routes>
  );
};

export default App;
