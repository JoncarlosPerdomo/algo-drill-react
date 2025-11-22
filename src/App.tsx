import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AlgorithmList from './components/AlgorithmList';
import AlgorithmDetail from './components/AlgorithmDetail';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<AlgorithmList />} />
        <Route path="/algorithms/:id" element={<AlgorithmDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
