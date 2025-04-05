import {createRoot} from 'react-dom/client';
import App from './pages/app';

// Client-side cookie handling
const fixVercelCookies = () => {
  // This function runs in the browser to fix cookie attributes
  if (typeof document !== 'undefined') {
    document.cookie = '__vercel_live_token=; SameSite=None; Secure; path=/';
  }
};

// Execute cookie fix on load
fixVercelCookies();

const root = createRoot(document.getElementById('root'));

root.render(
    <App />
);
