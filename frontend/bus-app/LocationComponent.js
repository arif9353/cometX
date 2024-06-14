import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LocationComponent = () => {
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            await AsyncStorage.setItem('latitude', String(location.coords.latitude));
            await AsyncStorage.setItem('longitude', String(location.coords.longitude));
            const async_lat = await AsyncStorage.getItem('latitude');
            const async_long = await AsyncStorage.getItem('longitude');
            console.log("This is latitude in locationcomponent: ", async_lat);
            console.log("This is async long in LocationComponent: ", async_long)
        })();
    }, []);

    return (
        <View>
            {errorMsg ? <Text style={styles.paragraph}>{errorMsg}</Text> : null}
        </View>
    );
};


export default LocationComponent;
