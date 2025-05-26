import React, { Component } from 'react';
import SimpleForm from './Module 4/Advanced React Concepts/Forms/SimpleForm.jsx';

// ErrorBoundary class to catch errors in child components
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state to show fallback UI on error
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error to an error reporting service here
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <SimpleForm />
    </ErrorBoundary>
  );
}

export default App;

// --- Inline tests for App.jsx ---

if (process.env.NODE_ENV === 'test') {
  (async () => {
    try {
      const { render, screen } = await import('@testing-library/react');
      render(<App />);
      if (!screen.getByText(/username/i)) {
        throw new Error('App Inline Test Failed: SimpleForm content missing');
      }
      console.log('App Inline Test Passed: SimpleForm renders within ErrorBoundary');

      // Test ErrorBoundary state change manually
      const boundary = new ErrorBoundary({});
      if (boundary.state.hasError) {
        throw new Error('ErrorBoundary initial state should be false');
      }
      const derivedState = ErrorBoundary.getDerivedStateFromError(new Error('Test'));
      if (!derivedState.hasError) {
        throw new Error('ErrorBoundary did not update state correctly');
      }
      console.log('ErrorBoundary Inline Tests Passed');
    } catch (e) {
      console.error('App Inline Tests Failed:', e);
      throw e;
    }
  })();
}
