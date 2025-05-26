import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial state for the todos slice
 */
const initialState = {
  todos: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

/**
 * Todos slice containing reducer logic and actions
 */
export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action) => {
        state.todos.push({
          id: Date.now(),
          text: action.payload,
          completed: false,
        });
      },
      prepare: (text) => {
        return { payload: text.trim() };
      }
    },
    toggleTodo: (state, action) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
  },
});

// Selectors
export const selectAllTodos = state => state.todos.todos;
export const selectTodoById = (state, todoId) => 
  state.todos.todos.find(todo => todo.id === todoId);

export const { addTodo, toggleTodo, deleteTodo } = todosSlice.actions;
export default todosSlice.reducer;