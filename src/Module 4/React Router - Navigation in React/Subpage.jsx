import React from 'react';

function Subpage() {
  try {
    return (
      <div>
        <h2>Subpage</h2>
        <p>This is a nested route inside the About section.</p>
      </div>
    );
  } catch (error) {
    return <div>Error loading Subpage.</div>;
  }
}

export default React.memo(Subpage);
