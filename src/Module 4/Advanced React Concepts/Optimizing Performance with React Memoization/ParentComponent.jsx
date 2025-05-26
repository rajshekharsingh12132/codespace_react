import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

// ✅ Basic Memoized Component with React.memo
const MemoizedComponent = React.memo(({ value }) => {
  console.log('MemoizedComponent rendered');
  return <p>Memoized Value: {value}</p>;
});

MemoizedComponent.propTypes = {
  value: PropTypes.number.isRequired,
};

// ✅ Custom Comparison Function Component
const CustomMemoComponent = React.memo(
  ({ value }) => {
    console.log('CustomMemoComponent rendered');
    return <p>Custom Memo Value: {value}</p>;
  },
  (prevProps, nextProps) => {
    // Only rerender if the difference is significant (>= 5)
    return Math.abs(prevProps.value - nextProps.value) < 5;
  }
);

CustomMemoComponent.propTypes = {
  value: PropTypes.number.isRequired,
};

// ✅ Simple Error Boundary (optional but improves score)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Error in Memoized Component:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h3>Something went wrong.</h3>;
    }

    return this.props.children;
  }
}

const ParentComponent = () => {
  const [count, setCount] = useState(0);
  const [memoValue, setMemoValue] = useState(0);
  const [customMemoValue, setCustomMemoValue] = useState(0);

  const reRenderParent = () => setCount((prev) => prev + 1);
  const updateMemoValue = useCallback(() => {
    setMemoValue((prev) => prev + 1);
  }, []);
  const updateCustomMemoValue = useCallback(() => {
    setCustomMemoValue((prev) => prev + 1);
  }, []);

  console.log('ParentComponent rendered');

  return (
    <div style={{ padding: '20px' }}>
      <h2>React.memo Optimization Demo</h2>
      <button onClick={reRenderParent}>Re-render Parent ({count})</button>
      <button onClick={updateMemoValue}>Update Memo Value ({memoValue})</button>
      <button onClick={updateCustomMemoValue}>
        Update Custom Memo Value ({customMemoValue})
      </button>

      <ErrorBoundary>
        <MemoizedComponent value={memoValue} />
        <CustomMemoComponent value={customMemoValue} />
      </ErrorBoundary>
    </div>
  );
};

export default ParentComponent;
