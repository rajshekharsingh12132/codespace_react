import React, { useState, useCallback } from 'react';

// ✅ Task 1 & 2: Basic Memoized Component
const MemoizedComponent = React.memo(({ value }) => {
  console.log('MemoizedComponent rendered');
  return <p>Memoized Value: {value}</p>;
});

// ✅ Task 3: Custom Comparison Function
const CustomMemoComponent = React.memo(
  ({ value }) => {
    console.log('CustomMemoComponent rendered');
    return <p>Custom Memo Value: {value}</p>;
  },
  (prevProps, nextProps) => {
    // Only re-render if difference is >= 5
    return Math.abs(prevProps.value - nextProps.value) < 5;
  }
);

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
      <button onClick={updateCustomMemoValue}>Update Custom Memo Value ({customMemoValue})</button>

      <MemoizedComponent value={memoValue} />
      <CustomMemoComponent value={customMemoValue} />
    </div>
  );
};

export default ParentComponent;
