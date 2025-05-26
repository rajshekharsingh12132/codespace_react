import React, { useEffect, useState } from 'react';

const FetchData = () => {
  const [data, setData] = useState([]); // Stores fetched data
  const [loading, setLoading] = useState(true); // Indicates loading state
  const [error, setError] = useState(null); // Tracks errors

  useEffect(() => {
    // Sample API — you can replace this with any valid endpoint
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((json) => {
        setData(json.slice(0, 10)); // Limit results for brevity
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
  if (loading) return <p>Loading data...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2>Fetched Posts</h2>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <strong>{item.title}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FetchData;
