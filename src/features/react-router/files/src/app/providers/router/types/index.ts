export enum ERoutePath {
    MAIN = '',
    // @route-enum
    ERROR = '*',
}

export interface IRouteConfig {
    path: ERoutePath;
    title: string;
}
