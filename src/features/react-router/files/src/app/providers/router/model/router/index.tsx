import { ComponentType, ReactNode } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { Error } from '../../../../../pages/error';
import { Main } from '../../../../../pages/main';
import AppLayout from '../../ui/app';

export const getRouter = (ErrorBoundary: ComponentType<{ children: ReactNode }>) => createBrowserRouter(
    createRoutesFromElements(
        <Route
            path="/"
            element={(
                <ErrorBoundary>
                    <AppLayout />
                </ErrorBoundary>
            )}
        >
            <Route index element={<Main />} />
            <Route path="*" element={<Error />} />
        </Route>,
    ),
);
