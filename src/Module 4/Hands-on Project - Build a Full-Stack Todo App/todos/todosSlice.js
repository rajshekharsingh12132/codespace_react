import { createSlice, nanoid, createSelector } from '@reduxjs/toolkit';

const initialState = [];

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare(task) {
        if (typeof task !== 'string' || !task.trim()) {
          throw new Error('Invalid task: must be a non-empty string');
        }
        return {
          payload: {
            id: nanoid(),
            task: task.trim(),
            completed: false,
          },
        };
      },
    },
    toggleTodo(state, action) {
      const todo = state.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo(state, action) {
      return state.filter((todo) => todo.id !== action.payload);
    },
  },
});

export const { addTodo, toggleTodo, deleteTodo } = todosSlice.actions;

// Memoized selector example
export const selectCompletedTodos = createSelector(
  (state) => state.todos,
  (todos) => todos.filter((todo) => todo.completed)
);

export default todosSlice.reducer;
