import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AlgorithmProgressProvider } from './context/AlgorithmProgressContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AlgorithmProgressProvider>
        <App />
      </AlgorithmProgressProvider>
    </BrowserRouter>
  </React.StrictMode>
);
