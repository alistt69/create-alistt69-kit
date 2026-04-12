export enum ERoutePath {
    MAIN = '',
    ERROR = '*',
}

export interface IRouteConfig {
    path: ERoutePath;
    title: string;
}
