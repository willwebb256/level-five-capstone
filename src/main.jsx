import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createRoot } from 'react-dom';

const rootElement = document.getElementById('root');

// Use createRoot to render the app
const root = createRoot(rootElement);

// Wrap the App component inside createRoot
root.render(<App />);
