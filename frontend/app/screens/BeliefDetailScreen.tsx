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
import TopBar from '../components/TopBar';

export default function BeliefDetailScreen({ navigation, route }) {
  const belief = route?.params?.belief ?? {
    title: 'Life after death',
    color: '#F5A623',
    body: 'The Igbo believe in life after death and reincarnation...',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <TopBar showSearch={false} />
      <BuntingBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Card */}
        <View style={[styles.titleCard, { backgroundColor: belief.color ?? '#F5A623' }]}>
          <Text style={styles.titleText}>{belief.title.toUpperCase()}</Text>
        </View>

        {/* Body Text */}
        <View style={styles.bodyCard}>
          {belief.body.split('\n\n').map((paragraph, i) => (
            <Text key={i} style={styles.bodyText}>{paragraph}</Text>
          ))}
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
  titleCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    minHeight: 100,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: 0.5,
  },
  bodyCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0D0B8',
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  bodyText: {
    fontSize: 13,
    color: '#5C4A30',
    lineHeight: 22,
    textAlign: 'justify',
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