import React, { useState } from 'react';
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

type FashionOutfit = {
  title:                 string;
  subtitle?:             string;
  imageSource?:          any;
  fashion_description?:  string;
  fashion_materials?:    string;
  fashion_worn_by?:      string;
  fashion_occasions?:    string;
  fashion_significance?: string;
  fashion_modern_usage?: string;
};

// Renders a section heading + body lines, matching the screenshot style exactly
const Section = ({ heading, body }: { heading: string; body?: string }) => {
  if (!body?.trim()) return null;

  const lines = body
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <View style={styles.section}>
      {/* Orange uppercase heading + divider — matches other detail screens */}
      <Text style={styles.sectionHeading}>{heading.toUpperCase()}</Text>
      <View style={styles.sectionDivider} />

      {lines.map((line, i) => {
        const isBullet = /^[-*•]/.test(line);
        const text = isBullet ? line.replace(/^[-*•]\s*/, '') : line;
        return (
          <Text key={i} style={styles.sectionBody}>
            {isBullet ? `  \u2022  ${text}` : text}
          </Text>
        );
      })}
    </View>
  );
};

export default function FashionDetailScreen({ navigation, route }: any) {
  const [searchQuery, setSearchQuery] = useState('');

  const outfit: FashionOutfit = route?.params?.outfit ?? {
    title:               'Fashion',
    fashion_description: 'No description available.',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BuntingBanner />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Title banner — matches CultureDetail/BeliefDetail */}
        <View style={styles.titleBanner}>
          <Text style={styles.titleText}>{outfit.title.toUpperCase()}</Text>
        </View>

        {/* Subtitle badge */}
        {outfit.subtitle ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{outfit.subtitle}</Text>
          </View>
        ) : null}

        {/* Image */}
        <View style={styles.imageCard}>
          {outfit.imageSource ? (
            <ImageBackground
              source={outfit.imageSource}
              style={styles.image}
              imageStyle={styles.imageRadius}
            >
              <View style={styles.overlay} />
            </ImageBackground>
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Ionicons name="shirt-outline" size={48} color="rgba(255,255,255,0.5)" />
            </View>
          )}
        </View>

        {/* Structured sections */}
        <View style={styles.card}>
          <Section heading="Description"           body={outfit.fashion_description}  />
          <Section heading="Materials"             body={outfit.fashion_materials}    />
          <Section heading="Who Wears It"          body={outfit.fashion_worn_by}      />
          <Section heading="Occasions"             body={outfit.fashion_occasions}    />
          <Section heading="Cultural Significance" body={outfit.fashion_significance} />
          <Section heading="Modern Usage"          body={outfit.fashion_modern_usage} />
        </View>

        <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={() => navigation?.goBack()}>
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
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32 },

  titleBanner: {
    backgroundColor: '#C4A882', borderRadius: 12,
    paddingVertical: 18, paddingHorizontal: 20,
    alignItems: 'center', marginBottom: 12,
  },
  titleText: { fontSize: 18, fontWeight: '800', color: '#fff', textAlign: 'center', letterSpacing: 1 },

  badge: {
    alignSelf: 'center', backgroundColor: '#FFF3E0', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 4, borderWidth: 1,
    borderColor: '#F5C070', marginBottom: 14,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#5C3A00' },

  imageCard: {
    width: '100%', height: 220, borderRadius: 14, overflow: 'hidden',
    marginBottom: 16, borderWidth: 1, borderColor: '#E0D0B8',
  },
  image: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  imageRadius: { borderRadius: 14 },
  imagePlaceholder: { backgroundColor: '#C4A882' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },

  card: {
    backgroundColor: '#fff', borderRadius: 14, borderWidth: 1,
    borderColor: '#E8D8C0', padding: 20, marginBottom: 20,
  },

  section: { marginBottom: 20 },
  sectionHeading: {
    fontSize: 13, fontWeight: '800', color: '#F5A623',
    letterSpacing: 0.8, marginBottom: 6,
  },
  sectionDivider: { height: 1, backgroundColor: '#E8D8C0', marginBottom: 8 },
  sectionBody: { fontSize: 13, color: '#3B2800', lineHeight: 22 },

  backButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: '#F5A623', paddingVertical: 12,
    borderRadius: 10, paddingHorizontal: 32, alignSelf: 'center',
  },
  backButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});