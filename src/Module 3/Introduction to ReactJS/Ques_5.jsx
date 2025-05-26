// src/Module 3/Introduction to ReactJS/Ques_5.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Profile = ({ name, age }) => {
  return (
    <div>
      <h2>Profile Information</h2>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
    </div>
  );
};

// Default values in case props are missing
Profile.defaultProps = {
  name: 'Guest',
  age: 'Unknown',
};

// Prop type validation
Profile.propTypes = {
  name: PropTypes.string,
  age: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Profile;
