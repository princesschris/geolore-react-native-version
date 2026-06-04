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

export default function TermsAndConditionsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <BuntingBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>TERMS AND{'\n'}CONDITIONS</Text>

          <Text style={styles.cardBody}>
            Our terms and conditions. Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Illo dolorem quos ipsa. Consequatur odio ullam maxime aliquam atque, quaerat,
            ducimus, expedita dolores a neque necessitabus reprehenderit! Officia, repellat
            nihil cum corporis delectus minus nostrum dolorum optio sunt odit quas a modi
            velit ex blanditiis libero atque, cumque ? Nihil eius eaque asperiores ipsam
            aperiam nam sequi nihil perferendis laborum quod distinctio. Odio quod, deserunt
            aliquid totam nulla molestias repudiandae eaque voluptas?
          </Text>

          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.cardBody}>
            By accessing and using GeoLore, you accept and agree to be bound by the terms
            and provision of this agreement. If you do not agree to abide by the above,
            please do not use this service.
          </Text>

          <Text style={styles.sectionTitle}>2. Use of Service</Text>
          <Text style={styles.cardBody}>
            GeoLore is a cultural learning platform. You agree to use the service only for
            lawful purposes and in a way that does not infringe on the rights of others or
            restrict their use of the service.
          </Text>

          <Text style={styles.sectionTitle}>3. User Content</Text>
          <Text style={styles.cardBody}>
            Users may post content including messages, images and other material. You are
            solely responsible for the content you post. GeoLore reserves the right to
            remove any content deemed inappropriate.
          </Text>

          <Text style={styles.sectionTitle}>4. Privacy</Text>
          <Text style={styles.cardBody}>
            Your use of GeoLore is also governed by our Privacy Policy, which is
            incorporated into these terms by reference.
          </Text>

          <Text style={styles.sectionTitle}>5. Changes to Terms</Text>
          <Text style={styles.cardBody}>
            GeoLore reserves the right to modify these terms at any time. We will notify
            users of significant changes. Continued use of the service after changes
            constitutes acceptance of the new terms.
          </Text>
        </View>
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