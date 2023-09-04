import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { io } from 'socket.io-client';
const URL = 'http://localhost:8000';
export const socket = io(URL, {
    autoConnect: false,
});
const root = createRoot(document.getElementById('root'));
root.render(React.createElement(React.StrictMode, null,
    React.createElement(App, null)));
