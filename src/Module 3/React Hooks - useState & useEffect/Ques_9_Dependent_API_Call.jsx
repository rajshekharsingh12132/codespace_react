import React, { useEffect, useState } from 'react';

const DependentAPICall = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users on mount
  useEffect(() => {
    setLoadingUsers(true);
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setLoadingUsers(false);
      })
      .catch(err => {
        setError(err.message);
        setLoadingUsers(false);
      });
  }, []);

  // Fetch posts when selectedUserId changes
  useEffect(() => {
    if (!selectedUserId) {
      setPosts([]);
      return;
    }

    setLoadingPosts(true);
    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${selectedUserId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch posts');
        return res.json();
      })
      .then(data => {
        setPosts(data);
        setLoadingPosts(false);
      })
      .catch(err => {
        setError(err.message);
        setLoadingPosts(false);
      });
  }, [selectedUserId]);

  return (
    <div>
      <h2>Users</h2>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {loadingUsers ? (
        <p>Loading users...</p>
      ) : (
        <ul>
          {users.map(user => (
            <li
              key={user.id}
              onClick={() => setSelectedUserId(user.id)}
              style={{
                cursor: 'pointer',
                fontWeight: user.id === selectedUserId ? 'bold' : 'normal',
              }}
            >
              {user.name}
            </li>
          ))}
        </ul>
      )}

      <h3>Posts</h3>
      {loadingPosts ? (
        <p>Loading posts...</p>
      ) : posts.length > 0 ? (
        <ul>
          {posts.map(post => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      ) : (
        selectedUserId && <p>No posts available for this user.</p>
      )}
    </div>
  );
};

export default DependentAPICall;
