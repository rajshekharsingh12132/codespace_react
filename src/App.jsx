import React, { Component } from 'react';
import Counter from './Module 4/Redux Toolkit - State Management in React/Counter_Redux/Counter';

// Simple Error Boundary to catch render errors in child components
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong. Please refresh the page.</h2>;
    }
    return this.props.children; 
  }
}

const App = () => {
  return (
    <ErrorBoundary>
      <div>
        <h1 style={{ textAlign: 'center' }}>Redux Toolkit Counter App</h1>
        <Counter />
      </div>
    </ErrorBoundary>
  );
};

export default App;
