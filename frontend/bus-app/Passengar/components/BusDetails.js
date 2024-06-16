import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { getBusDetails } from './busService';
import { getEstimatedTime } from './distanceService';
import { GOOGLE_MAPS_API_KEY } from './googleMapsConfig';

const busStopsCoordinates = {
    "BACKBAY BUS DEPOT": { latitude: 18.909632149810452, longitude: 72.81736081326508 },
    "CSMT BUS STATION": { latitude: 18.939040405797314, longitude: 72.83546629750742 },
    "BALLARD PIER BUS STOP": { latitude: 18.937224713205794, longitude: 72.84020140674173 },
    "RANI LAXMIBAI BUS STATION SION": { latitude: 19.04162909216262, longitude: 72.8629790178698 },
    "MARINE LINES BUS STATION": { latitude: 18.94135227119705, longitude: 72.82362936360565 },
    "KHODADAD CIRCLE DADAR EAST": { latitude: 19.01695428068996, longitude: 72.84746099954292 },
    "PRABODHANKAR THACKRAY UDAYAN SEWRI": { latitude: 18.998068277850976, longitude: 72.8520096267587 },
    "VIRWANI ESTATE GOREGAON EAST BUS STOP": { latitude: 19.170747929146984, longitude: 72.85888044025228 },
    "BORIVALI WEST BUS STATION": { latitude: 19.23068223117299, longitude: 72.85663008118404 },
    "WADALA BUS DEPOT": { latitude: 19.01460290000002, longitude: 72.85248891696155 },
    "OSHIWARA BUS DEPOT": { latitude: 19.152928661869556, longitude: 72.83707523455593 },
    "AGARKAR CHOWK BUS STOP ANDHERI EAST": { latitude: 19.118887794434833, longitude: 72.84820817779712 },
    "BANDRA WEST BUS DEPOT": { latitude: 19.053368849733268, longitude: 72.83852774182463 },
    "GHATKOPAR BUS DEPOT": { latitude: 19.08607790663372, longitude: 72.91925245173387 },
    "SAKI NAKA BUS STOP": { latitude: 19.10529084719511, longitude: 72.88557616349726 },
    "MAHIM BUS DEPOT": { latitude: 19.043073792972763, longitude: 72.84036613592232 },
    "MULUND WEST BUS DEPOT": { latitude: 19.17552802117634, longitude: 72.94675639034848 },
    "VIKHROLI BUS DEPOT": { latitude: 19.10191789357874, longitude: 72.91952638422788 },
    "VILE PARLE BUS STAND": { latitude: 19.100463787719562, longitude: 72.84466430474967 },
    "PRIYADARSHANI PARK BUS STOP": { latitude: 19.052260887410764, longitude: 72.87947420011628 },
    "CHEMBUR BUS DEPOT": { latitude: 19.044577657695648, longitude: 72.89329293369589 },
    "KANJURMARG WEST BUS STATION": { latitude: 19.130652858629272, longitude: 72.92864793094442 },
    "KURLA NEHRU NAGAR BUS DEPOT": { latitude: 19.058132358229276, longitude: 72.88336005550829 },
    "SANTACRUZ BUS DEPOT": { latitude: 19.09127141800914, longitude: 72.83831246932138 },
};

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
                latitude: parseFloat(details.latitude),
                longitude: parseFloat(details.longitude),
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });

            const waypoints = details.nextStopsList.map(stop => busStopsCoordinates[stop]);
            const time = await getEstimatedTime(
                { latitude: parseFloat(details.latitude), longitude: parseFloat(details.longitude) },
                { latitude: parseFloat(userStopLocation.latitude), longitude: parseFloat(userStopLocation.longitude) },
                waypoints
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

    if (!busDetails || !userStopLocation) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading bus details...</Text>
            </View>
        );
    }

    // Get the waypoints from the next stops list
    const end_index = busDetails.nextStopsList.indexOf(startStop) + 1
    const nextStops_List = busDetails.nextStopsList.slice(0, end_index)
    const waypoints = nextStops_List.map(stop => busStopsCoordinates[stop]);

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
                {busDetails.latitude && busDetails.longitude && (
                    <Marker coordinate={{ latitude: parseFloat(busDetails.latitude), longitude: parseFloat(busDetails.longitude) }} />
                )}
                {busDetails.latitude && busDetails.longitude && userStopLocation.latitude && userStopLocation.longitude && (
                    <MapViewDirections
                        origin={{ latitude: parseFloat(busDetails.latitude), longitude: parseFloat(busDetails.longitude) }}
                        destination={{ latitude: parseFloat(userStopLocation.latitude), longitude: parseFloat(userStopLocation.longitude) }}
                        waypoints={waypoints}
                        apikey={GOOGLE_MAPS_API_KEY}
                        strokeWidth={3}
                        strokeColor="blue"
                    />
                )}
                {waypoints.map((waypoint, index) => (
                    <Marker
                        key={index}
                        coordinate={waypoint}
                    >
                        <View style={styles.customMarker}>
                            <Text style={styles.markerText}>{index + 1}</Text>
                        </View>
                    </Marker>
                ))}
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
    customMarker: {
        backgroundColor: 'yellow',
        padding: 5,
        borderRadius: 5,
    },
    markerText: {
        color: 'black',
        fontWeight: 'bold',
    },
});

export default BusDetails;
