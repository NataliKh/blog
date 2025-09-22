import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryProvider } from './providers/query-client';
import { App } from './App';
import './styles/global.css';
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(QueryProvider, { children: _jsx(App, {}) }) }));
