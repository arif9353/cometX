import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from './googleMapsConfig';

export const getEstimatedTime = async (origin, destination, waypoints) => {
    // Ensure latitude and longitude are floats
    const originLat = parseFloat(origin.latitude);
    const originLng = parseFloat(origin.longitude);
    const destLat = parseFloat(destination.latitude);
    const destLng = parseFloat(destination.longitude);

    // Format waypoints for the request
    const waypointsString = waypoints.map(point => `${point.latitude},${point.longitude}`).join('|');

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destLat},${destLng}&waypoints=${waypointsString}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const route = response.data.routes[0];
            const duration = route.legs.reduce((total, leg) => total + leg.duration.value, 0);
            const distance = route.legs.reduce((total, leg) => total + leg.distance.value, 0);

            return {
                distance: (distance / 1000).toFixed(2) + ' km', // Convert to kilometers
                duration: (duration / 60).toFixed(2) + ' mins'  // Convert to minutes
            };
        } else {
            throw new Error(response.data.status);
        }
    } catch (error) {
        console.error('Error fetching estimated time:', error);
        throw error;
    }
};
