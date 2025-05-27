import React, { useState, useEffect } from 'react';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const apiUrl = process.env.REACT_APP_API;

  const fetchUsers = async () => {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Fetch users failed:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddOrUpdate = async (user) => {
    if (selectedUser) {
      // Update user
      try {
        const res = await fetch(`${apiUrl}/${selectedUser._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        });
        if (!res.ok) throw new Error('Update failed');
        fetchUsers();
        setSelectedUser(null);
      } catch (error) {
        alert(error.message);
      }
    } else {
      // Add new user
      try {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        });
        if (!res.ok) throw new Error('Add failed');
        fetchUsers();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleEdit = (user) => setSelectedUser(user);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete this user?')) return;
    try {
      const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      fetchUsers();
      if (selectedUser && selectedUser._id === id) setSelectedUser(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const clearSelection = () => setSelectedUser(null);

  return (
    <div>
      <UserForm onSubmit={handleAddOrUpdate} selectedUser={selectedUser} clearSelection={clearSelection} />
      <hr />
      <UserList users={users} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default Users;

// --- Inline tests for Users.jsx ---
if (process.env.NODE_ENV === 'test') {
  const React = require('react');
  const { render, screen, waitFor } = require('@testing-library/react');
  //const '@testing-library/jest-dom/extend-expect';

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { _id: '1', name: 'Test User', email: 'test@example.com', phone: '123' },
      ]),
    })
  );

  describe('Users Page', () => {
    test('fetches and displays users', async () => {
      render(<Users />);
      await waitFor(() => expect(screen.getByText('Test User')).toBeInTheDocument());
    });
  });
}
