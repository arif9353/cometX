import React, { useState, useEffect } from "react";
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
  Alert,
} from "react-native";
import logo from "../../assets/logo.png";
import { useNavigation } from "@react-navigation/native";
import { supabase } from '../../src/supabaseClient';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const bus_number_based_stops = {
  "102": ["BACKBAY BUS DEPOT", "CSMT BUS STATION", "MARINE LINES BUS STATION", "BALLARD PIER BUS STOP", "PRIYADARSHANI PARK BUS STOP", "WADALA BUS DEPOT", "MAHIM BUS DEPOT", "KHODADAD CIRCLE DADAR EAST", "RANI LAXMIBAI BUS STATION SION", "BANDRA WEST BUS DEPOT", "PRABODHANKAR THACKRAY UDAYAN SEWRI", "AGARKAR CHOWK BUS STOP ANDHERI EAST"],
  "103": ["AGARKAR CHOWK BUS STOP ANDHERI EAST", "RANI LAXMIBAI BUS STATION SION", "BANDRA WEST BUS DEPOT", "PRABODHANKAR THACKRAY UDAYAN SEWRI", "GHATKOPAR BUS DEPOT", "VIKHROLI BUS DEPOT", "KURLA NEHRU NAGAR BUS DEPOT", "CHEMBUR BUS DEPOT", "SAKI NAKA BUS STOP"],
  "104": ["AGARKAR CHOWK BUS STOP ANDHERI EAST", "RANI LAXMIBAI BUS STATION SION", "BANDRA WEST BUS DEPOT", "PRABODHANKAR THACKRAY UDAYAN SEWRI", "SANTACRUZ BUS DEPOT", "VILE PARLE BUS STAND", "OSHIWARA BUS DEPOT", "VIRWANI ESTATE GOREGAON EAST BUS STOP", "BORIVALI WEST BUS STATION"],
  "105": ["SAKI NAKA BUS STOP", "KURLA NEHRU NAGAR BUS DEPOT", "CHEMBUR BUS DEPOT", "MULUND WEST BUS DEPOT", "KANJURMARG WEST BUS STATION", "VILE PARLE BUS STAND", "SANTACRUZ BUS DEPOT"],
  "106": ["BACKBAY BUS DEPOT", "CSMT BUS STATION", "MARINE LINES BUS STATION", "BALLARD PIER BUS STOP", "WADALA BUS DEPOT", "MAHIM BUS DEPOT", "KHODADAD CIRCLE DADAR EAST", "MULUND WEST BUS DEPOT", "KANJURMARG WEST BUS STATION"],
  "601": ["KANJURMARG WEST BUS STATION", "MULUND WEST BUS DEPOT", "WADALA BUS DEPOT", "MAHIM BUS DEPOT", "KHODADAD CIRCLE DADAR EAST", "CSMT BUS STATION", "MARINE LINES BUS STATION", "BALLARD PIER BUS STOP", "BACKBAY BUS DEPOT"],
  "501": ["SANTACRUZ BUS DEPOT", "VILE PARLE BUS STAND", "MULUND WEST BUS DEPOT", "KANJURMARG WEST BUS STATION", "KURLA NEHRU NAGAR BUS DEPOT", "CHEMBUR BUS DEPOT", "SAKI NAKA BUS STOP"],
  "401": ["BORIVALI WEST BUS STATION", "OSHIWARA BUS DEPOT", "VIRWANI ESTATE GOREGAON EAST BUS STOP", "SANTACRUZ BUS DEPOT", "VILE PARLE BUS STAND", "RANI LAXMIBAI BUS STATION SION", "BANDRA WEST BUS DEPOT", "PRABODHANKAR THACKRAY UDAYAN SEWRI", "AGARKAR CHOWK BUS STOP ANDHERI EAST"],
  "301": ["SAKI NAKA BUS STOP", "KURLA NEHRU NAGAR BUS DEPOT", "CHEMBUR BUS DEPOT", "GHATKOPAR BUS DEPOT", "VIKHROLI BUS DEPOT", "RANI LAXMIBAI BUS STATION SION", "BANDRA WEST BUS DEPOT", "PRABODHANKAR THACKRAY UDAYAN SEWRI", "AGARKAR CHOWK BUS STOP ANDHERI EAST"],
  "201": ["AGARKAR CHOWK BUS STOP ANDHERI EAST", "RANI LAXMIBAI BUS STATION SION", "BANDRA WEST BUS DEPOT", "PRABODHANKAR THACKRAY UDAYAN SEWRI", "WADALA BUS DEPOT", "MAHIM BUS DEPOT", "KHODADAD CIRCLE DADAR EAST", "PRIYADARSHANI PARK BUS STOP", "CSMT BUS STATION", "MARINE LINES BUS STATION", "BALLARD PIER BUS STOP", "BACKBAY BUS DEPOT"]
};

const SignUp_pass = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [username, setUsername] = useState('');
  const [startStop, setStartStop] = useState(null);
  const [endStop, setEndStop] = useState(null);
  const [busStops, setBusStops] = useState([]);
  const [openStartStop, setOpenStartStop] = useState(false);
  const [openEndStop, setOpenEndStop] = useState(false);

  useEffect(() => {
    // Generate unique bus stops list
    const allStops = new Set();
    Object.values(bus_number_based_stops).flat().forEach(stop => allStops.add(stop));
    setBusStops(Array.from(allStops).map(stop => ({ label: stop, value: stop })));
  }, []);

  const findBusNumber = (start, end) => {
    let bestBusNumber = null;
    let leastStops = Infinity;

    for (const [busNumber, stops] of Object.entries(bus_number_based_stops)) {
      const startIndex = stops.indexOf(start);
      const endIndex = stops.indexOf(end);

      if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
        const stopsCount = endIndex - startIndex;
        if (stopsCount < leastStops) {
          leastStops = stopsCount;
          bestBusNumber = busNumber;
        }
      }
    }

    return bestBusNumber;
  };

  const handleSignUp = async () => {
    // Check if email, username, and contact are unique
    const { data: emailData, error: emailError } = await supabase
      .from('passenger')
      .select('email')
      .eq('email', email);

    const { data: usernameData, error: usernameError } = await supabase
      .from('passenger')
      .select('username')
      .eq('username', username);

    const { data: contactData, error: contactError } = await supabase
      .from('passenger')
      .select('contact')
      .eq('contact', contact);

    if (emailError || usernameError || contactError) {
      Alert.alert("Error", "An error occurred while checking the uniqueness of the email, username, or contact.");
      return;
    }

    if (emailData.length > 0) {
      Alert.alert("Error", "This email is already in use.");
      return;
    }

    if (usernameData.length > 0) {
      Alert.alert("Error", "This username is already in use.");
      return;
    }

    if (contactData.length > 0) {
      Alert.alert("Error", "This contact number is already in use.");
      return;
    }

    const busNumber = findBusNumber(startStop, endStop);
    if (!busNumber) {
      Alert.alert("Warning", "No direct buses found for selected start and end stops. No worries, you can Edit the bus numbers from your profile afterwards!");
    }

    // Authenticate the user
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) {
      Alert.alert("Error", authError.message);
    } else {
      console.log("This is auth data: ", authData)
      const userId = authData.user?.id;
      if (!userId) {
        Alert.alert("Error", "Failed to retrieve user ID after authentication.");
        return;
      }

      try {
        const latitude = await AsyncStorage.getItem('latitude');
        const longitude = await AsyncStorage.getItem('longitude');
        if (latitude !== null && longitude !== null) {
          const { data, error: insertError } = await supabase
            .from('passenger')
            .insert([{
              email,
              username,
              contact,
              start_stop: startStop,
              end_stop: endStop,
              bus_fk: busNumber,
              latitude: latitude,
              longitude: longitude,
              auth_pass: userId // Use auth_pass column to store the UUID from the authentication
            }]);
          if (insertError) {
            Alert.alert("Error", insertError.message);
          } else {
            // Store the user ID in AsyncStorage
            await AsyncStorage.setItem('user_id', userId);
            navigation.navigate("SignIn_pass")
            Alert.alert('Success', 'Signed up successfully! Please verify your email.');
          }
        }
      } catch (error) {
        console.error('Error retrieving location data', error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Create a Passenger account</Text>
        <Text style={styles.subtitle}>
          Enter your details to sign up for this app
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
          placeholder="create password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="contact number"
          placeholderTextColor="#aaa"
          keyboardType="phone-pad"
          value={contact}
          onChangeText={setContact}
        />
        <TextInput
          style={styles.input}
          placeholder="username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />
        <DropDownPicker
          open={openStartStop}
          value={startStop}
          items={busStops}
          setOpen={setOpenStartStop}
          setValue={setStartStop}
          placeholder="Select Start Stop"
          containerStyle={styles.dropdown}
          zIndex={5000}
          zIndexInverse={1000}
        />
        <DropDownPicker
          open={openEndStop}
          value={endStop}
          items={busStops}
          setOpen={setOpenEndStop}
          setValue={setEndStop}
          placeholder="Select End Stop"
          containerStyle={styles.dropdown}
          zIndex={4000}
          zIndexInverse={900}
        />
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign up with email</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignIn_pass");
          }}
        >
          <Text style={styles.footerText}>
            Already have an account?{" "}
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
  dropdown: {
    width: "100%",
    marginBottom: 15,
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
