import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { AuthProvider, useAuth } from './context/AuthContext';

// ── Existing screens ──────────────────────────────────────────────────────────
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
import FoodDetailsScreen from './screens/FoodDetailsScreen';
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
import SettingsScreen from './screens/SettingsScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import AddEventScreen from './screens/AddEventScreen';
import BeliefsScreen from './screens/BeliefsScreen';
import BeliefDetailScreen from './screens/BeliefDetailScreen';
import StoriesScreen from './screens/StoriesScreen';
import StoryDetailScreen from './screens/StoryDetailScreen';
import AboutGeoLoreScreen from './screens/AboutGeoloreScreen';
import TermsAndConditionsScreen from './screens/TermsAndConditionsScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import LanguageSelectScreen from './screens/LanguageSelectScreen';
import LocationScreen from './screens/LocationScreen';
import ClearCacheScreen from './screens/ClearCacheScreen';

// ── Tutor onboarding & management screens ─────────────────────────────────────
import RequirementsScreen from './screens/RequirementsScreen';
import TellUsAboutYourselfScreen from './screens/TellUsAboutYourselfScreen';
import ScheduleInterviewScreen from './screens/ScheduleInterviewScreen';
import InterviewIncomingScreen from './screens/InterviewIncomingScreen';
import AwaitResponseScreen from './screens/AwaitResponseScreen';
import TutorAppointmentsScreen from './screens/TutorAppointmentsScreen';
import TutorAppointmentDetailsScreen from './screens/TutorAppointmentDetailsScreen';
import TutorNoAppointmentScreen from './screens/TutorNoAppointmentScreen';
import { AlertProvider } from './components/CustomAlert';
import ClassDetailScreen from './screens/ClassDetailScreen';
import CultureScreen from './screens/CultureScreen';
import CultureDetailScreen from './screens/CultureDetailScreen';
import CreateClassScreen from './screens/CreateClassScreen';
import AddGroupMembersScreen from './screens/AddGroupMembersScreen';

const Stack = createNativeStackNavigator();

// ── Spinner shown while Firebase restores AsyncStorage session ────────────────
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#F5A623" />
    </View>
  );
}

// ── Auto-redirect logged-in users away from Splash on startup ─────────────────
function AuthGate() {
  const { isLoggedIn, isLoading } = useAuth();
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (isLoading) return;
    if (isLoggedIn) navigation.replace('Home');
  }, [isLoading, isLoggedIn]);

  return null;
}

// ── Navigator ─────────────────────────────────────────────────────────────────
function Navigator() {
  const { isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;

  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>

      {/* Auth & onboarding */}
      <Stack.Screen name="Splash"          component={SplashScreen} />
      <Stack.Screen name="Register"        component={RegisterScreen} />
      <Stack.Screen name="Login"           component={LoginScreen} />
      <Stack.Screen name="GetStarted"      component={GetStartedScreen} />
      <Stack.Screen name="AddGroupMembers"        component={AddGroupMembersScreen} />
      <Stack.Screen name="WhereAreYouFrom" component={WhereAreYouFromScreen} />

      {/* Core app */}
      <Stack.Screen name="Home"             component={HomeScreen} />
      <Stack.Screen name="YourCulture"      component={YourCultureScreen} />
      <Stack.Screen name="History"          component={HistoryScreen} />
      <Stack.Screen name="Language"         component={LanguageScreen} />
      <Stack.Screen name="Teacher"          component={TeacherScreen} />
      <Stack.Screen name="Food"             component={FoodScreen} />
      <Stack.Screen name="FoodDetails"      component={FoodDetailsScreen} />
      <Stack.Screen name="Traditions"       component={TraditionScreen} />
      <Stack.Screen name="TraditionDetails" component={TraditionDetailsScreen} />
      <Stack.Screen name="Fashion"          component={FashionScreen} />
      <Stack.Screen name="FashionDetail"    component={FashionDetailScreen} />
      <Stack.Screen name="Festivals"        component={FestivalsScreen} />
      <Stack.Screen name="FestivalDetail"   component={FestivalDetailScreen} />
      <Stack.Screen name="Beliefs"          component={BeliefsScreen} />
      <Stack.Screen name="BeliefDetail"     component={BeliefDetailScreen} />
      <Stack.Screen name="Stories"          component={StoriesScreen} />
      <Stack.Screen name="StoryDetail"      component={StoryDetailScreen} />

      {/* Student class flow */}
      <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
      <Stack.Screen name="IncomingClass"   component={IncomingClassScreen} />
      <Stack.Screen name="ClassSession"    component={ClassSessionScreen} />
      <Stack.Screen name="ClassEnd"        component={ClassEndScreen} />
      <Stack.Screen name="Classes"         component={ClassesScreen} />
      <Stack.Screen name="ClassInfo"       component={ClassInfoScreen} />
      <Stack.Screen name="NoClasses"       component={NoClassesScreen} />

      {/* Tutor onboarding flow */}
      <Stack.Screen name="Requirements"        component={RequirementsScreen} />
      <Stack.Screen name="TellUsAboutYourself" component={TellUsAboutYourselfScreen} />
      <Stack.Screen name="ScheduleInterview"   component={ScheduleInterviewScreen} />
      <Stack.Screen name="InterviewIncoming"   component={InterviewIncomingScreen} />
      <Stack.Screen name="AwaitResponse"       component={AwaitResponseScreen} />
      <Stack.Screen name ="Culture" component={CultureScreen}/>
      <Stack.Screen name = "CultureDetail" component ={CultureDetailScreen}/>

      {/* Tutor management (RoleGate enforced inside each screen) */}
      <Stack.Screen name="TutorAppointments"       component={TutorAppointmentsScreen} />
      <Stack.Screen name="TutorAppointmentDetails" component={TutorAppointmentDetailsScreen} />
      <Stack.Screen name="TutorNoAppointment"      component={TutorNoAppointmentScreen} />

      {/* AI & social */}
      <Stack.Screen name="AIChat"             component={AIChatBotScreen} />
      <Stack.Screen name="Community"          component={CommunityChatsScreen} />
      <Stack.Screen name="Chat"               component={ChatScreen} />
      <Stack.Screen name="CommunityGroups"    component={CommunityGroupsScreen} />
      <Stack.Screen name="GroupChat"          component={GroupChatScreen} />
      <Stack.Screen name="CommunityAdd"       component={CommunityAddScreen} />
      <Stack.Screen name="CommunityAddGroups" component={CommunityAddGroupsScreen} />
      <Stack.Screen name="NewGroup"           component={NewGroupScreen} />
      <Stack.Screen name="GroupInfo"          component={GroupInfoScreen} />
      <Stack.Screen name="UserInfo"           component={UserInfoScreen} />

      {/* Profile & settings */}
      <Stack.Screen name="Profile"            component={ProfileScreen} />
      <Stack.Screen name="SideBar"            component={SideBarScreen} />
      <Stack.Screen name="EditProfile"        component={EditProfileScreen} />
      <Stack.Screen name="Notifications"      component={NotificationsScreen} />
      <Stack.Screen name="Settings"           component={SettingsScreen} />
      <Stack.Screen name="AboutGeoLore"       component={AboutGeoLoreScreen} />
      <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} />
      <Stack.Screen name="PrivacyPolicy"      component={PrivacyPolicyScreen} />
      <Stack.Screen name="LanguageSelect"     component={LanguageSelectScreen} />
      <Stack.Screen name="Location"           component={LocationScreen} />
      <Stack.Screen name="ClearCache"         component={ClearCacheScreen} />

      {/* Events */}
      <Stack.Screen name="Events"      component={EventsScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      <Stack.Screen name="AddEvent"    component={AddEventScreen} />
      <Stack.Screen name="ClassDetail" component={ClassDetailScreen} />
      <Stack.Screen name="CreateClass" component={CreateClassScreen} />

    </Stack.Navigator>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function AppNavigator() {
  return (
    <AuthProvider>
      <AlertProvider>
      <Navigator />
      </AlertProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, backgroundColor: '#FFFDF5',
    alignItems: 'center', justifyContent: 'center',
  },
});