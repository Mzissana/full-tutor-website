import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import OgeMonologueApp from './apps/OgeMonologueApp.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OgeMonologueApp />
  </StrictMode>,
);
