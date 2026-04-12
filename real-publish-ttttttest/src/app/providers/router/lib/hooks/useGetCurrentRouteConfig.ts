import { useLocation } from 'react-router-dom';
import { routesConfig } from '../../model/config';
import { IRouteConfig, ERoutePath } from '../../types';

export const useGetCurrentRouteConfig = (): IRouteConfig => {
    const location = useLocation();

    const firstPathSegment = location.pathname.split('/')[1] || '';

    const matchedRoute = Object.values(routesConfig).find((route) => route.path === firstPathSegment);

    return matchedRoute || routesConfig[ERoutePath.MAIN];
};
