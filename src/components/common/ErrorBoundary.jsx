import React from "react";
import { Button } from "./index";

/**
 * Error Boundary component that catches JavaScript errors in child components
 * and displays a fallback UI instead of crashing the entire app.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging
    console.error("Error Boundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoBack = () => {
    // Navigate back or to a safe page
    if (this.props.onGoBack) {
      this.props.onGoBack();
    } else {
      window.history.back();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="error-boundary">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h2>Something went wrong</h2>
            <p>
              We're sorry, but something unexpected happened. This might be a
              temporary issue.
            </p>

            {this.props.showDetails && this.state.error && (
              <details className="error-details">
                <summary>Error Details</summary>
                <div className="error-message">
                  <strong>Error:</strong> {this.state.error.toString()}
                </div>
                {this.state.errorInfo && (
                  <div className="error-stack">
                    <strong>Stack Trace:</strong>
                    <pre>{this.state.errorInfo.componentStack}</pre>
                  </div>
                )}
              </details>
            )}

            <div className="error-actions">
              <Button onClick={this.handleRetry} variant="primary">
                Try Again
              </Button>
              <Button onClick={this.handleGoBack} variant="secondary">
                Go Back
              </Button>
            </div>

            {this.props.fallback && (
              <div className="error-fallback">{this.props.fallback}</div>
            )}
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
