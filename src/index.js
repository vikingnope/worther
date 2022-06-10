import {React, StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './pages/app.js';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
);
