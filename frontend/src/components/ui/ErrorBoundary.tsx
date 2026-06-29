import React from "react";

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-paper text-obsidian font-geist flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <p className="font-mono text-6xl font-medium text-obsidian/15 mb-4">!</p>
            <h1 className="font-geist font-medium text-obsidian text-2xl mb-3">
              Something went wrong
            </h1>
            <p className="text-graphite text-[15px] mb-8 leading-relaxed">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 bg-onyx text-paper px-6 py-2.5 rounded-full text-[13px] font-medium tracking-wide hover:bg-obsidian/90 transition-colors duration-200"
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
