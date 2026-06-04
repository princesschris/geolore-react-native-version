import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRole } from '../context/AuthContext';

const BASE_TABS = [
  { key: 'Chat',      icon: 'sparkles-outline', activeIcon: 'sparkles', screen: 'AIChat' },
  { key: 'Learn',     icon: 'book-outline',        activeIcon: 'book',       screen: 'YourCulture' },
  { key: 'Home',      icon: 'home-outline',         activeIcon: 'home',       screen: 'Home' },
  { key: 'Community', icon: 'chatbubble-outline',       activeIcon: 'chatbubble',     screen: 'Community' },
  { key: 'Profile',   icon: 'person-outline',       activeIcon: 'person',     screen: 'Profile' },
];

const TUTOR_TAB = {
  key: 'Appointments',
  icon: 'calendar-outline',
  activeIcon: 'calendar',
  screen: 'TutorAppointments',
};

const SCREEN_TO_TAB: Record<string, string> = {
  Home:    'Home',
  Events:  'Home',
  Map:     'Home',
  Profile:         'Profile',
  Settings:        'Profile',
  EditProfile:     'Profile',
  AboutGeoLore:    'Profile',
  LanguageSelect:  'Profile',
  Location:        'Profile',
  ClearCache:      'Profile',
  Community:           'Community',
  Chat:                'Community',
  CommunityGroups:     'Community',
  GroupChat:           'Community',
  CommunityAdd:        'Community',
  CommunityAddGroups:  'Community',
  NewGroup:            'Community',
  GroupInfo:           'Community',
  UserInfo:            'Community',
  AIChat: 'Chat',
  YourCulture:     'Learn',
  History:         'Learn',
  Language:        'Learn',
  Teacher:         'Learn',
  BookAppointment: 'Learn',
  Classes:         'Learn',
  ClassInfo:       'Learn',
  NoClasses:       'Learn',
  Food:            'Learn',
  FoodDetails:     'Learn',
  Traditions:      'Learn',
  TraditionDetails:'Learn',
  Fashion:         'Learn',
  FashionDetail:   'Learn',
  Festivals:       'Learn',
  FestivalDetail:  'Learn',
  Beliefs:         'Learn',
  BeliefDetail:    'Learn',
  Stories:         'Learn',
  StoryDetail:     'Learn',
  IncomingClass:   'Learn',
  ClassSession:    'Learn',
  ClassEnd:        'Learn',
  TutorAppointments:       'Appointments',
  TutorAppointmentDetails: 'Appointments',
  TutorNoAppointment:      'Appointments',
};

export default function BottomTabBar({ onTabPress }: any) {
  const navigation  = useNavigation<any>();
  const route       = useRoute();
  const { isTutor } = useRole();

  const TABS = isTutor
    ? [BASE_TABS[0], BASE_TABS[1], TUTOR_TAB, BASE_TABS[2], BASE_TABS[3], BASE_TABS[4]]
    : BASE_TABS;

  const activeTab = SCREEN_TO_TAB[route.name] ?? 'Home';

  const handlePress = (key: string, screen: string) => {
    onTabPress?.(key);
    navigation.navigate(screen);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {TABS.map(({ key, icon, activeIcon, screen }) => {
          const isActive = activeTab === key;
          return (
            <TouchableOpacity
              key={key}
              style={styles.tab}
              activeOpacity={0.7}
              onPress={() => handlePress(key, screen)}
            >
              <Ionicons
                name={isActive ? activeIcon : icon}
                size={24}
                color={isActive ? '#F5A623' : '#A08060'}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 8,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFDF5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 4 },
});