import { configureStore, combineReducers } from '@reduxjs/toolkit';
import todosReducer from '../todos/todosSlice';

const rootReducer = combineReducers({
  todos: todosReducer,
  // add other reducers here as app grows
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck: false, // if you use non-serializable data in future
      // Add custom middleware for error handling if needed
    }),
});
