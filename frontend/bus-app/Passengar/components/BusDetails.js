import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { getBusDetails } from './busService';

const BusDetails = ({ route }) => {
    const { busNumber, startStop, endStop } = route.params;
    const [busDetails, setBusDetails] = useState(null);
    const [error, setError] = useState(null);
    const mapRef = useRef(null);

    const fetchBusDetails = async () => {
        try {
            const details = await getBusDetails(busNumber);
            if (!details) {
                throw new Error('No details found for the bus number');
            }
            setBusDetails(details);
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

    useEffect(() => {
        if (busDetails && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: busDetails.latitude || 0,
                longitude: busDetails.longitude || 0,
                latitudeDelta: 0.01, // Adjust as needed for the zoom level
                longitudeDelta: 0.01, // Adjust as needed for the zoom level
            }, 1000); // Duration of the animation in milliseconds
        }
    }, [busDetails]);

    const calculateRoute = (start, end) => {
        // Placeholder function to calculate route between start and end points
        // Replace with actual route calculation logic if needed
        return [
            { latitude: start.latitude, longitude: start.longitude },
            { latitude: end.latitude, longitude: end.longitude }
        ];
    };

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

    const userStopLocation = { // Replace with actual coordinates of the user's bus stop
        latitude: 19.09127141800914,
        longitude: 72.83831246932138
    };

    const routeCoordinates = calculateRoute(busDetails, userStopLocation);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bus Number: {busNumber}</Text>
            <Text style={styles.detail}>From: {startStop}</Text>
            <Text style={styles.detail}>To: {endStop}</Text>
            <Text style={styles.detail}>Estimated Time: {busDetails.estimatedTime || 'N/A'}</Text>
            <Text style={styles.detail}>Ticket Price: {busDetails.ticketPrice || 'N/A'}</Text>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: busDetails.latitude || 0,
                    longitude: busDetails.longitude || 0,
                    latitudeDelta: 0.01, // Adjust as needed for the zoom level
                    longitudeDelta: 0.01, // Adjust as needed for the zoom level
                }}
            >
                <Marker
                    coordinate={{
                        latitude: busDetails.latitude || 0,
                        longitude: busDetails.longitude || 0,
                    }}
                    title={`Bus ${busNumber}`}
                    description={endStop}
                />
                <Marker
                    coordinate={userStopLocation}
                    title="Your Stop"
                    description={endStop}
                    pinColor="blue"
                />
                <Polyline
                    coordinates={routeCoordinates}
                    strokeColor="#000"
                    strokeWidth={3}
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
