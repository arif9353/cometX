import { supabase } from '../../src/supabaseClient';

export const getBusDetails = async (busNumber) => {
    try {
        const { data, error } = await supabase
            .from('driver')
            .select('*')
            .eq('bus_number', busNumber);

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            throw new Error('No details found for the bus number');
        }

        const busData = data[0];
        return {
            latitude: busData.latitude,
            longitude: busData.longitude,
            estimatedTime: busData.estimated_time,
            ticketPrice: "20 rs",
            nextStopsList: busData.next_stops_list,
            stopsList: busData.stopsList  // Fetch the next stops list
        };
    } catch (error) {
        console.error('Error fetching bus details:', error.message);
        throw error;
    }
};
