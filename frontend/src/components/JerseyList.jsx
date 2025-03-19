import React, { useEffect, useState } from 'react';
import JerseyItem from './JerseyItem';
import jerseyImages from '../utils/jerseyImages';
import './JerseyList.css';

const JerseyList = () => {
  const [jerseys, setJerseys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJerseys = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://football-jersy-website-backend.onrender.com/api/jerseys');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setJerseys(data);
      } catch (error) {
        console.error('Error fetching jerseys:', error);
        setError('Failed to load jerseys. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJerseys();
  }, []);

  if (loading) {
    return (
      <div className="jersey-list loading-container">
        <div className="loader"></div>
        <p>Loading jerseys...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jersey-list error-container">
        <p className="error-message">{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

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
            size={jersey.size || "M"}
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
