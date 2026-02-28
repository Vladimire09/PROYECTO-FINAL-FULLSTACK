import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './output.css';
import { UserProvider } from './context/UserContext.jsx'; // <-- Importamos el Provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);