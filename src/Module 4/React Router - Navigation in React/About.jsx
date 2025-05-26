import React from 'react';
import PropTypes from 'prop-types';

function About({ title = "About Page" }) {
  try {
    return (
      <div>
        <h2>{title}</h2>
        <p>This is the About page. Learn more about our app here.</p>
      </div>
    );
  } catch (error) {
    return <div>Error loading About component.</div>;
  }
}

About.propTypes = {
  title: PropTypes.string,
};

export default React.memo(About);
