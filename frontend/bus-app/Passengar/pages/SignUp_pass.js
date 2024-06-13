import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import logo from "../../assets/logo.png";
import { useNavigation } from "@react-navigation/native";

const SignUp_pass = () => {
  const navigation = useNavigation();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Create a Passenger account</Text>
        <Text style={styles.subtitle}>
          Enter your email and password to sign up for this app
        </Text>
        <TextInput
          style={styles.input}
          placeholder="email@domain.com"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="create password"
          placeholderTextColor="#aaa"
          secureTextEntry
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign up with email</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignIn_pass");
          }}
        >
          <Text style={styles.footerText}>
            Already have account?{" "}
            <Text style={styles.footerLink}>Click Here</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4F46E5", // Blue background
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 109,
    height: 109,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#000",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    color: "#fff",
    fontSize: 14,
  },
  footerLink: {
    color: "#fff",
    textDecorationLine: "underline",
  },
});

export default SignUp_pass;
