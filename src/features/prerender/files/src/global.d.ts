declare module '*.module.scss' {
    type IClassNames = Record<string, string>;

    const classNames: IClassNames;
    export = classNames;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg' {
    import { FC, SVGProps } from 'react';

    const SVG: FC<SVGProps<SVGSVGElement>>;
    export default SVG;
}

declare global {
    interface Window {
        __PRERENDER_READY__?: boolean;
    }
}
