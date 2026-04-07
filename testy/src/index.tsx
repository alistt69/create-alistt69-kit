import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/app/App';
import { AppRouter } from '@/app/providers';
import './styles/index.scss';

const container = document.getElementById('root');

if (!container) {
    throw new Error('Root container not found');
}

createRoot(container).render(
    <StrictMode>
        <App>
            <AppRouter />
        </App>
    </StrictMode>,
);
