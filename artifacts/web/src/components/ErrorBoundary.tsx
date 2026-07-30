import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

function generateErrorId(): string {
  return `err_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorId: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorId: generateErrorId() };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    const errorId = this.state.errorId ?? generateErrorId();
    import("posthog-js").then(({ default: posthog }) => {
      posthog.capture("js_error", {
        error_id: errorId,
        error_message: error.message,
        error_name: error.name,
        error_stack: error.stack?.slice(0, 800),
        component_stack: info.componentStack?.slice(0, 400),
        url: window.location.pathname,
        user_agent: navigator.userAgent.slice(0, 100),
      });
    });
    console.error(`[ErrorBoundary] ${errorId}:`, error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorId: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="text-center space-y-4 max-w-md">
            <div className="text-6xl">⚠️</div>
            <h1 className="text-2xl font-bold">কিছু একটা সমস্যা হয়েছে</h1>
            <p className="text-muted-foreground text-sm">
              {this.state.error?.message ?? "Unknown error"}
            </p>
            {this.state.errorId && (
              <p className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                Error ID: {this.state.errorId}
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:opacity-90"
              >
                আবার চেষ্টা করুন
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90"
              >
                পেজ রিলোড করুন
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
