import ErrorBoundary from './error-boundary/lib/provider';
import { useGetCurrentRouteConfig } from './router/lib/hooks/useGetCurrentRouteConfig';
import RouterProvider from './router/lib/provider';
import { routesConfig } from './router/model/config';
import { ERoutePath, IRouteConfig } from './router/types';

export {
    // Router
    ERoutePath,
    IRouteConfig,
    routesConfig,
    RouterProvider,
    useGetCurrentRouteConfig,

    // Error Boundary
    ErrorBoundary,
};
