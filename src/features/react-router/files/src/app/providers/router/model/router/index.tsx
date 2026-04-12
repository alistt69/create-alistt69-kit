import { ComponentType, ReactNode } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { ERoutePath } from '../../types';
import { Error } from '../../../../../pages/error';
import { Main } from '../../../../../pages/main';
/* @route-imports */
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
            {/* @route-routes */}
            <Route path={ERoutePath.ERROR} element={<Error />} />
        </Route>,
    ),
);
