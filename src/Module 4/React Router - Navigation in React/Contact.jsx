import React from 'react';

function Contact() {
  try {
    const email = 'react-router-demo@example.com';
    return (
      <div>
        <h2>Contact Page</h2>
        <p>Contact us at <a href={`mailto:${email}`}>{email}</a>.</p>
      </div>
    );
  } catch (error) {
    return <div>Error loading Contact component.</div>;
  }
}

export default React.memo(Contact);
