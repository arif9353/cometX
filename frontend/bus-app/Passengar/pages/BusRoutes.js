import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_API_KEY } from '../components/googleMapsConfig';
import busNumberBasedStops from '../components/busNumberBasedStops';
import busStopsCoordinates from '../components/busStopsCoordinates';
import { useNavigation } from "@react-navigation/native";

const BusRoutes = () => {
    const [selectedBus, setSelectedBus] = useState('102');
    const navigation = useNavigation();
    const busRoute = busNumberBasedStops[selectedBus] || [];
    const waypoints = busRoute.map(stop => busStopsCoordinates[stop]).filter(coord => coord);

    return (
        <View style={styles.container}>
            <Text
                style={styles.back}
                onPress={() => {
                    navigation.navigate("Dashboard_pass");
                }}
            >
                Back
            </Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedBus}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedBus(itemValue)}
                >
                    {Object.keys(busNumberBasedStops).map(busNumber => (
                        <Picker.Item key={busNumber} label={`Bus ${busNumber}`} value={busNumber} />
                    ))}
                </Picker>
            </View>
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: waypoints[0]?.latitude || 0,
                        longitude: waypoints[0]?.longitude || 0,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {waypoints.map((waypoint, index) => (
                        <Marker
                            key={index}
                            coordinate={waypoint}
                        >
                            <View style={styles.customMarker}>
                                <Text style={styles.markerText}>{index + 1}</Text>
                            </View>
                            <Callout>
                                <View style={styles.calloutContainer}>
                                    <Text style={styles.calloutText}>{busRoute[index]}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))}
                    {waypoints.length > 1 && (
                        <MapViewDirections
                            origin={waypoints[0]}
                            destination={waypoints[waypoints.length - 1]}
                            waypoints={waypoints.slice(1, -1)}
                            apikey={GOOGLE_MAPS_API_KEY}
                            strokeWidth={3}
                            strokeColor="blue"
                            optimizeWaypoints={true}
                        />
                    )}
                </MapView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    back: {
        fontWeight: "500",
        fontSize: 15,
        marginLeft: 20,
        marginBottom: 5,
        marginTop: 40,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    pickerContainer: {
        padding: 10,
        backgroundColor: '#f0f0f0',
    },
    picker: {
        height: 175,
        width: '100%',
    },
    mapContainer: {
        flex: 1,
    },
    map: {
        flex: 1,
        marginTop: 10
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
    calloutContainer: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        minWidth: 120, // Adjust this value to increase the width
    },
    calloutText: {
        color: 'black',
        fontSize: 14, // Adjust the font size if needed
    },
});

export default BusRoutes;
