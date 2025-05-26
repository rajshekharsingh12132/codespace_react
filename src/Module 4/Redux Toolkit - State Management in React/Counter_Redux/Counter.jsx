import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from './counterSlice';

const Counter = () => {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  const [amount, setAmount] = useState('');

  // Validate input before dispatching incrementByAmount
  const handleIncrementByAmount = () => {
    const value = Number(amount);
    if (isNaN(value)) {
      alert('Please enter a valid number');
      return;
    }
    dispatch(incrementByAmount(value));
    setAmount(''); // Clear input after dispatch
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Counter: {count}</h2>
      <button onClick={() => dispatch(increment())}>+ Increment</button>{' '}
      <button onClick={() => dispatch(decrement())}>- Decrement</button>
      <br /><br />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <button onClick={handleIncrementByAmount}>
        Increment by Amount
      </button>
    </div>
  );
};

export default Counter;
