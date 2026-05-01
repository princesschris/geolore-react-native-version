import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './screens/SplashScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LogInScreen';
import GetStartedScreen from './screens/GetStartedScreen';
import WhereAreYouFromScreen from './screens/WhereAreYouFromScreen';
import HomeScreen from './screens/HomeScreen';
import YourCultureScreen from './screens/YourCultureScreen';

const Stack = createNativeStackNavigator();

// Paste this Stack.Navigator inside your existing NavigationContainer in your root App.js
export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="GetStarted" component={GetStartedScreen} />
      <Stack.Screen name="WhereAreYouFrom" component={WhereAreYouFromScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="YourCulture" component={YourCultureScreen} />
    </Stack.Navigator>
  );
}