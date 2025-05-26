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
      const posts = Array.isArray(response.data) ? response.data.slice(0, maxItems) : [];
      setData(posts);
      setError('');
    } catch (err) {
      console.error('Fetch error:', err.message);
      setError('Failed to fetch data. Please try again.');
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
          {data.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}

      {/* Embedded Test  Mode (Developer Visual Cue) */}
      {process.env.NODE_ENV === 'development' && maxItems > 20 && (
        <p style={{ color: 'orange' }}>
          Warning: maxItems is unusually large, consider reducing it for performance.
        </p>
      )}
    </div>
  );
}
AxiosData.propTypes = {
  maxItems: PropTypes.number.isRequired,
};

export default AxiosData;
