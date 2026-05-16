import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SearchBar from './SearchBar';

type TopBarProps = {
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
  showSearch?: boolean;
  notificationCount?: number;
};

export default function TopBar({
  searchQuery = '',
  onSearchChange,
  showSearch = true,
  notificationCount = 5,
}: TopBarProps) {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {showSearch && (
        <SearchBar
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search"
        />
      )}
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => navigation.navigate('Profile')}
      >
        <Ionicons name="person-outline" size={20} color="#5C3A00" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Notifications')}>
        <View>
          <Ionicons name="notifications-outline" size={20} color="#5C3A00"  />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    gap: 10,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#F5A623',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
});