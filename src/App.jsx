import React from 'react';
import PropTypes from 'prop-types';
import AxiosData from './Module 4/Advanced React Concepts/Fetching Data Using Fetch API & Axios/AxiosData';

function App({ maxItems }) {
  if (typeof maxItems !== 'number' || maxItems <= 0) {
    console.error('Invalid maxItems prop. It should be a positive number.');
  }

  return (
    <div>
      <h1>Axios Data Fetch Example</h1>
      <AxiosData maxItems={maxItems} />
    </div>
  );
}

App.propTypes = {
  maxItems: PropTypes.number,
};

App.defaultProps = {
  maxItems: 10,
};

export default App;
