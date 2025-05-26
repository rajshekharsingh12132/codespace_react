import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './Module 4/Redux Toolkit - State Management in React/Todos_Redux/todosSlice';

/**
 * Configures and creates the Redux store with the todos reducer.
 * Uses Redux Toolkit's configureStore which includes:
 * - Redux Thunk middleware by default
 * - Development checks for common mistakes
 * - Redux DevTools Extension integration
 */
export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
  // Additional middleware can be added here if needed
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
});

/**
 * Type definitions for the RootState and AppDispatch
 * Useful for TypeScript projects (commented out for JS projects)
 */
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;