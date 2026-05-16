import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import TopBar from '../components/TopBar';

const SETTINGS = [
  { key: 'location',  label: 'Location',       icon: 'location-outline' },
  { key: 'language',  label: 'Language',        icon: 'globe-outline' },
  { key: 'cache',     label: 'Clear cache',     icon: 'refresh-outline' },
  { key: 'about',     label: 'About GeoLore',   icon: 'information-circle-outline' },
  { key: 'tutor',     label: 'Language Tutor',  icon: 'school-outline' },
];

const SettingRow = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.settingLeft}>
      <Ionicons name={icon} size={20} color="#5C3A00" />
      <Text style={styles.settingLabel}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward-outline" size={18} color="#C4A882" />
  </TouchableOpacity>
);

export default function ProfileScreen({ navigation }) {
  // Replace with real user data from your auth context/state
  const user = {
    name: 'Queen Barbs',
    email: 'chrisstam@gmail.com',
    // avatar: require('../../assets/images/avatar.png'),
  };

  const handleLogout = () => {
    navigation?.reset({
      index: 0,
      routes: [{ name: 'Splash' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <TopBar showSearch={false} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          {user.avatar ? (
            <Image source={user.avatar} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={52} color="#C4A882" />
            </View>
          )}

          {/* Name & Email */}
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>

          {/* Edit Profile Button */}
          <TouchableOpacity
            style={styles.editBtn}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('EditProfile')}
          >
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Settings List */}
        <View style={styles.settingsList}>
          {SETTINGS.map((s) => (
            <SettingRow
              key={s.key}
              icon={s.icon}
              label={s.label}
              onPress={() => {}}
            />
          ))}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Log Out */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="log-out-outline" size={20} color="#E74C3C" />
              <Text style={[styles.settingLabel, styles.logoutText]}>Log out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },

  // Avatar section
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'cover',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5E6CC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#F5C070',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3B1F00',
    marginBottom: 4,
  },
  email: {
    fontSize: 13,
    color: '#A08060',
    marginBottom: 16,
  },
  editBtn: {
    backgroundColor: '#F5A623',
    paddingVertical: 9,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  editBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  // Settings list
  settingsList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0D0B8',
    paddingHorizontal: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E6D6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B1F00',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0D0B8',
    marginVertical: 4,
  },
  logoutText: {
    color: '#E74C3C',
  },
});