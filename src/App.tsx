import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/*" element={<MainLayout />} />
    </Routes>
  );
};

export default App;
