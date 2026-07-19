import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import { pageFromPathname } from './navigation';
import './index.css';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

const canHydrateCurrentRoute = pageFromPathname(window.location.pathname) !== null;

if (root.childElementCount > 0 && canHydrateCurrentRoute) {
  hydrateRoot(root, app);
} else {
  root.replaceChildren();
  createRoot(root).render(app);
}
