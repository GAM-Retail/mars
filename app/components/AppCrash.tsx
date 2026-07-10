import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '~/components/ui/button';

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AppCrash extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AppCrash caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
          <h1 className="text-2xl font-bold text-destructive">Something went wrong</h1>
          <p className="text-muted-foreground">{this.state.error?.message}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
