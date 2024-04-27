import React from 'react';
import { createRoot } from 'react-dom';
import App from './App.jsx';
import './index.css';

const root = document.getElementById('root');
createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);