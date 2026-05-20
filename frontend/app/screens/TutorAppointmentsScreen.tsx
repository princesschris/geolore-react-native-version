import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import RoleGate from '../components/RoleGate';

// ── Mock data (replace with real API data) ──────────────────────────────────
const MOCK_APPOINTMENTS = [
  {
    id: '1',
    studentName: 'Student Chinazom',
    timeFrom: '10:00am',
    timeTo: '12:00pm',
    payment: '$40',
    date: '20 May 2025',
    language: 'Igbo',
  },
  {
    id: '2',
    studentName: 'Student Chinazom',
    timeFrom: '2:00pm',
    timeTo: '4:00pm',
    payment: '$40',
    date: '21 May 2025',
    language: 'Yoruba',
  },
];

function AppointmentCard({
  item,
  onPress,
  onCancel,
}: {
  item: (typeof MOCK_APPOINTMENTS)[0];
  onPress: () => void;
  onCancel: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Ionicons name="person-outline" size={14} color="#5C4A30" />
        <Text style={styles.cardText}>
          Student: <Text style={styles.cardBold}>{item.studentName}</Text>
        </Text>
      </View>
      <View style={styles.cardRow}>
        <Ionicons name="time-outline" size={14} color="#5C4A30" />
        <Text style={styles.cardText}>
          Time: <Text style={styles.cardBold}>{item.timeFrom} – {item.timeTo}</Text>
        </Text>
      </View>
      <View style={styles.cardRow}>
        <Ionicons name="cash-outline" size={14} color="#5C4A30" />
        <Text style={styles.cardText}>
          Payment: <Text style={styles.cardBold}>{item.payment}</Text>
        </Text>
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.viewBtn} onPress={onPress} activeOpacity={0.8}>
          <Text style={styles.viewBtnText}>View appointment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.8}>
          <Text style={styles.cancelBtnText}>Cancel appointment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TutorAppointmentsScreen({ navigation }: any) {
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);

  const handleCancel = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

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
              <View>
                <Ionicons name="notifications-outline" size={20} color="#5C3A00" />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <BuntingBanner />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Orange title bar */}
          <View style={styles.titleBar}>
            <Text style={styles.titleText}>APPOINTMENTS</Text>
          </View>

          {appointments.length === 0 ? (
            // Redirect to the empty state screen
            navigation.replace('TutorNoAppointment')
          ) : (
            appointments.map((item) => (
              <AppointmentCard
                key={item.id}
                item={item}
                onPress={() =>
                  navigation.navigate('TutorAppointmentDetails', {
                    studentName: item.studentName,
                    timeFrom: item.timeFrom,
                    timeTo: item.timeTo,
                    payment: item.payment,
                    date: item.date,
                    language: item.language,
                  })
                }
                onCancel={() => handleCancel(item.id)}
              />
            ))
          )}
        </ScrollView>

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
  badge: {
    position: 'absolute', top: -4, right: -6,
    backgroundColor: '#F5A623', borderRadius: 8,
    width: 16, height: 16, alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 32 },
  titleBar: {
    backgroundColor: '#F5A623', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginBottom: 20,
  },
  titleText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 1.5 },
  card: {
    backgroundColor: '#FFF3E0', borderRadius: 14,
    padding: 14, marginBottom: 14,
    borderWidth: 1, borderColor: '#F5C070', gap: 8,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardText: { fontSize: 13, color: '#5C4A30' },
  cardBold: { fontWeight: '700', color: '#3B1F00' },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  viewBtn: {
    flex: 1, backgroundColor: '#3B1F00',
    borderRadius: 8, paddingVertical: 10, alignItems: 'center',
  },
  viewBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  cancelBtn: {
    flex: 1, backgroundColor: '#F5A623',
    borderRadius: 8, paddingVertical: 10, alignItems: 'center',
  },
  cancelBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});