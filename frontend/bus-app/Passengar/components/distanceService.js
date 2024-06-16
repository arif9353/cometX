import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from './googleMapsConfig';

export const getEstimatedTime = async (origin, destination) => {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const element = response.data.rows[0].elements[0];
            if (element.status === 'OK') {
                return {
                    distance: element.distance.text,
                    duration: element.duration.text,
                };
            } else {
                throw new Error(element.status);
            }
        } else {
            throw new Error(response.data.status);
        }
    } catch (error) {
        console.error('Error fetching estimated time:', error);
        throw error;
    }
};
