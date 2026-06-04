import React from 'react';
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

export default function PrivacyPolicyScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <BuntingBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>PRIVACY POLICY</Text>

          <Text style={styles.cardBody}>
            Our Privacy policy. Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Illo dolorem quos ipsa. Consequatur odio ullam maxime aliquam atque, quaerat,
            ducimus, expedita dolores a neque necessitabus reprehenderit! Officia, repellat
            nihil cum corporis delectus minus nostrum dolorum optio sunt odit quas a modi
            velit ex blanditiis libero atque, cumque ? Nihil eius eaque asperiores ipsam
            aperiam nam sequi nihil perferendis laborum quod distinctio. Odio quod, deserunt
            aliquid totam nulla molestias repudiandae eaque voluptas?
          </Text>

          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.cardBody}>
            We collect information you provide directly to us when you create an account,
            including your name, email address, location, tribe, and cultural background.
            We also collect usage data to improve the app experience.
          </Text>

          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.cardBody}>
            We use the information we collect to provide, maintain, and improve our services,
            personalize your cultural learning experience, send notifications about lessons
            and events, and connect you with your community.
          </Text>

          <Text style={styles.sectionTitle}>3. Information Sharing</Text>
          <Text style={styles.cardBody}>
            We do not sell or share your personal information with third parties except as
            described in this policy. We may share information with service providers who
            assist us in operating the platform.
          </Text>

          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.cardBody}>
            We take reasonable measures to protect your personal information from
            unauthorized access, theft, and loss. However, no internet transmission is
            completely secure.
          </Text>

          <Text style={styles.sectionTitle}>5. Your Rights</Text>
          <Text style={styles.cardBody}>
            You have the right to access, correct, or delete your personal information at
            any time. You can do this through the Edit Profile section of the app or by
            contacting us at GeoLore@gmail.com.
          </Text>

          <Text style={styles.sectionTitle}>6. Changes to This Policy</Text>
          <Text style={styles.cardBody}>
            We may update this Privacy Policy from time to time. We will notify you of any
            significant changes by sending a notification through the app.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation?.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={16} color="#fff" />
          <Text style={styles.backButtonText}>Back</Text>
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
    paddingTop: 8,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#F5A623',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    gap: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
    marginTop: 8,
  },
  cardBody: {
    fontSize: 13,
    color: '#fff',
    lineHeight: 21,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F5A623',
    paddingVertical: 12,
    borderRadius: 10,
    paddingHorizontal: 32,
    alignSelf: 'center',
  },
  backButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});