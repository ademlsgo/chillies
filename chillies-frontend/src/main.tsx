import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './App.css'; // ← ou './index.css' selon le nom de ton fichier CSS global
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
