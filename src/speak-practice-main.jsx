import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import SpeakPracticeApp from './apps/SpeakPracticeApp.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SpeakPracticeApp />
  </StrictMode>,
);
