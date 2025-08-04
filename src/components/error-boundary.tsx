'use client';

import React, { Component, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type ErrorBoundaryProps = {
    children: ReactNode;
    onError?: () => void;
};

type ErrorBoundaryState = {
    hasError: boolean;
};

class ErrorBoundaryBase extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught in ErrorBoundary:', error, errorInfo);
        this.setState({ hasError: true });
        if (this.props.onError) this.props.onError();
    }

    render() {
        if (this.state.hasError) {
        return null; 
        }

        return this.props.children;
    }
}

export default function ErrorBoundaryWrapper({ children }: { children: ReactNode }) {
    const router = useRouter();

    return (
        <ErrorBoundaryBase onError={() => router.push('/internal-server-error')}>
        {children}
        </ErrorBoundaryBase>
    );
}
