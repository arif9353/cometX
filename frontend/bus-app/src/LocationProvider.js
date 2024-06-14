import React, { createContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabaseClient';

export const LocationContext = createContext();

const LocationProvider = ({ children }) => {
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        const updateLocation = async () => {
            try {
                let location = await Location.getCurrentPositionAsync({});
                await AsyncStorage.setItem('latitude', String(location.coords.latitude));
                await AsyncStorage.setItem('longitude', String(location.coords.longitude));

                // Update location in Supabase
                const userId = await AsyncStorage.getItem('user_id'); // Assuming user_id is stored in AsyncStorage
                if (userId) {
                    const { error } = await supabase
                        .from('passenger')
                        .update({ latitude: location.coords.latitude, longitude: location.coords.longitude })
                        .eq('id', userId);
                    console.log("Updated the location")
                    if (error) {
                        console.error('Error updating location:', error);
                    }
                }
            } catch (error) {
                console.error('Error getting location:', error);
            }
        };

        const startLocationUpdates = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            updateLocation(); // Initial update
            const intervalId = setInterval(updateLocation, 30000); // Update location every 30 seconds

            return () => clearInterval(intervalId); // Clean up the interval on component unmount
        };

        startLocationUpdates();
    }, []);

    return (
        <LocationContext.Provider value={{ errorMsg }}>
            {children}
        </LocationContext.Provider>
    );
};

export default LocationProvider;
