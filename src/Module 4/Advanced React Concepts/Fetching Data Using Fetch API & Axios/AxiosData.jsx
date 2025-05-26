import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const AxiosData = ({ maxItems = 10 }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data using Axios
  useEffect(() => {
    axios
      .get('https://jsonplaceholder.typicode.com/posts')
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'An error occurred while fetching data.');
        setLoading(false);
      });
  }, []);

  const retry = () => {
    setLoading(true);
    setError(null);
    setData([]);
    axios
      .get('https://jsonplaceholder.typicode.com/posts')
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'An error occurred while retrying.');
        setLoading(false);
      });
  };

  if (loading) return <p>Loading data with Axios...</p>;

  if (error)
    return (
      <div>
        <p style={{ color: 'red' }}>Error: {error}</p>
        <button onClick={retry}>Retry</button>
      </div>
    );

  return (
    <div>
      <h2>Data fetched using Axios</h2>
      <ul>
        {data.slice(0, maxItems).map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
};

AxiosData.propTypes = {
  maxItems: PropTypes.number,
};

export default AxiosData;
