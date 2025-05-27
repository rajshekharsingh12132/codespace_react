import React, { useState, useEffect } from 'react';

const UserForm = ({ onSubmit, selectedUser, clearSelection }) => {
  const [user, setUser] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    if (selectedUser) {
      setUser(selectedUser);
    } else {
      setUser({ name: '', email: '', phone: '' });
    }
  }, [selectedUser]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user.name || !user.email) {
      alert('Name and Email are required');
      return;
    }
    onSubmit(user);
    setUser({ name: '', email: '', phone: '' });
  };

  const handleCancel = () => {
    clearSelection();
    setUser({ name: '', email: '', phone: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{selectedUser ? 'Edit User' : 'Add User'}</h2>
      <input
        type="text"
        placeholder="Name"
        name="name"
        value={user.name}
        onChange={handleChange}
        required
      /><br />
      <input
        type="email"
        placeholder="Email"
        name="email"
        value={user.email}
        onChange={handleChange}
        required
      /><br />
      <input
        type="text"
        placeholder="Phone"
        name="phone"
        value={user.phone}
        onChange={handleChange}
      /><br />
      <button type="submit">{selectedUser ? 'Update' : 'Add'}</button>
      {selectedUser && <button type="button" onClick={handleCancel}>Cancel</button>}
    </form>
  );
};

export default UserForm;

// --- Inline tests for UserForm.jsx ---
if (process.env.NODE_ENV === 'test') {
  const React = require('react');
  const { render, fireEvent, screen } = require('@testing-library/react');
  //const '@testing-library/jest-dom/extend-expect';

  describe('UserForm Component', () => {
    const onSubmit = jest.fn();
    const clearSelection = jest.fn();

    test('renders form and submits', () => {
      render(<UserForm onSubmit={onSubmit} selectedUser={null} clearSelection={clearSelection} />);
      fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Alice' } });
      fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'alice@example.com' } });
      fireEvent.click(screen.getByText('Add'));
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Alice',
        email: 'alice@example.com',
        phone: '',
      });
    });

    test('shows Edit User when selectedUser passed', () => {
      const user = { name: 'Bob', email: 'bob@example.com', phone: '1234' };
      render(<UserForm onSubmit={onSubmit} selectedUser={user} clearSelection={clearSelection} />);
      expect(screen.getByDisplayValue('Bob')).toBeInTheDocument();
      expect(screen.getByText('Edit User')).toBeInTheDocument();
    });

    test('calls clearSelection on cancel', () => {
      const user = { name: 'Bob', email: 'bob@example.com', phone: '1234' };
      render(<UserForm onSubmit={onSubmit} selectedUser={user} clearSelection={clearSelection} />);
      fireEvent.click(screen.getByText('Cancel'));
      expect(clearSelection).toHaveBeenCalled();
    });
  });
}
