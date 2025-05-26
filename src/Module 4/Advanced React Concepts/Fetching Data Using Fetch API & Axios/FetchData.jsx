import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const FetchData = ({ maxItems = 10 }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      });
  }, []);

  // Inline runtime assertion: data should be an array after fetch
  useEffect(() => {
    if (data && !Array.isArray(data)) {
      console.error('Fetched data is not an array:', data);
    }
  }, [data]);

  // Retry handler for failed fetch
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setData([]);
    // Trigger fetch again by resetting state (simple method: just call fetch again)
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      });
  };

  if (loading) return <p>Loading data...</p>;

  if (error)
    return (
      <div>
        <p style={{ color: 'red' }}>Error: {error}</p>
        <button onClick={handleRetry}>Retry</button>
      </div>
    );

  return (
    <div>
      <h2>Data fetched using Fetch API</h2>
      <ul>
        {data.slice(0, maxItems).map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
};

FetchData.propTypes = {
  maxItems: PropTypes.number,
};

export default FetchData;
