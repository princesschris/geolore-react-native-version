import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const TABS = [
  { key: 'Events',   label: 'Events',   icon: 'calendar-outline',   activeIcon: 'calendar',   screen: 'Events' },
  { key: 'Map',      label: 'Map',       icon: 'map-outline',        activeIcon: 'map',        screen: 'Map' },
  { key: 'Settings', label: 'Settings',  icon: 'settings-outline',   activeIcon: 'settings',   screen: 'Settings' },
];

const SCREEN_TO_TAB = {
  Events:   'Events',
  Map:      'Map',
  Settings: 'Settings',
};

export default function TopTabBar() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const activeTab = SCREEN_TO_TAB[route.name] ?? 'Events';

  return (
    <View style={styles.container}>
      {TABS.map(({ key, label, icon, activeIcon, screen }) => {
        const isActive = activeTab === key;
        return (
          <TouchableOpacity
            key={key}
            style={[styles.tab, isActive && styles.tabActive]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate(screen)}
          >
            <Ionicons
              name={isActive ? activeIcon : icon}
              size={18}
              color={isActive ? '#fff' : '#A08060'}
            />
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    backgroundColor: '#FFFDF5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0D0B8',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#F5C070',
  },
  tabActive: {
    backgroundColor: '#F5A623',
    borderColor: '#F5A623',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A08060',
  },
  tabTextActive: {
    color: '#fff',
  },
});