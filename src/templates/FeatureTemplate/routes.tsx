
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import FeatureList from './components/FeatureList';
import FeatureDetail from './components/FeatureDetail';
import FeatureForm from './components/FeatureForm';

const FeatureRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<FeatureList />} />
      <Route path="/create" element={<FeatureForm />} />
      <Route path="/:id" element={<FeatureDetail />} />
      <Route path="/:id/edit" element={<FeatureForm />} />
    </Routes>
  );
};

export default FeatureRoutes;
