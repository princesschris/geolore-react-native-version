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
import BuntingBanner from '../components/BuntingBanner';

export default function InterviewIncomingScreen({ navigation, route }: any) {
  const interviewerName = route?.params?.interviewerName ?? 'Amanda Chinazom Ikpoyi';

  return (
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
        {/* Interviewer photo placeholder */}
        <View style={styles.photoFrame}>
          <Ionicons name="person" size={64} color="#C4A882" />
        </View>

        <Text style={styles.interviewerName}>{interviewerName}</Text>
        <Text style={styles.subText}>Impressions</Text>

        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>
            It's time for your interview
          </Text>
        </View>

        {/* Call action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.declineBtn]}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('AwaitResponse')}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.acceptBtn]}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('AwaitResponse')}
          >
            <Ionicons name="videocam" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  content: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 28, paddingBottom: 40,
  },
  photoFrame: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#F5E6CC',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#F5A623',
    marginBottom: 16,
  },
  interviewerName: {
    fontSize: 18, fontWeight: '800', color: '#3B1F00',
    marginBottom: 2, textAlign: 'center',
  },
  subText: {
    fontSize: 13, color: '#A08060', marginBottom: 24,
  },
  messageBubble: {
    backgroundColor: '#FFF3E0', borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 22,
    borderWidth: 1, borderColor: '#F5C070',
    marginBottom: 36,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 15, fontWeight: '700', color: '#3B1F00', textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row', gap: 32,
  },
  actionBtn: {
    width: 64, height: 64, borderRadius: 32,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 6, elevation: 4,
  },
  declineBtn: { backgroundColor: '#E74C3C' },
  acceptBtn: { backgroundColor: '#27AE60' },
});