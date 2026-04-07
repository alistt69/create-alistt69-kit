import { Component, ErrorInfo, ReactNode } from 'react';
import ErrorScreen from '../../ui/error-screen';

type ErrorBoundaryProps = {
    children: ReactNode;
};

type ErrorBoundaryState = {
    hasError: boolean;
    error: Error | null;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    public render(): ReactNode {
        if (this.state.hasError) {
            return (
                <ErrorScreen
                    errorMessage={this.state.error?.message}
                    onRetry={() => window.location.reload()}
                />
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
