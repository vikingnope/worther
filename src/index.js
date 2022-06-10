import {React, StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './pages/app.js';

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
