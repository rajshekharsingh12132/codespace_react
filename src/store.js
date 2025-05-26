import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './Module 4/Redux Toolkit - State Management in React/Counter_Redux/counterSlice';

// Configure the Redux store with counter reducer
const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
  // Optionally, you can add middleware or devtools config here
});

export default store;
