'use client';
import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Browser Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-900 text-white h-full overflow-auto">
          <h1 className="font-bold text-xl mb-2">BrowserApp Crashed</h1>
          <pre className="text-xs whitespace-pre-wrap">{this.state.error?.stack || this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
