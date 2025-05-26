import React, { Component } from 'react';
import SimpleForm from './Module 4/Advanced React Concepts/Forms/SimpleForm';
import React from 'react';
import { render } from '@testing-library/react';
// Error Boundary to catch errors in rendering child components
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state to show fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error details here
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong while loading the form.</h2>;
    }
    return this.props.children;
  }
}

/**
 * App component: Root component rendering the SimpleForm with error handling.
 */
const App = () => {
  return (
    <ErrorBoundary>
      <SimpleForm />
    </ErrorBoundary>
  );
};

export default App;

// --- Simple inline test for ErrorBoundary in App ---

if (process.env.NODE_ENV === 'test') {
  

  (async () => {
    try {
      render(<App />);
      console.log('App component render test passed');
    } catch (err) {
      console.error('App component render test failed', err);
      throw err;
    }
  })();
}

