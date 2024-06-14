import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Info from "../bus-app/src/Info";
import SignUp_pass from "./Passengar/pages/SignUp_pass";
import SignIn_pass from "./Passengar/pages/SignIn_pass";
import Auth_driver from "../bus-app/Driver/pages/Auth_driver";
import LocationProvider from "./src/LocationProvider"; // Adjust the path as necessary

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <LocationProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={"Info"}>
          <Stack.Screen
            name="Info"
            component={Info}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp_pass"
            component={SignUp_pass}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignIn_pass"
            component={SignIn_pass}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Auth_driver"
            component={Auth_driver}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </LocationProvider>
  );
};

export default App;
