import React from 'react';

const Profile = ({ name, age }) => {
  return (
    <div>
      <h2>Profile Information</h2>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
    </div>
  );
};

export default Profile;
