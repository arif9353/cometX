import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import React from "react";
import logo from "../assets/logo.png";
import { useNavigation } from "@react-navigation/native";

const Info = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        backgroundColor: "#4F46E5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "full",
        height: "100%",
      }}
    >
      <Image style={{ marginBottom: 100 }} source={logo} />
      <Text style={{ fontWeight: "bold", color: "white", marginBottom: 5 }}>
        Welcome to SmartBus!
      </Text>
      <Text
        style={{
          width: "80%",
          textAlign: "center",
          color: "white",
          marginBottom: 40,
        }}
      >
        Discover the smarter way to travel with real-time bus tracking at your
        fingertips.
      </Text>
      <TouchableOpacity
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "black",
          width: "80%",
          paddingVertical: 20,
          borderRadius: 10,
          marginBottom: 5,
        }}
        onPress={() => {
          navigation.navigate("SignUp_pass");
        }}
      >
        <View>
          <Text style={{ fontSize: 25, color: "white" }}>Get Started</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Auth_driver");
        }}
      >
        <Text style={{ color: "white" }}>Click here for Driver Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Info;

const styles = StyleSheet.create({});
