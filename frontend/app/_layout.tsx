import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './screens/SplashScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LogInScreen';
import GetStartedScreen from './screens/GetStartedScreen';
import WhereAreYouFromScreen from './screens/WhereAreYouFromScreen';
import HomeScreen from './screens/HomeScreen';
import YourCultureScreen from './screens/YourCultureScreen';
import HistoryScreen from './screens/HistoryScreen';
import LanguageScreen from './screens/LanguageScreen';
import TeacherScreen from './screens/TeacherScreen';
import BookAppointmentScreen from './screens/BookAppointmentScreen';
import IncomingClassScreen from './screens/IncomingClassScreen';
import ClassSessionScreen from './screens/ClassSessionScreen';

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
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="Teacher" component={TeacherScreen} />
      <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
      <Stack.Screen name="IncomingClass" component={IncomingClassScreen} />
      <Stack.Screen name="ClassSession" component={ClassSessionScreen} />
    </Stack.Navigator>
  );
}