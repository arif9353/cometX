import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Modal,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalStops from "./ModalStops";

const busStops = {
    "BACKBAY BUS DEPOT": [18.909632149810452, 72.81736081326508],
    "CSMT BUS STATION": [18.939040405797314, 72.83546629750742],
    "BALLARD PIER BUS STOP": [18.937224713205794, 72.84020140674173],
    "RANI LAXMIBAI BUS STATION SION": [19.04162909216262, 72.8629790178698],
    "MARINE LINES BUS STATION": [18.94135227119705, 72.82362936360565],
    "KHODADAD CIRCLE DADAR EAST": [19.01695428068996, 72.84746099954292],
    "PRABODHANKAR THACKRAY UDAYAN SEWRI": [18.998068277850976, 72.8520096267587],
    "VIRWANI ESTATE GOREGAON EAST BUS STOP": [
        19.170747929146984, 72.85888044025228,
    ],
    "BORIVALI WEST BUS STATION": [19.23068223117299, 72.85663008118404],
    "WADALA BUS DEPOT": [19.01460290000002, 72.85248891696155],
    "OSHIWARA BUS DEPOT": [19.152928661869556, 72.83707523455593],
    "AGARKAR CHOWK BUS STOP ANDHERI EAST": [
        19.118887794434833, 72.84820817779712,
    ],
    "BANDRA WEST BUS DEPOT": [19.053368849733268, 72.83852774182463],
    "GHATKOPAR BUS DEPOT": [19.08607790663372, 72.91925245173387],
    "SAKI NAKA BUS STOP": [19.10529084719511, 72.88557616349726],
    "MAHIM BUS DEPOT": [19.043073792972763, 72.84036613592232],
    "MULUND WEST BUS DEPOT": [19.17552802117634, 72.94675639034848],
    "VIKHROLI BUS DEPOT": [19.10191789357874, 72.91952638422788],
    "VILE PARLE BUS STAND": [19.100463787719562, 72.84466430474967],
    "PRIYADARSHANI PARK BUS STOP": [19.052260887410764, 72.87947420011628],
    "CHEMBUR BUS DEPOT": [19.044577657695648, 72.89329293369589],
    "KANJURMARG WEST BUS STATION": [19.130652858629272, 72.92864793094442],
    "KURLA NEHRU NAGAR BUS DEPOT": [19.058132358229276, 72.88336005550829],
    "SANTACRUZ BUS DEPOT": [19.09127141800914, 72.83831246932138],
};

const stations = [
    {
        name: "BACKBAY BUS DEPOT",
        details: [
            "Destination",
            "AGARKAR CHOWK BUS STOP ANDHERI EAST",
            "KANJURMARG WEST BUS STATION",
        ],
    },
    {
        name: "CSMT BUS STATION",
        details: [
            "Destination",
            "AGARKAR CHOWK BUS STOP ANDHERI EAST",
            "KANJURMARG WEST BUS STATION",
            "BACKBAY BUS DEPOT",
        ],
    },
    {
        name: "MARINE LINES BUS STATION",
        details: [
            "Destination",
            "AGARKAR CHOWK BUS STOP ANDHERI EAST",
            "KANJURMARG WEST BUS STATION",
            "BACKBAY BUS DEPOT",
        ],
    },
    {
        name: "BALLARD PIER BUS STOP",
        details: [
            "Destination",
            "AGARKAR CHOWK BUS STOP ANDHERI EAST",
            "KANJURMARG WEST BUS STATION",
            "BACKBAY BUS DEPOT",
        ],
    },
    {
        name: "PRIYADARSHANI PARK BUS STOP",
        details: [
            "Destination",
            "AGARKAR CHOWK BUS STOP ANDHERI EAST",
            "BACKBAY BUS DEPOT",
        ],
    },
    {
        name: "WADALA BUS DEPOT",
        details: [
            "Destination",
            "AGARKAR CHOWK BUS STOP ANDHERI EAST",
            "KANJURMARG WEST BUS STATION",
            "BACKBAY BUS DEPOT",
        ],
    },
    {
        name: "MAHIM BUS DEPOT",
        details: [
            "Destination",
            "AGARKAR CHOWK BUS STOP ANDHERI EAST",
            "KANJURMARG WEST BUS STATION",
            "BACKBAY BUS DEPOT",
        ],
    },
    {
        name: "KHODADAD CIRCLE DADAR EAST",
        details: [
            "Destination",
            "AGARKAR CHOWK BUS STOP ANDHERI EAST",
            "KANJURMARG WEST BUS STATION",
            "BACKBAY BUS DEPOT",
        ],
    },
    {
        name: "RANI LAXMIBAI BUS STATION SION",
        details: [
            "Destination",
            "AGARKAR CHOWK BUS STOP ANDHERI EAST",
            "BACKBAY BUS DEPOT",
            "SAKI NAKA BUS STOP",
            "BORIVALI WEST BUS STATION",
        ],
    },
    {
        name: "BANDRA WEST BUS DEPOT",
        details: [
            "Destination",
            "AGARKAR CHOWK BUS STOP ANDHERI EAST",
            "BACKBAY BUS DEPOT",
            "SAKI NAKA BUS STOP",
            "BORIVALI WEST BUS STATION",
        ],
    },
    {
        name: "PRABODHANKAR THACKRAY UDAYAN SEWRI",
        details: [
            "Destination",
            "AGARKAR CHOWK BUS STOP ANDHERI EAST",
            "BACKBAY BUS DEPOT",
            "SAKI NAKA BUS STOP",
            "BORIVALI WEST BUS STATION",
        ],
    },
    {
        name: "AGARKAR CHOWK BUS STOP ANDHERI EAST",
        details: [
            "Destination",
            "BACKBAY BUS DEPOT",
            "SAKI NAKA BUS STOP",
            "BORIVALI WEST BUS STATION",
        ],
    },
    {
        name: "VIRWANI ESTATE GOREGAON EAST BUS STOP",
        details: [
            "Destination",
            "AGARKAR CHOWK BUS STOP ANDHERI EAST",
            "SANTACRUZ BUS DEPOT",
            "SAKI NAKA BUS STOP",
            "BORIVALI WEST BUS STATION",
        ],
    },
    {
        name: "BORIVALI WEST BUS STATION",
        details: ["Destination", "AGARKAR CHOWK BUS STOP ANDHERI EAST"],
    },
    {
        name: "OSHIWARA BUS DEPOT",
        details: [
            "Destination",
            "AGARKAR CHOWK BUS STOP ANDHERI EAST",
            "BORIVALI WEST BUS STATION",
        ],
    },
    {
        name: "GHATKOPAR BUS DEPOT",
        details: [
            "Destination",
            "AGARKAR CHOWK BUS STOP ANDHERI EAST",
            "SAKI NAKA BUS STOP",
        ],
    },
    {
        name: "SAKI NAKA BUS STOP",
        details: [
            "Destination",
            "AGARKAR CHOWK BUS STOP ANDHERI EAST",
            "SANTACRUZ BUS DEPOT",
        ],
    },
    {
        name: "MULUND WEST BUS DEPOT",
        details: [
            "Destination",
            "KANJURMARG WEST BUS STATION",
            "SANTACRUZ BUS DEPOT",
            "BACKBAY BUS DEPOT",
            "SAKI NAKA BUS STOP",
        ],
    },
    {
        name: "VIKHROLI BUS DEPOT",
        details: [
            "Destination",
            "AGARKAR CHOWK BUS STOP ANDHERI EAST",
            "SAKI NAKA BUS STOP",
        ],
    },
    {
        name: "VILE PARLE BUS STAND",
        details: [
            "Destination",
            "AGARKAR CHOWK BUS STOP ANDHERI EAST",
            "SANTACRUZ BUS DEPOT",
            "SAKI NAKA BUS STOP",
            "BORIVALI WEST BUS STATION",
        ],
    },
    {
        name: "CHEMBUR BUS DEPOT",
        details: [
            "Destination",
            "SAKI NAKA BUS STOP",
            "AGARKAR CHOWK BUS STOP ANDHERI EAST",
            "SANTACRUZ BUS DEPOT",
        ],
    },
    {
        name: "KANJURMARG WEST BUS STATION",
        details: [
            "Destination",
            "SANTACRUZ BUS DEPOT",
            "SAKI NAKA BUS STOP",
            "BACKBAY BUS DEPOT",
        ],
    },
    {
        name: "KURLA NEHRU NAGAR BUS DEPOT",
        details: [
            "Destination",
            "SAKI NAKA BUS STOP",
            "AGARKAR CHOWK BUS STOP ANDHERI EAST",
            "SANTACRUZ BUS DEPOT",
        ],
    },
    {
        name: "SANTACRUZ BUS DEPOT",
        details: [
            "Destination",
            "AGARKAR CHOWK BUS STOP ANDHERI EAST",
            "BORIVALI WEST BUS STATION",
            "SAKI NAKA BUS STOP",
        ],
    },
];

const busRoutes = {
    102: [
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
        "AGARKAR CHOWK BUS STOP ANDHERI EAST",
    ],
    103: [
        "AGARKAR CHOWK BUS STOP ANDHERI EAST",
        "RANI LAXMIBAI BUS STATION SION",
        "BANDRA WEST BUS DEPOT",
        "PRABODHANKAR THACKRAY UDAYAN SEWRI",
        "GHATKOPAR BUS DEPOT",
        "VIKHROLI BUS DEPOT",
        "KURLA NEHRU NAGAR BUS DEPOT",
        "CHEMBUR BUS DEPOT",
        "SAKI NAKA BUS STOP",
    ],
    104: [
        "AGARKAR CHOWK BUS STOP ANDHERI EAST",
        "RANI LAXMIBAI BUS STATION SION",
        "BANDRA WEST BUS DEPOT",
        "PRABODHANKAR THACKRAY UDAYAN SEWRI",
        "SANTACRUZ BUS DEPOT",
        "VILE PARLE BUS STAND",
        "OSHIWARA BUS DEPOT",
        "VIRWANI ESTATE GOREGAON EAST BUS STOP",
        "BORIVALI WEST BUS STATION",
    ],
    105: [
        "SAKI NAKA BUS STOP",
        "KURLA NEHRU NAGAR BUS DEPOT",
        "CHEMBUR BUS DEPOT",
        "MULUND WEST BUS DEPOT",
        "KANJURMARG WEST BUS STATION",
        "VILE PARLE BUS STAND",
        "SANTACRUZ BUS DEPOT",
    ],
    106: [
        "BACKBAY BUS DEPOT",
        "CSMT BUS STATION",
        "MARINE LINES BUS STATION",
        "BALLARD PIER BUS STOP",
        "WADALA BUS DEPOT",
        "MAHIM BUS DEPOT",
        "KHODADAD CIRCLE DADAR EAST",
        "MULUND WEST BUS DEPOT",
        "KANJURMARG WEST BUS STATION",
    ],
    601: [
        "KANJURMARG WEST BUS STATION",
        "MULUND WEST BUS DEPOT",
        "WADALA BUS DEPOT",
        "MAHIM BUS DEPOT",
        "KHODADAD CIRCLE DADAR EAST",
        "CSMT BUS STATION",
        "MARINE LINES BUS STATION",
        "BALLARD PIER BUS STOP",
        "BACKBAY BUS DEPOT",
    ],
    501: [
        "SANTACRUZ BUS DEPOT",
        "VILE PARLE BUS STAND",
        "MULUND WEST BUS DEPOT",
        "KANJURMARG WEST BUS STATION",
        "KURLA NEHRU NAGAR BUS DEPOT",
        "CHEMBUR BUS DEPOT",
        "SAKI NAKA BUS STOP",
    ],
    401: [
        "BORIVALI WEST BUS STATION",
        "OSHIWARA BUS DEPOT",
        "VIRWANI ESTATE GOREGAON EAST BUS STOP",
        "SANTACRUZ BUS DEPOT",
        "VILE PARLE BUS STAND",
        "RANI LAXMIBAI BUS STATION SION",
        "BANDRA WEST BUS DEPOT",
        "PRABODHANKAR THACKRAY UDAYAN SEWRI",
        "AGARKAR CHOWK BUS STOP ANDHERI EAST",
    ],
    301: [
        "SAKI NAKA BUS STOP",
        "KURLA NEHRU NAGAR BUS DEPOT",
        "CHEMBUR BUS DEPOT",
        "GHATKOPAR BUS DEPOT",
        "VIKHROLI BUS DEPOT",
        "RANI LAXMIBAI BUS STATION SION",
        "BANDRA WEST BUS DEPOT",
        "PRABODHANKAR THACKRAY UDAYAN SEWRI",
        "AGARKAR CHOWK BUS STOP ANDHERI EAST",
    ],
    201: [
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
        "BACKBAY BUS DEPOT",
    ],
};

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
                    const firstBusRoute = stops1.slice(
                        startIndex1,
                        stops1.indexOf(stop) + 1
                    );
                    const secondBusRoute = stops2.slice(startIndex2, endIndex2 + 1);
                    const totalLength = firstBusRoute.length + secondBusRoute.length;
                    if (
                        !connectingRoute ||
                        totalLength <
                        connectingRoute.firstBus.route.length +
                        connectingRoute.secondBus.route.length
                    ) {
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
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredStations, setFilteredStations] = useState(stations);
    const [expandedStation, setExpandedStation] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedStation, setSelectedStation] = useState(null);
    const [excludedStops, setExcludedStops] = useState([]);

    useEffect(() => {
        setFilteredStations(
            stations.filter((station) =>
                station.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery]);

    const toggleExpand = (station) => {
        setExpandedStation(expandedStation === station.name ? null : station.name);
        setSelectedStation(station.name);
    };

    const handleSelectDestination = (destination) => {
        setModalVisible(false);
        const { directRoute, connectingRoute } = findBestRoute(
            selectedStation,
            destination
        );

        if (!directRoute && !connectingRoute) {
            Alert.alert(
                "No Route Found",
                `No route found from ${selectedStation} to ${destination}.`
            );
            return;
        }

        const userStopLocation = busStops[selectedStation];
        let routeText = "";
        if (directRoute) {
            navigation.navigate("BusDetails", {
                busNumber: directRoute.busNumber,
                startStop: selectedStation,
                endStop: destination,
                userStopLocation: {
                    latitude: userStopLocation[0],
                    longitude: userStopLocation[1],
                }, // Pass coordinates
            });
        } else if (connectingRoute) {
            console.log(connectingRoute.firstBus);
            routeText = `From ${selectedStation} take bus number ${connectingRoute.firstBus.busNumber
                } till ${connectingRoute.firstBus.route[
                connectingRoute.firstBus.route.length - 1
                ]
                }, then from ${connectingRoute.secondBus.route[0]} take bus number ${connectingRoute.secondBus.busNumber
                } till ${destination}`;
            Alert.alert("Best Route", `${routeText}`, [
                {
                    text: "OK",
                    onPress: () =>
                        navigation.navigate("BusDetails", {
                            busNumber: connectingRoute.firstBus.busNumber,
                            startStop: selectedStation,
                            endStop:
                                connectingRoute.firstBus.route[
                                connectingRoute.firstBus.route.length - 1
                                ],
                            userStopLocation: {
                                latitude: userStopLocation[0],
                                longitude: userStopLocation[1],
                            },
                        }),
                },
            ]);
        }
    };

    const handleDirectStop = (stop) => {
        const busNumber = findBusNumber(selectedStation, stop);
        if (busNumber) {
            const userStopLocation = busStops[selectedStation];
            navigation.navigate("BusDetails", {
                busNumber: busNumber,
                startStop: selectedStation,
                endStop: stop,
                userStopLocation: {
                    latitude: userStopLocation[0],
                    longitude: userStopLocation[1],
                }, // Pass coordinates
            });
        } else {
            Alert.alert(
                "No Direct Bus",
                `No direct bus from ${selectedStation} to ${stop}.`
            );
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
                {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹ Mumbai</Text>
        </TouchableOpacity> */}
                <Text style={styles.title}>Bus Stops</Text>
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
                                        onPress={() =>
                                            detail === "Destination"
                                                ? handleOpenModal(item.name, item.details)
                                                : handleDirectStop(detail)
                                        }
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

            {/* Bus Routes Button */}
            <TouchableOpacity
                style={styles.routesButton}
                onPress={() => navigation.navigate('BusRoutes')}
            >
                <Text style={styles.routesButtonText}>Bus Routes</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 60,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: "#4F46E5",
    },
    backButton: {
        color: "#fff",
        fontSize: 16,
    },
    title: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 10,
    },
    searchContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
    },
    stationItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    stationText: {
        fontSize: 16,
    },
    detailsContainer: {
        backgroundColor: "#f0f0f0",
        padding: 10,
        paddingLeft: 20,
    },
    detailText: {
        fontSize: 14,
        color: "#555",
        paddingVertical: 2,
    },
    routesButton: {
        backgroundColor: '#D32F2F',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        margin: 15,
    },
    routesButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default Dashboard;
