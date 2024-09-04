import React, { useEffect, useState } from 'react';
import JerseyItem from './JerseyItem';
import jerseyImages from '../utils/jerseyImages';
import './JerseyList.css';

const JerseyList = () => {
  const [jerseys, setJerseys] = useState([]);

  useEffect(() => {
    const fetchJerseys = async () => {
      try {
        const response = await fetch('https://football-jersy-website-backend.onrender.com/api/jerseys');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setJerseys(data);
      } catch (error) {
        console.error('Error fetching jerseys:', error);
      }
    };

    fetchJerseys();
  }, []);

  return (
    <div className="jersey-list">
      {jerseys.length > 0 ? (
        jerseys.map((jersey) => (
          <JerseyItem
            key={jersey._id}
            id={jersey._id}
            name={jersey.name}
            price={jersey.price}
            description={jersey.description}
            imageUrl={jerseyImages[jersey.imageUrl.replace('/images/', '')] || 'https://via.placeholder.com/300'}
          />
        ))
      ) : (
        <p className="no-jerseys">No jerseys available</p>
      )}
    </div>
  );
};

export default JerseyList;
