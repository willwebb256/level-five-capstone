import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const rootElement = document.getElementById('root');

// Use createRoot to render the app
const root = ReactDOM.createRoot(rootElement);

// Wrap the App component inside createRoot
root.render(<App />);
