import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import AppLayout from '../../../layouts/app';
import { Main } from '../../../../pages/main';
import { Error } from '../../../../pages/error';

export const appRouter = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<AppLayout />}>
            <Route index element={<Main />} />
            <Route path="*" element={<Error />} />
        </Route>,
    ),
);
