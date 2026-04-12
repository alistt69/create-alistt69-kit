import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/app/App';
import { RouterProvider, ErrorBoundary } from '@/app/providers';
import './styles/index.scss';

const container = document.getElementById('root');

if (!container) {
    throw new Error('Root container not found');
}

createRoot(container).render(
    <StrictMode>
        <App
            router={(
                <RouterProvider
                    errorBoundary={ErrorBoundary}
                />
            )}
        />
    </StrictMode>,
);
