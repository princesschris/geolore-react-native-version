import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TABS = [
  { key: 'Feed',      icon: 'book-outline',    activeIcon: 'book' },
  { key: 'Learn',     icon: 'school-outline',  activeIcon: 'school' },
  { key: 'Home',      icon: 'home-outline',    activeIcon: 'home' },
  { key: 'Profile',   icon: 'person-outline',  activeIcon: 'person' },
  { key: 'Community', icon: 'people-outline',  activeIcon: 'people' },
];

export default function BottomTabBar({ activeTab = 'Home', onTabPress }) {
  return (
    <View style={styles.container}>
      {TABS.map(({ key, icon, activeIcon }) => {
        const isActive = activeTab === key;
        return (
          <TouchableOpacity
            key={key}
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => onTabPress?.(key)}
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
    backgroundColor: '#3B1F00',
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
});