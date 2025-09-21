import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryProvider } from './providers/query-client';
import { App } from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </React.StrictMode>
);
