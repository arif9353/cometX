import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Modal,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalStops from './ModalStops';

const stations = [
    {
        name: "BACKBAY BUS DEPOT",
        details: ["Destination", "AGARKAR CHOWK BUS STOP ANDHERI EAST", "KANJURMARG WEST BUS STATION"]
    },
    {
        name: "CSMT BUS STATION",
        details: ["Destination", "AGARKAR CHOWK BUS STOP ANDHERI EAST", "KANJURMARG WEST BUS STATION", "BACKBAY BUS DEPOT"]
    },
    {
        name: "MARINE LINES BUS STATION",
        details: ["Destination", "AGARKAR CHOWK BUS STOP ANDHERI EAST", "KANJURMARG WEST BUS STATION", "BACKBAY BUS DEPOT"]
    },
    {
        name: "BALLARD PIER BUS STOP",
        details: ["Destination", "AGARKAR CHOWK BUS STOP ANDHERI EAST", "KANJURMARG WEST BUS STATION", "BACKBAY BUS DEPOT"]
    },
    {
        name: "PRIYADARSHANI PARK BUS STOP",
        details: ["Destination", "AGARKAR CHOWK BUS STOP ANDHERI EAST", "BACKBAY BUS DEPOT"]
    },
    {
        name: "WADALA BUS DEPOT",
        details: ["Destination", "AGARKAR CHOWK BUS STOP ANDHERI EAST", "KANJURMARG WEST BUS STATION", "BACKBAY BUS DEPOT"]
    },
    {
        name: "MAHIM BUS DEPOT",
        details: ["Destination", "AGARKAR CHOWK BUS STOP ANDHERI EAST", "KANJURMARG WEST BUS STATION", "BACKBAY BUS DEPOT"]
    },
    {
        name: "KHODADAD CIRCLE DADAR EAST",
        details: ["Destination", "AGARKAR CHOWK BUS STOP ANDHERI EAST", "KANJURMARG WEST BUS STATION", "BACKBAY BUS DEPOT"]
    },
    {
        name: "RANI LAXMIBAI BUS STATION SION",
        details: ["Destination", "AGARKAR CHOWK BUS STOP ANDHERI EAST", "BACKBAY BUS DEPOT", "SAKI NAKA BUS STOP", "BORIVALI WEST BUS STATION"]
    },
    {
        name: "BANDRA WEST BUS DEPOT",
        details: ["Destination", "AGARKAR CHOWK BUS STOP ANDHERI EAST", "BACKBAY BUS DEPOT", "SAKI NAKA BUS STOP", "BORIVALI WEST BUS STATION"]
    },
    {
        name: "PRABODHANKAR THACKRAY UDAYAN SEWRI",
        details: ["Destination", "AGARKAR CHOWK BUS STOP ANDHERI EAST", "BACKBAY BUS DEPOT", "SAKI NAKA BUS STOP", "BORIVALI WEST BUS STATION"]
    },
    {
        name: "AGARKAR CHOWK BUS STOP ANDHERI EAST",
        details: ["Destination", "BACKBAY BUS DEPOT", "SAKI NAKA BUS STOP", "BORIVALI WEST BUS STATION"]
    },
    {
        name: "VIRWANI ESTATE GOREGAON EAST BUS STOP",
        details: ["Destination", "AGARKAR CHOWK BUS STOP ANDHERI EAST", "SANTACRUZ BUS DEPOT", "SAKI NAKA BUS STOP", "BORIVALI WEST BUS STATION"]
    },
    {
        name: "BORIVALI WEST BUS STATION",
        details: ["Destination", "AGARKAR CHOWK BUS STOP ANDHERI EAST"]
    },
    {
        name: "OSHIWARA BUS DEPOT",
        details: ["Destination", "AGARKAR CHOWK BUS STOP ANDHERI EAST", "BORIVALI WEST BUS STATION"]
    },
    {
        name: "GHATKOPAR BUS DEPOT",
        details: ["Destination", "AGARKAR CHOWK BUS STOP ANDHERI EAST", "SAKI NAKA BUS STOP"]
    },
    {
        name: "SAKI NAKA BUS STOP",
        details: ["Destination", "AGARKAR CHOWK BUS STOP ANDHERI EAST", "SANTACRUZ BUS DEPOT"]
    },
    {
        name: "MULUND WEST BUS DEPOT",
        details: ["Destination", "KANJURMARG WEST BUS STATION", "SANTACRUZ BUS DEPOT", "BACKBAY BUS DEPOT", "SAKI NAKA BUS STOP"]
    },
    {
        name: "VIKHROLI BUS DEPOT",
        details: ["Destination", "AGARKAR CHOWK BUS STOP ANDHERI EAST", "SAKI NAKA BUS STOP"]
    },
    {
        name: "VILE PARLE BUS STAND",
        details: ["Destination", "AGARKAR CHOWK BUS STOP ANDHERI EAST", "SANTACRUZ BUS DEPOT", "SAKI NAKA BUS STOP", "BORIVALI WEST BUS STATION"]
    },
    {
        name: "CHEMBUR BUS DEPOT",
        details: ["Destination", "SAKI NAKA BUS STOP", "AGARKAR CHOWK BUS STOP ANDHERI EAST", "SANTACRUZ BUS DEPOT"]
    },
    {
        name: "KANJURMARG WEST BUS STATION",
        details: ["Destination", "SANTACRUZ BUS DEPOT", "SAKI NAKA BUS STOP", "BACKBAY BUS DEPOT"]
    },
    {
        name: "KURLA NEHRU NAGAR BUS DEPOT",
        details: ["Destination", "SAKI NAKA BUS STOP", "AGARKAR CHOWK BUS STOP ANDHERI EAST", "SANTACRUZ BUS DEPOT"]
    },
    {
        name: "SANTACRUZ BUS DEPOT",
        details: ["Destination", "AGARKAR CHOWK BUS STOP ANDHERI EAST", "BORIVALI WEST BUS STATION", "SAKI NAKA BUS STOP"]
    }
];

const busRoutes = {
    "102": [
        "BACKBAY BUS DEPOT",
        "CSMT BUS STATION",
        "MARINE LINES BUS STATION",
        "BALLARD PIER BUS STOP",
        "PRIYADARSHANI PARK BUS STOP",
        "WADALA BUS DEPOT",
        "MAHIM BUS DEPOT",
        "KHODADAD CIRCLE DADAR EAST",
        "RANI LAXMIBAI BUS STATION SION",
        "BANDRA WEST BUS DEPOT",
        "PRABODHANKAR THACKRAY UDAYAN SEWRI",
        "AGARKAR CHOWK BUS STOP ANDHERI EAST"
    ],
    "103": [
        "AGARKAR CHOWK BUS STOP ANDHERI EAST",
        "RANI LAXMIBAI BUS STATION SION",
        "BANDRA WEST BUS DEPOT",
        "PRABODHANKAR THACKRAY UDAYAN SEWRI",
        "GHATKOPAR BUS DEPOT",
        "VIKHROLI BUS DEPOT",
        "KURLA NEHRU NAGAR BUS DEPOT",
        "CHEMBUR BUS DEPOT",
        "SAKI NAKA BUS STOP"
    ],
    "104": [
        "AGARKAR CHOWK BUS STOP ANDHERI EAST",
        "RANI LAXMIBAI BUS STATION SION",
        "BANDRA WEST BUS DEPOT",
        "PRABODHANKAR THACKRAY UDAYAN SEWRI",
        "SANTACRUZ BUS DEPOT",
        "VILE PARLE BUS STAND",
        "OSHIWARA BUS DEPOT",
        "VIRWANI ESTATE GOREGAON EAST BUS STOP",
        "BORIVALI WEST BUS STATION"
    ],
    "105": [
        "SAKI NAKA BUS STOP",
        "KURLA NEHRU NAGAR BUS DEPOT",
        "CHEMBUR BUS DEPOT",
        "MULUND WEST BUS DEPOT",
        "KANJURMARG WEST BUS STATION",
        "VILE PARLE BUS STAND",
        "SANTACRUZ BUS DEPOT"
    ],
    "106": [
        "BACKBAY BUS DEPOT",
        "CSMT BUS STATION",
        "MARINE LINES BUS STATION",
        "BALLARD PIER BUS STOP",
        "WADALA BUS DEPOT",
        "MAHIM BUS DEPOT",
        "KHODADAD CIRCLE DADAR EAST",
        "MULUND WEST BUS DEPOT",
        "KANJURMARG WEST BUS STATION"
    ],
    "601": [
        "KANJURMARG WEST BUS STATION",
        "MULUND WEST BUS DEPOT",
        "WADALA BUS DEPOT",
        "MAHIM BUS DEPOT",
        "KHODADAD CIRCLE DADAR EAST",
        "CSMT BUS STATION",
        "MARINE LINES BUS STATION",
        "BALLARD PIER BUS STOP",
        "BACKBAY BUS DEPOT"
    ],
    "501": [
        "SANTACRUZ BUS DEPOT",
        "VILE PARLE BUS STAND",
        "MULUND WEST BUS DEPOT",
        "KANJURMARG WEST BUS STATION",
        "KURLA NEHRU NAGAR BUS DEPOT",
        "CHEMBUR BUS DEPOT",
        "SAKI NAKA BUS STOP"
    ],
    "401": [
        "BORIVALI WEST BUS STATION",
        "OSHIWARA BUS DEPOT",
        "VIRWANI ESTATE GOREGAON EAST BUS STOP",
        "SANTACRUZ BUS DEPOT",
        "VILE PARLE BUS STAND",
        "RANI LAXMIBAI BUS STATION SION",
        "BANDRA WEST BUS DEPOT",
        "PRABODHANKAR THACKRAY UDAYAN SEWRI",
        "AGARKAR CHOWK BUS STOP ANDHERI EAST"
    ],
    "301": [
        "SAKI NAKA BUS STOP",
        "KURLA NEHRU NAGAR BUS DEPOT",
        "CHEMBUR BUS DEPOT",
        "GHATKOPAR BUS DEPOT",
        "VIKHROLI BUS DEPOT",
        "RANI LAXMIBAI BUS STATION SION",
        "BANDRA WEST BUS DEPOT",
        "PRABODHANKAR THACKRAY UDAYAN SEWRI",
        "AGARKAR CHOWK BUS STOP ANDHERI EAST"
    ],
    "201": [
        "AGARKAR CHOWK BUS STOP ANDHERI EAST",
        "RANI LAXMIBAI BUS STATION SION",
        "BANDRA WEST BUS DEPOT",
        "PRABODHANKAR THACKRAY UDAYAN SEWRI",
        "WADALA BUS DEPOT",
        "MAHIM BUS DEPOT",
        "KHODADAD CIRCLE DADAR EAST",
        "PRIYADARSHANI PARK BUS STOP",
        "CSMT BUS STATION",
        "MARINE LINES BUS STATION",
        "BALLARD PIER BUS STOP",
        "BACKBAY BUS DEPOT"
    ]
};

const allBusStops = [
    "BACKBAY BUS DEPOT",
    "CSMT BUS STATION",
    "BALLARD PIER BUS STOP",
    "RANI LAXMIBAI BUS STATION SION",
    "MARINE LINES BUS STATION",
    "KHODADAD CIRCLE DADAR EAST",
    "PRABODHANKAR THACKRAY UDAYAN SEWRI",
    "VIRWANI ESTATE GOREGAON EAST BUS STOP",
    "BORIVALI WEST BUS STATION",
    "WADALA BUS DEPOT",
    "OSHIWARA BUS DEPOT",
    "AGARKAR CHOWK BUS STOP ANDHERI EAST",
    "BANDRA WEST BUS DEPOT",
    "GHATKOPAR BUS DEPOT",
    "SAKI NAKA BUS STOP",
    "MAHIM BUS DEPOT",
    "MULUND WEST BUS DEPOT",
    "VIKHROLI BUS DEPOT",
    "VILE PARLE BUS STAND",
    "PRIYADARSHANI PARK BUS STOP",
    "CHEMBUR BUS DEPOT",
    "KANJURMARG WEST BUS STATION",
    "KURLA NEHRU NAGAR BUS DEPOT",
    "SANTACRUZ BUS DEPOT"
];

const findBusNumber = (start, end) => {
    for (const [busNumber, stops] of Object.entries(busRoutes)) {
        const startIndex = stops.indexOf(start);
        const endIndex = stops.indexOf(end);
        if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
            return busNumber;
        }
    }
    return null;
};

const findBestRoute = (start, end) => {
    let directRoute = null;
    let connectingRoute = null;

    // Check for direct route
    for (const [busNumber, stops] of Object.entries(busRoutes)) {
        const startIndex = stops.indexOf(start);
        const endIndex = stops.indexOf(end);
        if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
            const route = stops.slice(startIndex, endIndex + 1);
            if (!directRoute || route.length < directRoute.route.length) {
                directRoute = { busNumber, route };
            }
        }
    }

    // Check for connecting route
    for (const [busNumber1, stops1] of Object.entries(busRoutes)) {
        const startIndex1 = stops1.indexOf(start);
        if (startIndex1 === -1) continue;

        for (const stop of stops1.slice(startIndex1 + 1)) {
            for (const [busNumber2, stops2] of Object.entries(busRoutes)) {
                const startIndex2 = stops2.indexOf(stop);
                const endIndex2 = stops2.indexOf(end);
                if (startIndex2 !== -1 && endIndex2 !== -1 && startIndex2 < endIndex2) {
                    const firstBusRoute = stops1.slice(startIndex1, stops1.indexOf(stop) + 1);
                    const secondBusRoute = stops2.slice(startIndex2, endIndex2 + 1);
                    const totalLength = firstBusRoute.length + secondBusRoute.length;
                    if (!connectingRoute || totalLength < (connectingRoute.firstBus.route.length + connectingRoute.secondBus.route.length)) {
                        connectingRoute = {
                            firstBus: { busNumber: busNumber1, route: firstBusRoute },
                            secondBus: { busNumber: busNumber2, route: secondBusRoute },
                        };
                    }
                }
            }
        }
    }

    return { directRoute, connectingRoute };
};

const Dashboard = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredStations, setFilteredStations] = useState(stations);
    const [expandedStation, setExpandedStation] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedStation, setSelectedStation] = useState(null);
    const [excludedStops, setExcludedStops] = useState([]);

    useEffect(() => {
        setFilteredStations(
            stations.filter(station =>
                station.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery]);

    const toggleExpand = (station) => {
        setExpandedStation(expandedStation === station.name ? null : station.name);
    };

    const handleSelectDestination = (destination) => {
        setModalVisible(false);
        const { directRoute, connectingRoute } = findBestRoute(selectedStation, destination);

        if (!directRoute && !connectingRoute) {
            Alert.alert('No Route Found', `No route found from ${selectedStation} to ${destination}.`);
            return;
        }

        let routeText = '';
        if (directRoute) {
            routeText = `From ${selectedStation} take bus number ${directRoute.busNumber} till ${destination}`;
            navigation.navigate('BusDetails', {
                busNumber: directRoute.busNumber,
                startStop: selectedStation,
                endStop: destination,
            });
        } else if (connectingRoute) {
            routeText = `From ${selectedStation} take bus number ${connectingRoute.firstBus.busNumber} till ${connectingRoute.firstBus.route[connectingRoute.firstBus.route.length - 1]}, then from ${connectingRoute.secondBus.route[0]} take bus number ${connectingRoute.secondBus.busNumber} till ${destination}`;
            navigation.navigate('BusDetails', {
                busNumber: connectingRoute.firstBus.busNumber,
                startStop: selectedStation,
                endStop: connectingRoute.firstBus.route[connectingRoute.firstBus.route.length - 1],
            });
            setTimeout(() => {
                navigation.navigate('BusDetails', {
                    busNumber: connectingRoute.secondBus.busNumber,
                    startStop: connectingRoute.firstBus.route[connectingRoute.firstBus.route.length - 1],
                    endStop: destination,
                });
            }, 1000);
        }

        Alert.alert(
            'Select Route',
            `Best Route:\n\n${routeText}`,
            [{ text: 'OK', style: 'default' }]
        );
    };

    const handleDirectStop = (stop) => {
        const busNumber = findBusNumber(selectedStation, stop);
        if (busNumber) {
            Alert.alert(
                'Bus Number',
                `Take bus number ${busNumber} to ${stop}.`,
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('BusDetails', {
                            busNumber: busNumber,
                            startStop: selectedStation,
                            endStop: stop,
                        }),
                    },
                ]
            );
        } else {
            Alert.alert('No Direct Bus', `No direct bus from ${selectedStation} to ${stop}.`);
        }
    };

    const handleOpenModal = (station, excluded) => {
        setSelectedStation(station);
        setExcludedStops(excluded);
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>‹ Mumbai</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Local</Text>
            </View>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="You are at?"
                    placeholderTextColor="#aaa"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            <FlatList
                data={filteredStations}
                renderItem={({ item }) => (
                    <View>
                        <TouchableOpacity onPress={() => toggleExpand(item)}>
                            <View style={styles.stationItem}>
                                <Text style={styles.stationText}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                        {expandedStation === item.name && (
                            <View style={styles.detailsContainer}>
                                {item.details.map((detail, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => detail === "Destination" ? handleOpenModal(item.name, item.details) : handleDirectStop(detail)}
                                    >
                                        <Text style={styles.detailText}>To ➔ {detail}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                )}
                keyExtractor={(item) => item.name}
            />

            <ModalStops
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                excludedStops={excludedStops}
                handleSelectDestination={handleSelectDestination}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#D32F2F', // Red background color
    },
    backButton: {
        color: '#fff',
        fontSize: 16,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    searchContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
    },
    stationItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    stationText: {
        fontSize: 16,
    },
    detailsContainer: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        paddingLeft: 20,
    },
    detailText: {
        fontSize: 14,
        color: '#555',
        paddingVertical: 2,
    },
});

export default Dashboard;
