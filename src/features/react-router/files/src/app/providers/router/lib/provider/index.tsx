import { RouterProvider } from 'react-router-dom';
import { router } from '../router';

function Router() {
    return (
        <RouterProvider router={router} />
    );
}

export default Router;
