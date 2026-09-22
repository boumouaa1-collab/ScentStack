import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surfaces in the browser console / Vercel function logs instead of failing silently.
    console.error('Scent Stack crashed:', error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '1rem',
            background: '#f7f1e8',
            color: '#4a1c2c',
            fontFamily: 'Georgia, serif',
            textAlign: 'center',
            padding: '2rem',
          }}
        >
          <h1 style={{ fontSize: '2rem', margin: 0 }}>Something went wrong.</h1>
          <p style={{ maxWidth: 420, color: '#2b2522', fontFamily: 'system-ui, sans-serif', fontSize: '0.95rem' }}>
            This page hit an unexpected error. Refreshing usually fixes it — if it keeps happening, please
            contact support so we can take a look.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '999px',
              background: '#b08d57',
              color: '#fff',
              border: 'none',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              cursor: 'pointer',
            }}
          >
            Back to home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
