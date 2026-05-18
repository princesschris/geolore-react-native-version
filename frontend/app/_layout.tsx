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
import ClassEndScreen from './screens/ClassEndScreen';
import ClassesScreen from './screens/ClassesScreen';
import ClassInfoScreen from './screens/ClassInfoScreen';
import NoClassesScreen from './screens/NoClassesScreen';
import FoodScreen from './screens/FoodScreen';
import FoodDetailsScreen from './screens/FoodDetailsScreen'
import TraditionScreen from './screens/TraditionsScreen';
import TraditionDetailsScreen from './screens/TraditionDetailsScreen';
import FashionScreen from './screens/FashionScreen';
import FashionDetailScreen from './screens/FashionDetailScreen';
import FestivalsScreen from './screens/FestivalsScreen';
import FestivalDetailScreen from './screens/FestivalDetailsScreen';
import AIChatBotScreen from './screens/AIChatBotScreen';
import ProfileScreen from './screens/ProfileScreen';
import SideBarScreen from './screens/SideBarScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import CommunityChatsScreen from './screens/CommunityChatsScreen';
import ChatScreen from './screens/ChatScreen';
import CommunityGroupsScreen from './screens/CommunityGroupsScreen';
import GroupChatScreen from './screens/GroupChatScreen';
import CommunityAddScreen from './screens/CommunityAddScreen';
import CommunityAddGroupsScreen from './screens/CommunityAddGroupsScreen';
import NewGroupScreen from './screens/NewGroupScreen';
import GroupInfoScreen from './screens/GroupInfoScreen';
import UserInfoScreen from './screens/UserInfoScreen';
import EventsScreen from './screens/EventsScreen';
import MapScreen from './screens/MapScreen';
import SettingsScreen from './screens/SettingsScreen';  
import EventDetailScreen from './screens/EventDetailScreen';
import AddEventScreen from './screens/AddEventScreen';
import BeliefsScreen from './screens/BeliefsScreen';
import BeliefDetailScreen from './screens/BeliefDetailScreen';
import StoriesScreen from './screens/StoriesScreen';
import StoryDetailScreen from './screens/StoryDetailScreen';
import AboutGeoLoreScreen from './screens/AboutGeoloreScreen';
import TermsAndConditionsScreen from './screens/TermsAndConditionsScreen';

const Stack = createNativeStackNavigator();

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
      <Stack.Screen name="ClassEnd" component={ClassEndScreen} />
      <Stack.Screen name="Classes" component={ClassesScreen} />
      <Stack.Screen name="ClassInfo" component={ClassInfoScreen} />
      <Stack.Screen name="NoClasses" component={NoClassesScreen} />
      <Stack.Screen name="Food" component={FoodScreen} />
      <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} />
      <Stack.Screen name="Traditions" component={TraditionScreen} />
      <Stack.Screen name="TraditionDetails" component={TraditionDetailsScreen} />
      <Stack.Screen name="Fashion" component={FashionScreen} />
      <Stack.Screen name="FashionDetail" component={FashionDetailScreen} />
      <Stack.Screen name="Festivals" component={FestivalsScreen} />
      <Stack.Screen name="FestivalDetail" component={FestivalDetailScreen} />
      <Stack.Screen name="AIChat" component={AIChatBotScreen}/>  
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="SideBar" component={SideBarScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Community" component={CommunityChatsScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="CommunityGroups" component={CommunityGroupsScreen} />
      <Stack.Screen name="GroupChat" component={GroupChatScreen} />
      <Stack.Screen name="CommunityAdd" component={CommunityAddScreen} />
      <Stack.Screen name="CommunityAddGroups" component={CommunityAddGroupsScreen} />
      <Stack.Screen name="NewGroup" component={NewGroupScreen} />
      <Stack.Screen name="GroupInfo" component={GroupInfoScreen} />
      <Stack.Screen name="UserInfo" component={UserInfoScreen} />
      <Stack.Screen name="Events" component={EventsScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      <Stack.Screen name="AddEvent" component={AddEventScreen} />
      <Stack.Screen name="Beliefs" component={BeliefsScreen} />
      <Stack.Screen name="BeliefDetail" component={BeliefDetailScreen} />
      <Stack.Screen name="Stories" component={StoriesScreen} />
      <Stack.Screen name="StoryDetail" component={StoryDetailScreen} />
      <Stack.Screen name="AboutGeoLore" component={AboutGeoLoreScreen} />
      <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} />
    </Stack.Navigator>
  );
}