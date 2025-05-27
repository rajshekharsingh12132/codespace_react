import React from 'react';

const Home = () => (
  <div>
    <h1>Welcome to the User Management System</h1>
    <p>Use the navigation to manage users.</p>
  </div>
);

export default Home;

// --- Inline tests for Home.jsx ---
if (process.env.NODE_ENV === 'test') {
  const React = require('react');
  const { render, screen } = require('@testing-library/react');
  //const '@testing-library/jest-dom/extend-expect';

  describe('Home Page', () => {
    test('renders welcome message', () => {
      render(<Home />);
      expect(screen.getByText(/Welcome to the User Management System/i)).toBeInTheDocument();
    });
  });
}
