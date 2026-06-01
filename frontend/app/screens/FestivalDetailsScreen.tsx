import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import TopBar from '../components/TopBar';

export default function FestivalDetailScreen({ navigation, route }: any) {
  const festival = route?.params?.festival;

  // Guard — if no festival was passed navigate back
  if (!festival) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <TopBar showSearch={false} />
        <View style={styles.centeredState}>
          <Ionicons name="alert-circle-outline" size={48} color="#C4A882" />
          <Text style={styles.stateText}>No festival content found</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => navigation?.goBack()}>
            <Text style={styles.retryBtnText}>Go back</Text>
          </TouchableOpacity>
        </View>
        <BottomTabBar />
      </SafeAreaView>
    );
  }

  // `content` comes from Supabase — split by double newline into paragraphs
  const paragraphs: string[] = (festival.content ?? festival.body ?? '')
    .split('\n\n')
    .map((p: string) => p.trim())
    .filter(Boolean);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <TopBar showSearch={false} />
      <BuntingBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>{festival.title.toUpperCase()}</Text>

        {/* Large Image Card */}
        <View style={styles.imageCard}>
          {festival.imageSource ? (
            <ImageBackground
              source={festival.imageSource}
              style={styles.image}
              imageStyle={styles.imageRadius}
            >
              <View style={styles.overlay} />
            </ImageBackground>
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Ionicons name="image-outline" size={56} color="rgba(255,255,255,0.4)" />
            </View>
          )}
        </View>

        {/* Body Text — rendered from Supabase content field */}
        <View style={styles.bodyCard}>
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, i) => (
              <Text key={i} style={styles.bodyText}>{paragraph}</Text>
            ))
          ) : (
            <Text style={styles.stateText}>No content available</Text>
          )}
        </View>

        {/* Back Button */}
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
    paddingTop: 4,
    paddingBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3B1F00',
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  imageCard: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0D0B8',
  },
  image: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageRadius: { borderRadius: 16 },
  imagePlaceholder: { backgroundColor: '#C4A882' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  bodyCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0D0B8',
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  bodyText: {
    fontSize: 13,
    color: '#5C4A30',
    lineHeight: 22,
    textAlign: 'justify',
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 48,
  },
  stateText: { fontSize: 14, color: '#A08060', fontWeight: '500' },
  retryBtn: {
    backgroundColor: '#F5A623',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  retryBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
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