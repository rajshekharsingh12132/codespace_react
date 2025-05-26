import React from 'react';

function Home() {
  try {
    return (
      <div>
        <h2>Home Page</h2>
        <p>Welcome to the Home page of our React Router demo!</p>
      </div>
    );
  } catch (error) {
    return <div>Error loading Home component.</div>;
  }
}

export default React.memo(Home);
