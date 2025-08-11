import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-red-900 dark:to-orange-900 flex items-center justify-center p-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>

            {/* Error Message */}
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Something Went Wrong
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              AeonWorld encountered an unexpected error. This could be due to a simulation issue or rendering problem.
            </p>

            {/* Error Details */}
            {this.state.error && (
              <div className="glass-panel p-6 rounded-2xl mb-8 text-left">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Error Details:
                </h3>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <code className="text-sm text-red-800 dark:text-red-200 font-mono">
                    {this.state.error.name}: {this.state.error.message}
                  </code>
                </div>
                {this.state.errorInfo && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                      Stack Trace
                    </summary>
                    <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs overflow-auto text-gray-800 dark:text-gray-200">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={this.handleReload}
                className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Reload Application</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex items-center space-x-2 bg-white/80 hover:bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors border border-gray-200"
              >
                <Home className="w-5 h-5" />
                <span>Go Home</span>
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              <p>If this problem persists, try:</p>
              <ul className="mt-2 space-y-1">
                <li>• Clearing your browser cache</li>
                <li>• Disabling browser extensions</li>
                <li>• Using a different browser</li>
                <li>• Checking the browser console for more details</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}