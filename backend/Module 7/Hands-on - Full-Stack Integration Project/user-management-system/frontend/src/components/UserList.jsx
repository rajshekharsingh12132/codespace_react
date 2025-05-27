import React from 'react';

const UserList = ({ users, onEdit, onDelete }) => {
  if (!users.length) return <p>No users found.</p>;

  return (
    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>Name</th><th>Email</th><th>Phone</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.phone || '-'}</td>
            <td>
              <button onClick={() => onEdit(user)}>Edit</button>{' '}
              <button onClick={() => onDelete(user._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserList;

// --- Inline tests for UserList.jsx ---
if (process.env.NODE_ENV === 'test') {
  const React = require('react');
  const { render, fireEvent, screen } = require('@testing-library/react');
  //const '@testing-library/jest-dom/extend-expect';

  describe('UserList Component', () => {
    const users = [
      { _id: '1', name: 'Alice', email: 'alice@example.com', phone: '111' },
      { _id: '2', name: 'Bob', email: 'bob@example.com', phone: '' },
    ];
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    test('renders users in table', () => {
      render(<UserList users={users} onEdit={onEdit} onDelete={onDelete} />);
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    });

    test('calls onEdit when Edit clicked', () => {
      render(<UserList users={users} onEdit={onEdit} onDelete={onDelete} />);
      fireEvent.click(screen.getAllByText('Edit')[0]);
      expect(onEdit).toHaveBeenCalledWith(users[0]);
    });

    test('calls onDelete when Delete clicked', () => {
      render(<UserList users={users} onEdit={onEdit} onDelete={onDelete} />);
      fireEvent.click(screen.getAllByText('Delete')[1]);
      expect(onDelete).toHaveBeenCalledWith(users[1]._id);
    });

    test('renders message when no users', () => {
      render(<UserList users={[]} onEdit={onEdit} onDelete={onDelete} />);
      expect(screen.getByText('No users found.')).toBeInTheDocument();
    });
  });
}
