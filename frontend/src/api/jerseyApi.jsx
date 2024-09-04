import axios from 'axios';

export const fetchJerseys = async () => {
    try {
        const response = await axios.get('https://football-jersy-website-backend.onrender.com/api/jerseys');
        return response.data;
    } catch (error) {
        console.error('Error fetching jerseys:', error);
        return [];
    }
};
