import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css'; // Optional CSS for styling

function NavBar() {
  return (
    <nav aria-label="Main navigation" style={{ padding: '1rem', background: '#eee' }}>
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? 'active-link' : '')}
        style={{ marginRight: 10 }}
      >
        Home
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) => (isActive ? 'active-link' : '')}
        style={{ marginRight: 10 }}
      >
        About
      </NavLink>
      <NavLink
        to="/about/subpage"
        className={({ isActive }) => (isActive ? 'active-link' : '')}
        style={{ marginRight: 10 }}
      >
        Subpage
      </NavLink>
      <NavLink
        to="/contact"
        className={({ isActive }) => (isActive ? 'active-link' : '')}
      >
        Contact
      </NavLink>
    </nav>
  );
}

export default React.memo(NavBar);
