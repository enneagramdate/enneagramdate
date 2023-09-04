import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { io } from 'socket.io-client';

const URL = 'http://localhost:8000';

export const socket = io(URL, {
  autoConnect: false,
});

const root = createRoot(document.getElementById('root') as Element);
root.render(
  // TODO: remove strict mode for production
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
