import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, toggleTodo, deleteTodo } from './todosSlice';
import PropTypes from 'prop-types';

/**
 * TodoList component that manages and displays todos.
 * Handles adding, toggling, and deleting todos using Redux.
 */
function Todos() {
  const [input, setInput] = useState('');
  const todos = useSelector(state => state.todos.todos);
  const dispatch = useDispatch();

  const handleAddTodo = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      alert('Please enter a valid task');
      return;
    }
    dispatch(addTodo(trimmedInput));
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  return (
    <div className="todo-container">
      <h1>To-Do List</h1>
      <div className="todo-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task"
          aria-label="Add a new task"
        />
        <button onClick={handleAddTodo} aria-label="Add todo">Add</button>
      </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className="todo-item">
            <span
              className={`todo-text ${todo.completed ? 'completed' : ''}`}
              onClick={() => dispatch(toggleTodo(todo.id))}
              aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {todo.text}
            </span>
            <button 
              onClick={() => dispatch(deleteTodo(todo.id))}
              className="delete-button"
              aria-label="Delete todo"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

Todos.propTypes = {
  // Redux props are injected, no need for external props currently
};

export default Todos;