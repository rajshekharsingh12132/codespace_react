import React from 'react';

const Greeting = ({ isLoggedIn }) => {
  return (
    <div>
      {isLoggedIn ? <h2>Welcome back!</h2> : <h2>Please log in.</h2>}
    </div>
  );
};

export default Greeting;
