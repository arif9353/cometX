import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { getBusDetails } from './busService';
import { getEstimatedTime } from './distanceService';
import { GOOGLE_MAPS_API_KEY } from './googleMapsConfig';

const BusDetails = ({ route }) => {
    const { busNumber, startStop, endStop, userStopLocation } = route.params;
    const [busDetails, setBusDetails] = useState(null);
    const [estimatedTime, setEstimatedTime] = useState(null);
    const [error, setError] = useState(null);
    const [region, setRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const fetchBusDetails = async () => {
        try {
            const details = await getBusDetails(busNumber);
            if (!details) {
                throw new Error('No details found for the bus number');
            }
            setBusDetails(details);
            setRegion({
                latitude: details.latitude,
                longitude: details.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });

            const time = await getEstimatedTime(
                { latitude: details.latitude, longitude: details.longitude },
                userStopLocation
            );
            setEstimatedTime(time);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchBusDetails();

        const intervalId = setInterval(() => {
            fetchBusDetails();
        }, 30000); // Fetch every 30 seconds

        return () => clearInterval(intervalId); // Clean up interval on component unmount
    }, [busNumber]);

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    if (!busDetails) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading bus details...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bus Number: {busNumber}</Text>
            <Text style={styles.detail}>From: {startStop}</Text>
            <Text style={styles.detail}>To: {endStop}</Text>
            <Text style={styles.detail}>Estimated Time: {estimatedTime ? estimatedTime.duration : 'N/A'}</Text>
            <Text style={styles.detail}>Ticket Price: {busDetails.ticketPrice || 'N/A'}</Text>
            <MapView
                style={styles.map}
                region={region}
                onRegionChangeComplete={setRegion}
                showsUserLocation={true}
                followUserLocation={true}
            >
                <Marker coordinate={{ latitude: busDetails.latitude, longitude: busDetails.longitude }} />
                <MapViewDirections
                    origin={`${busDetails.latitude},${busDetails.longitude}`}
                    destination={`${userStopLocation.latitude},${userStopLocation.longitude}`}
                    apikey={GOOGLE_MAPS_API_KEY}
                    strokeWidth={3}
                    strokeColor="blue"
                />
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    detail: {
        fontSize: 18,
        marginBottom: 5,
    },
    map: {
        flex: 1,
        marginTop: 20,
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
    errorText: {
        fontSize: 18,
        textAlign: 'center',
        color: 'red',
        marginTop: 20,
    },
});

export default BusDetails;
