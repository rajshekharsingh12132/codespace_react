import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = React.memo(() => {
  const activeStyle = {
    fontWeight: 'bold',
    color: 'blue',
  };

  return (
    <nav aria-label="Primary navigation" style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <NavLink
        to="/"
        style={({ isActive }) => (isActive ? activeStyle : undefined)}
        aria-current="page"
      >
        Home
      </NavLink>{' '}
      |{' '}
      <NavLink
        to="/about"
        style={({ isActive }) => (isActive ? activeStyle : undefined)}
        aria-current="page"
      >
        About
      </NavLink>{' '}
      |{' '}
      <NavLink
        to="/contact"
        style={({ isActive }) => (isActive ? activeStyle : undefined)}
        aria-current="page"
      >
        Contact
      </NavLink>{' '}
      |{' '}
      <NavLink
        to="/todos"
        style={({ isActive }) => (isActive ? activeStyle : undefined)}
        aria-current="page"
      >
        To-Do List
      </NavLink>
    </nav>
  );
});

export default Navbar;
