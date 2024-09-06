import React from 'react';
import './index.css';
import App from './app';
import { createRoot } from 'react-dom/client';

const element = document.getElementById('root');

const root = createRoot(element);
root.render(<App />);