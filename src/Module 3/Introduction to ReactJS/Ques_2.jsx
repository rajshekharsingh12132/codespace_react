import React, { useMemo } from 'react';

const Ques2 = () => {
  const currentYear = useMemo(() => {
    try {
      return new Date().getFullYear();
    } catch (error) {
      console.error("Failed to get current year:", error);
      return "Year unavailable";
    }
  }, []);

  return <p>The current year is {currentYear}.</p>;
};

export default Ques2;
