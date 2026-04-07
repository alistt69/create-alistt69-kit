import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import ErrorBoundary from './app/providers/error-boundary/ui/ErrorBoundary';
import './styles/index.scss';

const container = document.getElementById('root');

if (!container) {
    throw new Error('Root container not found');
}

createRoot(container).render(
    <StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </StrictMode>,
);
