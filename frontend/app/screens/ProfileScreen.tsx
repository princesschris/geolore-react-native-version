import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import TopBar from '../components/TopBar';
import { useRole, useAuth } from '../context/AuthContext';
import { useAlert } from '../components/CustomAlert';

const STATIC_SETTINGS = [
  { key: 'location', label: 'Location',      icon: 'location-outline',           screen: 'Location' },
  { key: 'language', label: 'Language',      icon: 'globe-outline',              screen: 'LanguageSelect' },
  { key: 'cache',    label: 'Clear cache',   icon: 'refresh-outline',            screen: 'ClearCache' },
  { key: 'about',    label: 'About GeoLore', icon: 'information-circle-outline', screen: 'AboutGeoLore' },
];

const SettingRow = ({ icon, label, onPress, iconColor = '#5C3A00', labelColor = '#3B1F00' }: any) => (
  <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.settingLeft}>
      <Ionicons name={icon} size={20} color={iconColor} />
      <Text style={[styles.settingLabel, { color: labelColor }]}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward-outline" size={18} color="#C4A882" />
  </TouchableOpacity>
);

export default function ProfileScreen({ navigation }: any) {
  const { isTutor }                = useRole();
  const { logout, user: authUser } = useAuth();
  const { showConfirm }            = useAlert();

  const user = {
    name:  authUser ? `${authUser.first_name} ${authUser.last_name}` : 'Guest',
    email: authUser?.email ?? '',
  };

  const handleLogout = () => {
    showConfirm(
      'Log out',
      'Are you sure you want to log out of GeoLore?',
      async () => {
        await logout();
        navigation?.replace('Splash');
      },
      () => {},
      'Yes, log out',
      'Cancel',
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
      <TopBar showSearch={false} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={52} color="#C4A882" />
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>

          {/* Role badge */}
          <View style={[styles.roleBadge, isTutor ? styles.roleBadgeTutor : styles.roleBadgeStudent]}>
            <Ionicons name={isTutor ? 'school-outline' : 'book-outline'} size={13} color={isTutor ? '#3B1F00' : '#F5A623'} />
            <Text style={[styles.roleBadgeText, isTutor ? styles.roleBadgeTextTutor : styles.roleBadgeTextStudent]}>
              {isTutor ? 'Tutor' : 'Student'}
            </Text>
          </View>

          <TouchableOpacity style={styles.editBtn} activeOpacity={0.8} onPress={() => navigation?.navigate('EditProfile')}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <View style={styles.settingsList}>
          {STATIC_SETTINGS.map((s) => (
            <SettingRow key={s.key} icon={s.icon} label={s.label} onPress={() => navigation?.navigate(s.screen)} />
          ))}

          <SettingRow
            icon="school-outline"
            label={isTutor ? 'My Appointments' : 'Language Tutor'}
            onPress={() => navigation?.navigate(isTutor ? 'TutorAppointments' : 'Language')}
          />

          {!isTutor && (
            <SettingRow
              icon="ribbon-outline"
              label="Become a Language Tutor"
              onPress={() => navigation?.navigate('Requirements')}
            />
          )}

          <View style={styles.divider} />

          {/* Log Out */}
          <TouchableOpacity style={styles.settingRow} onPress={handleLogout} activeOpacity={0.7}>
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
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 },
  avatarSection: { alignItems: 'center', paddingVertical: 24 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F5E6CC', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 2, borderColor: '#F5C070' },
  name:  { fontSize: 20, fontWeight: '800', color: '#3B1F00', marginBottom: 4 },
  email: { fontSize: 13, color: '#A08060', marginBottom: 10 },
  roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, marginBottom: 14 },
  roleBadgeTutor:        { backgroundColor: '#F5A623' },
  roleBadgeStudent:      { backgroundColor: '#FFF3E0', borderWidth: 1, borderColor: '#F5A623' },
  roleBadgeText:         { fontSize: 12, fontWeight: '700' },
  roleBadgeTextTutor:    { color: '#3B1F00' },
  roleBadgeTextStudent:  { color: '#F5A623' },
  editBtn: { backgroundColor: '#F5A623', paddingVertical: 9, paddingHorizontal: 32, borderRadius: 20 },
  editBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  settingsList: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E0D0B8', paddingHorizontal: 16 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0E6D6' },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingLabel: { fontSize: 14, fontWeight: '600', color: '#3B1F00' },
  divider:    { height: 1, backgroundColor: '#E0D0B8', marginVertical: 4 },
  logoutText: { color: '#E74C3C' },
});