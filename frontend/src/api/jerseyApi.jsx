import axios from 'axios';

export const fetchJerseys = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/jerseys');
        return response.data;
    } catch (error) {
        console.error('Error fetching jerseys:', error);
        return [];
    }
};
