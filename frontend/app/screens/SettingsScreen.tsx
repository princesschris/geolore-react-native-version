import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import TopBar from '../components/TopBar';
import BuntingBanner from '../components/BuntingBanner';
import TopTabBar from '../components/TopTabBar';

const SettingRow = ({ icon, label, value, onPress, isSwitch, switchValue, onSwitchChange }) => (
  <TouchableOpacity
    style={styles.settingRow}
    onPress={onPress}
    activeOpacity={isSwitch ? 1 : 0.7}
  >
    <View style={styles.settingLeft}>
      <Ionicons name={icon} size={20} color="#F5A623" />
      <Text style={styles.settingLabel}>{label}</Text>
    </View>
    {isSwitch ? (
      <Switch
        value={switchValue}
        onValueChange={onSwitchChange}
        trackColor={{ false: '#E0D0B8', true: '#F5A623' }}
        thumbColor="#fff"
      />
    ) : (
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        <Ionicons name="chevron-forward-outline" size={16} color="#C4A882" />
      </View>
    )}
  </TouchableOpacity>
);

export default function SettingsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [privateAccount, setPrivateAccount] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BuntingBanner />
      <TopTabBar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account */}
        <Text style={styles.sectionHeader}>Account</Text>
        <View style={styles.settingsGroup}>
          <SettingRow
            icon="person-outline"
            label="Edit Profile"
            onPress={() => navigation?.navigate('EditProfile')}
          />
          <SettingRow
            icon="lock-closed-outline"
            label="Change Password"
            onPress={() => {}}
          />
          <SettingRow
            icon="globe-outline"
            label="Language"
            value="English"
            onPress={() => {}}
          />
          <SettingRow
            icon="location-outline"
            label="Location"
            onPress={() => {}}
          />
        </View>

        {/* Notifications */}
        <Text style={styles.sectionHeader}>Notifications</Text>
        <View style={styles.settingsGroup}>
          <SettingRow
            icon="notifications-outline"
            label="Push Notifications"
            isSwitch
            switchValue={notifications}
            onSwitchChange={setNotifications}
          />
          <SettingRow
            icon="mail-outline"
            label="Email Notifications"
            isSwitch
            switchValue={notifications}
            onSwitchChange={setNotifications}
          />
        </View>

        {/* Privacy */}
        <Text style={styles.sectionHeader}>Privacy</Text>
        <View style={styles.settingsGroup}>
          <SettingRow
            icon="eye-off-outline"
            label="Private Account"
            isSwitch
            switchValue={privateAccount}
            onSwitchChange={setPrivateAccount}
          />
          <SettingRow
            icon="moon-outline"
            label="Dark Mode"
            isSwitch
            switchValue={darkMode}
            onSwitchChange={setDarkMode}
          />
        </View>

        {/* Support */}
        <Text style={styles.sectionHeader}>Support</Text>
        <View style={styles.settingsGroup}>
          <SettingRow
            icon="information-circle-outline"
            label="About GeoLore"
            onPress={() => {}}
          />
          <SettingRow
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => {}}
          />
          <SettingRow
            icon="trash-outline"
            label="Clear Cache"
            onPress={() => {}}
          />
        </View>

        {/* Log Out */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.8}
          onPress={() => navigation?.reset({ index: 0, routes: [{ name: 'Splash' }] })}
        >
          <Ionicons name="log-out-outline" size={18} color="#fff" />
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#A08060',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 16,
    paddingLeft: 4,
  },
  settingsGroup: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0D0B8',
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
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
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settingValue: {
    fontSize: 13,
    color: '#A08060',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#E74C3C',
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 24,
  },
  logoutBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});