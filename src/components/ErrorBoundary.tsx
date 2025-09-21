import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  name?: string;
}

// ErrorBoundary component to catch rendering errors
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in ${this.props.name || 'component'}:`, error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h3 className="error-boundary-title">
            Something went wrong
          </h3>
          <p className="error-boundary-message">
            Please refresh the page to continue.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;