import { ComponentType, ReactNode, useMemo } from 'react';
import { RouterProvider as RouterDomProvider } from 'react-router-dom';
import { getRouter } from '../../model/router';

interface RouterProviderProps {
    errorBoundary: ComponentType<{ children: ReactNode }>;
}

function RouterProvider({ errorBoundary }: RouterProviderProps) {
    const router = useMemo(() => (
        getRouter(errorBoundary)
    ), [errorBoundary]);

    return (
        <RouterDomProvider
            router={router}
        />
    );
}

export default RouterProvider;
