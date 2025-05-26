import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

function AxiosData({ maxItems }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      if (Array.isArray(response.data)) {
        setData(response.data.slice(0, maxItems));
      } else {
        throw new Error('Invalid data format');
      }
      setError('');
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [maxItems]);

  return (
    <div>
      <h2>Posts</h2>
      {loading && <p>Loading...</p>}
      {error && (
        <div>
          <p style={{ color: 'red' }}>{error}</p>
          <button onClick={fetchData}>Retry</button>
        </div>
      )}
      {!loading && !error && (
        <ul>
          {data.map(post => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}

      {/* Dev-only inline validation display */}
      {process.env.NODE_ENV === 'development' && typeof maxItems !== 'number' && (
        <p style={{ color: 'orange' }}>Warning: maxItems should be a number!</p>
      )}
    </div>
  );
}

AxiosData.propTypes = {
  maxItems: PropTypes.number.isRequired,
};

export default AxiosData;
