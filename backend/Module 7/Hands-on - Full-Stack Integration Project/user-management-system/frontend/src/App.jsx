import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Users from './pages/Users';

const App = () => (
  <Router>
    <nav>
      <Link to="/">Home</Link> | <Link to="/users">Users</Link>
    </nav>
    <hr />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  </Router>
);

export default App;

// --- Inline tests for App.jsx ---
if (process.env.NODE_ENV === 'test') {
  const React = require('react');
  const { render, screen } = require('@testing-library/react');
  const { MemoryRouter } = require('react-router-dom');
  //const '@testing-library/jest-dom/extend-expect';

  describe('App Component', () => {
    test('renders navigation links', () => {
      render(<App />, { wrapper: MemoryRouter });
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Users')).toBeInTheDocument();
    });
  });
}
