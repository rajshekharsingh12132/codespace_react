import React from 'react';
import Todos from './Module 4/Redux Toolkit - State Management in React/Todos_Redux/Todos';
import PropTypes from 'prop-types';

/**
 * Main application component that serves as the root component.
 * Wraps the Todos component which contains the main application logic.
 */
function App() {
  return (
    <div className="App">
      <Todos />
    </div>
  );
}

App.propTypes = {
  // Potential future props could be added here
};

export default App;