import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TopBar from '../components/TopBar';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import RoleGate from '../components/RoleGate';

export default function TutorNoAppointmentScreen({ navigation }: any) {
  return (
    <RoleGate allowedRoles={['tutor', 'both']}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
        <TopBar showSearch={false} />

        <BuntingBanner />
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.pageEyebrow}>Your Schedule</Text>
            <Text style={styles.pageTitle}>Appointments</Text>
          </View>
          <View style={styles.pageHeaderBadge}>
            <Ionicons name="calendar" size={26} color="#F5A623" />
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.illustrationCard}>
            <View style={styles.illustrationStripe} />
            <Image
              source={require('../../assets/images/tiger.png')}
              style={styles.mascot}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.message}>You&apos;re all caught up!</Text>
          <Text style={styles.subMessage}>
            No upcoming appointments from students yet.{'\n'}
            Share your profile to start getting bookings.
          </Text>

          <View style={styles.tipCard}>
            <View style={styles.tipIconWrap}>
              <Ionicons name="bulb-outline" size={18} color="#F5A623" />
            </View>
            <Text style={styles.tipText}>
              Create a class to attract more students and grow your schedule.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => navigation?.navigate('CreateClass')}
            activeOpacity={0.85}
          >
            <View style={styles.ctaBtnIcon}>
              <Ionicons name="add" size={18} color="#F5A623" />
            </View>
            <Text style={styles.ctaBtnText}>Create a New Class</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.notifLink}
            onPress={() => navigation?.navigate('Notifications')}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={14} color="#F5A623" />
            <Text style={styles.notifLinkText}>Check your notifications</Text>
          </TouchableOpacity>

        </View>

        <BottomTabBar />
      </SafeAreaView>
    </RoleGate>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },

  pageHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
  },
  pageEyebrow: { fontSize: 11, fontWeight: '700', color: '#F5A623', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 2 },
  pageTitle:   { fontSize: 28, fontWeight: '900', color: '#3B1F00', letterSpacing: 0.3 },
  pageHeaderBadge: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#F5C070',
  },

  content: {
    flex: 1, alignItems: 'center',
    paddingHorizontal: 24, paddingBottom: 24, gap: 16,
  },

  illustrationCard: {
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: '#FFF3E0',
    borderWidth: 2.5, borderColor: '#F5C070',
    alignItems: 'center', justifyContent: 'flex-end',
    overflow: 'hidden', marginBottom: 4,
  },
  illustrationStripe: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 40, backgroundColor: '#F5A62322',
  },
  mascot: { width: 140, height: 155 },

  message: {
    fontSize: 20, fontWeight: '900', color: '#3B1F00',
    textAlign: 'center', letterSpacing: 0.2,
  },
  subMessage: {
    fontSize: 13, color: '#A08060',
    textAlign: 'center', lineHeight: 20,
  },
  tipCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFF8EE', borderRadius: 14,
    borderWidth: 1, borderColor: '#F5C070',
    paddingVertical: 12, paddingHorizontal: 14,
    alignSelf: 'stretch',
  },
  tipIconWrap: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#F5C070', flexShrink: 0,
  },
  tipText: { flex: 1, fontSize: 12, color: '#7D5A1E', lineHeight: 18, fontWeight: '500' },

  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#3B1F00', borderRadius: 16,
    paddingVertical: 15, paddingHorizontal: 18,
    alignSelf: 'stretch',
  },
  ctaBtnIcon: {
    width: 30, height: 30, borderRadius: 9,
    backgroundColor: 'rgba(245,166,35,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  ctaBtnText: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '800' },

  notifLink: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  notifLinkText: { fontSize: 13, color: '#F5A623', fontWeight: '600' },
});