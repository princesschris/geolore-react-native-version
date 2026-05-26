import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import RoleGate from '../components/RoleGate';

export default function TutorNoAppointmentScreen({ navigation }: any) {
  return (
    <RoleGate allowedRoles={['tutor', 'both']}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

        <View style={styles.topBar}>
          <View style={styles.topBarRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="person-outline" size={20} color="#5C3A00" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={20} color="#5C3A00" />
            </TouchableOpacity>
          </View>
        </View>

        <BuntingBanner />

        <View style={styles.content}>
            <Image source={require('../../assets/images/tiger.png')} style={styles.mascot} />

          <Text style={styles.message}>You&apos;re all caught up!</Text>
          <Text style={styles.subMessage}>
            You have no upcoming appointments from students yet.{'\n'}
            Check your notifications to stay updated.
          </Text>
        </View>

        <BottomTabBar />
      </SafeAreaView>
    </RoleGate>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  topBar: {
    flexDirection: 'row', justifyContent: 'flex-end',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
  },
  topBarRight: { flexDirection: 'row', gap: 10 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  content: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 28, paddingBottom: 40, gap: 14,
  },
  mascotBox: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#F5C070', marginBottom: 8,
  },
  mascot: { height:160, width:130 },
  message: {
    fontSize: 18, fontWeight: '800', color: '#3B1F00', textAlign: 'center',
  },
  subMessage: {
    fontSize: 13, color: '#A08060',
    textAlign: 'center', lineHeight: 20,
  },
});