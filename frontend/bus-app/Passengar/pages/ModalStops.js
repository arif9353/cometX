import React from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, StyleSheet, Alert } from 'react-native';

const ModalStops = ({ modalVisible, setModalVisible, excludedStops, handleSelectDestination }) => {
    const [destinationQuery, setDestinationQuery] = React.useState('');
    const [filteredBusStops, setFilteredBusStops] = React.useState([]);

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

    React.useEffect(() => {
        setFilteredBusStops(
            allBusStops.filter(stop =>
                stop.toLowerCase().includes(destinationQuery.toLowerCase()) && !excludedStops.includes(stop)
            )
        );
    }, [destinationQuery, excludedStops]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Select Station</Text>
                    <TextInput
                        style={styles.modalInput}
                        placeholder="Search"
                        placeholderTextColor="#aaa"
                        value={destinationQuery}
                        onChangeText={setDestinationQuery}
                    />
                    <FlatList
                        data={filteredBusStops}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleSelectDestination(item)}>
                                <View style={styles.modalItem}>
                                    <Text style={styles.modalItemText}>{item}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    modalItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    modalItemText: {
        fontSize: 16,
    },
});

export default ModalStops;
