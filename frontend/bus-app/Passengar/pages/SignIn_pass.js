import React, { useState } from "react";
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
import { supabase } from '../../src/supabaseClient';

const SignIn_pass = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else alert('Logged in successfully!');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Log in to your account</Text>
        <Text style={styles.subtitle}>
          Enter your email and password to log in
        </Text>
        <TextInput
          style={styles.input}
          placeholder="email@domain.com"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignUp_pass");
          }}
        >
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text style={styles.footerLink}>Sign Up</Text>
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
    width: 100,
    height: 100,
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

export default SignIn_pass;
