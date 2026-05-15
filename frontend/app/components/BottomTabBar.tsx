import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const TABS = [
  { key: 'Chat',      icon: 'chatbubble-outline',   activeIcon: 'chatbubble',   screen: 'AIChat' },
  { key: 'Learn',     icon: 'book-outline', activeIcon: 'book', screen: 'YourCulture' },
  { key: 'Home',      icon: 'home-outline',   activeIcon: 'home',   screen: 'Home' },
  { key: 'Profile',   icon: 'person-outline', activeIcon: 'person', screen: 'Profile' },
  { key: 'Community', icon: 'people-outline', activeIcon: 'people', screen: 'Community' },
];

// Maps every screen name to which tab should be highlighted
const SCREEN_TO_TAB = {
  Home:            'Home',
  Feed:            'Feed',
  Profile:         'Profile',
  Community:       'Community',
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
  TraditionDetailsScreen: 'Learn',
  IncomingClass:   'Learn',
  ClassSession:    'Learn',
  ClassEnd:        'Learn',
  AIChatBotScreen:'Chat',
};

export default function BottomTabBar({ onTabPress }:any) {
  const navigation = useNavigation();
  const route = useRoute();

  // Automatically derive active tab from current screen
  const activeTab = SCREEN_TO_TAB[route.name] ?? 'Home';

  const handlePress = (key, screen) :any=> {
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
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
});