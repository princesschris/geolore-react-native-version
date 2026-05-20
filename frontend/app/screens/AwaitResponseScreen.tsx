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

// Import your GeoLore tree logo – update path as needed
// import Logo from '../assets/images/logo.png';

export default function AwaitResponseScreen({ navigation }: any) {
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
        {/* Logo placeholder */}
        <View style={styles.logoPlaceholder}>
          <Ionicons name="leaf-outline" size={60} color="#F5A623" />
        </View>

        <Text style={styles.title}>Thank you for sharing your interest in our tutor program.</Text>

        <Text style={styles.body}>
          We will get back to you on the day of your interview to begin.
        </Text>

        <Text style={styles.linkHint}>
          You can also check your notifications to stay updated.
        </Text>

        <TouchableOpacity
          style={styles.homeBtn}
          activeOpacity={0.85}
          onPress={() => navigation?.navigate('Home')}
        >
          <Text style={styles.homeBtnText}>Go to Home</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 28, paddingBottom: 40, gap: 16,
  },
  logoPlaceholder: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: '#FFF3E0',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#F5C070',
    marginBottom: 8,
  },
  title: {
    fontSize: 16, fontWeight: '800', color: '#3B1F00',
    textAlign: 'center', lineHeight: 24,
  },
  body: {
    fontSize: 13, color: '#6B4E2A',
    textAlign: 'center', lineHeight: 20,
  },
  linkHint: {
    fontSize: 12, color: '#A08060',
    textAlign: 'center', fontStyle: 'italic',
  },
  homeBtn: {
    marginTop: 12, backgroundColor: '#F5A623',
    borderRadius: 12, paddingVertical: 13, paddingHorizontal: 48,
  },
  homeBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
});