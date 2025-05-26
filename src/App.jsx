import React, { Suspense } from 'react';
import PropTypes from 'prop-types';

// Error Boundary Component for runtime rendering errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Error caught in App:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong while rendering the app.</h2>;
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

// Lazy load ParentComponent to simulate dynamic import and handle fallback gracefully
const ParentComponent = React.lazy(() =>
  import('./Module 4/Advanced React Concepts/Optimizing Performance with React Memoization/ParentComponent')
);

function App() {
  return (
    <div className="App">
      <h1>React App: Optimized Memoization Demo</h1>

      <ErrorBoundary>
        <Suspense fallback={<p>Loading Optimized Components...</p>}>
          <ParentComponent />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
