import { Component, ErrorInfo, ReactNode } from 'react';
import ErrorScreen from './ErrorScreen';

type ErrorBoundaryProps = {
    children: ReactNode;
};

type ErrorBoundaryState = {
    hasError: boolean;
    error: Error | null;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    public state: ErrorBoundaryState = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
        };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Unhandled application error:', error, errorInfo);
    }

    private handleRetry = (): void => {
        this.setState({
            hasError: false,
            error: null,
        });
    };

    public render(): ReactNode {
        const { hasError, error } = this.state;

        if (hasError) {
            return (
                <ErrorScreen
                    errorMessage={error?.message}
                    onRetry={this.handleRetry}
                />
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;