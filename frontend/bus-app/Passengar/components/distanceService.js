import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from './googleMapsConfig';

export const getEstimatedTime = async (origin, destination, waypoints, userDestination, startStop, listboltebhai) => {
    // Ensure latitude and longitude are floats
    const originLat = parseFloat(origin.latitude);
    const originLng = parseFloat(origin.longitude);
    const destLat = parseFloat(destination.latitude);
    const destLng = parseFloat(destination.longitude);


    // Format waypoints for the request
    const end_index = listboltebhai.indexOf(startStop) + 1
    const nextStops_List = waypoints.slice(0, end_index)
    const waypointsuser = nextStops_List.map(point => `${point.latitude},${point.longitude}`).join('|');
    const waypointscomplete = waypoints.map(point => `${point.latitude},${point.longitude}`).join('|');

    const fullRouteUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destLat},${destLng}&waypoints=${waypointscomplete}&key=${GOOGLE_MAPS_API_KEY}`;
    const userRouteUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${userDestination.latitude},${userDestination.longitude}&waypoints=${waypointsuser}&key=${GOOGLE_MAPS_API_KEY}`;
    try {
        const fullRouteResponse = await axios.get(fullRouteUrl);
        const userRouteResponse = await axios.get(userRouteUrl);

        if (fullRouteResponse.data.status === 'OK' && userRouteResponse.data.status === 'OK') {

            const fullRoute = fullRouteResponse.data.routes[0];
            const fullDuration = fullRoute.legs.reduce((total, leg) => total + leg.duration.value, 0);
            const fullDistance = fullRoute.legs.reduce((total, leg) => total + leg.distance.value, 0);

            const userRoute = userRouteResponse.data.routes[0];
            const userDuration = userRoute.legs.reduce((total, leg) => total + leg.duration.value, 0);
            const userDistance = userRoute.legs.reduce((total, leg) => total + leg.distance.value, 0);

            return {
                fullDistance: (fullDistance / 1000).toFixed(2) + ' km', // Convert to kilometers
                fullDuration: (fullDuration / 60).toFixed(2) + ' mins', // Convert to minutes
                userDistance: (userDistance / 1000).toFixed(2) + ' km', // Convert to kilometers
                userDuration: (userDuration / 60).toFixed(2) + ' mins'  // Convert to minutes
            };
        } else {
            throw new Error(fullRouteResponse.data.status || userRouteResponse.data.status);
        }
    } catch (error) {
        console.error('Error fetching estimated time:', error);
        throw error;
    }
};