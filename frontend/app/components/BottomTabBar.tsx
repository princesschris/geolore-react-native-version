import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRole } from '../context/AuthContext';

// ── Tab definitions ────────────────────────────────────────────────────────
// Base tabs shown to all users.
const BASE_TABS = [
  { key: 'Chat',      icon: 'sparkles-outline', activeIcon: 'sparkles', screen: 'AIChat' },
  { key: 'Learn',     icon: 'book-outline',        activeIcon: 'book',       screen: 'YourCulture' },
  { key: 'Home',      icon: 'home-outline',         activeIcon: 'home',       screen: 'Home' },
  { key: 'Community', icon: 'chatbubble-outline',       activeIcon: 'chatbubble',     screen: 'Community' },
  { key: 'Profile',   icon: 'person-outline',       activeIcon: 'person',     screen: 'Profile' },
];

// Extra tab injected for tutors (replaces nothing — sits between Learn and Home).
const TUTOR_TAB = {
  key: 'Appointments',
  icon: 'calendar-outline',
  activeIcon: 'calendar',
  screen: 'TutorAppointments',
};

// ── Screen → active tab mapping ───────────────────────────────────────────
const SCREEN_TO_TAB: Record<string, string> = {
  // Home
  Home:    'Home',
  Events:  'Home',
  Map:     'Home',

  // Profile / settings
  Profile:         'Profile',
  Settings:        'Profile',
  EditProfile:     'Profile',
  AboutGeoLore:    'Profile',
  LanguageSelect:  'Profile',
  Location:        'Profile',
  ClearCache:      'Profile',

  // Community
  Community:           'Community',
  Chat:                'Community',
  CommunityGroups:     'Community',
  GroupChat:           'Community',
  CommunityAdd:        'Community',
  CommunityAddGroups:  'Community',
  NewGroup:            'Community',
  GroupInfo:           'Community',
  UserInfo:            'Community',

  // AI Chat
  AIChat: 'Chat',

  // Learn — student screens
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

  // Tutor screens → highlight Appointments tab
  TutorAppointments:       'Appointments',
  TutorAppointmentDetails: 'Appointments',
  TutorNoAppointment:      'Appointments',
};

export default function BottomTabBar({ onTabPress }: any) {
  const navigation  = useNavigation<any>();
  const route       = useRoute();
  const { isTutor } = useRole();

  // Build the tab list: tutors get an extra Appointments tab
  const TABS = isTutor
    ? [BASE_TABS[0], BASE_TABS[1], TUTOR_TAB, BASE_TABS[2], BASE_TABS[3], BASE_TABS[4]]
    : BASE_TABS;

  const activeTab = SCREEN_TO_TAB[route.name] ?? 'Home';

  const handlePress = (key: string, screen: string) => {
    onTabPress?.(key);
    navigation.navigate(screen);
  };

  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFDF5',
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 4 },
});