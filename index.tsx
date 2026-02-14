import React, { Component, ErrorInfo, ReactNode, Suspense } from 'react';
import ReactDOM from 'react-dom/client';

// Helper: Lazy Load with Retry
// This catches "Failed to fetch dynamically imported module" errors and reloads the page once.
const lazyWithRetry = (componentImport: () => Promise<any>) => {
  return React.lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
      return component;
    } catch (error: any) {
      console.error("Lazy load failed for App:", error);
      if (!pageHasAlreadyBeenForceRefreshed) {
        // Assuming that the user is not on the latest version of the application.
        // Let's refresh the page immediately.
        window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
        window.location.reload();
        // Return a never-resolving promise to pause React rendering until reload completes
        return new Promise(() => {}); 
      }
      // If we already reloaded and it still fails, throw the error to be caught by ErrorBoundary
      throw error;
    }
  });
};

// DYNAMIC IMPORT with Retry
const App = lazyWithRetry(() => import('./App'));

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Simple Error Boundary to catch React Rendering errors
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("React Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-center font-sans">
          <div className="max-w-md rounded-3xl bg-white p-8 shadow-xl">
            <h2 className="mb-2 text-2xl font-bold text-slate-900">Something went wrong</h2>
            <p className="mb-6 text-slate-500 text-sm">Please refresh the page or check your connection.</p>
            <pre className="mb-6 overflow-x-auto rounded-lg bg-red-50 p-4 text-xs text-red-600 text-left whitespace-pre-wrap">
              {this.state.error?.message}
            </pre>
            <button 
              onClick={() => window.location.reload()} 
              className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Root element not found");
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <Suspense fallback={
          <div className="fixed inset-0 z-50 bg-slate-50 flex items-center justify-center">
             <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <App />
        </Suspense>
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log("App mounted successfully");
} catch (error: any) {
  console.error("Failed to mount React app:", error);
  // Manual trigger of visual error handler in index.html
  if (window.onerror) window.onerror(error.message, 'index.tsx', 0, 0, error);
}