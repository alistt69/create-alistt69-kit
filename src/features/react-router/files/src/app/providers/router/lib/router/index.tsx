import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { Error } from '../../../../../pages/error';
import { Main } from '../../../../../pages/main';
import AppLayout from '../../../../layouts/app';

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<AppLayout />}>
            <Route index element={<Main />} />
            <Route path="*" element={<Error />} />
        </Route>,
    ),
);
