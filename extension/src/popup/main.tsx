import React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './Popup';
import '../sidebar/sidebar.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
