import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";

import SignOutIcon from "../../assets/signout_icon.png";


const clearAsyncStorage = async () => {
    try {
        await AsyncStorage.clear();
        console.log('AsyncStorage cleared successfully');
    } catch (error) {
        console.error('Failed to clear AsyncStorage', error);
    }
};

const SignOut = () => {
    const navigation = useNavigation();

    const handleSignout = async () => {
        clearAsyncStorage();
        navigation.navigate("SignIn_pass");
    };

    return (
        <View>
            <TouchableOpacity style={styles.SignOut} onPress={handleSignout}>
                {/* <Text style={styles.Text}>{jsonData.SignOut.Signout}</Text> */}
                <Image source={SignOutIcon} style={styles.icon} />
            </TouchableOpacity>
        </View>
    );
};

export default SignOut;

const styles = StyleSheet.create({
    SignOut: {
        backgroundColor: "#F7F0F0",
        paddingVertical: 10,
        paddingLeft: 6,
        paddingRight: 10,
        borderRadius: 6,
        // borderRadius: 5,
    },
    Text: {
        color: "white",
    },
    icon: {
        height: 24,
        width: 25.73
    }
});
