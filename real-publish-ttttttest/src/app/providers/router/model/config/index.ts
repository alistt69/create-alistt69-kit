import { ERoutePath, IRouteConfig } from '../../types';

export const routesConfig: Record<Exclude<ERoutePath, ERoutePath.ERROR>, IRouteConfig> = {
    [ERoutePath.MAIN]: {
        path: ERoutePath.MAIN,
        title: 'Main',
    },
};
