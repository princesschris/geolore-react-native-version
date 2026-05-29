import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ScrollView, ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import SearchBar from '../components/SearchBar';

export default function TraditionDetailScreen({ navigation, route }: any) {
  const [searchQuery, setSearchQuery] = useState('');

  const tradition = route?.params?.tradition ?? {
    title: 'Tradition',
    body:  'No content available.',
  };

  // Split content into paragraphs — handles both \n\n and single \n
  const paragraphs = (tradition.body ?? '')
    .split(/\n\n+/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <View style={styles.topBar}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search" />
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="person-outline" size={20} color="#5C3A00" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation?.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={20} color="#5C3A00" />
        </TouchableOpacity>
      </View>

      <BuntingBanner />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Title */}
        <Text style={styles.title}>{tradition.title.toUpperCase()}</Text>

        {/* Image or placeholder */}
        <View style={styles.imageCard}>
          {tradition.imageSource ? (
            <ImageBackground
              source={
                typeof tradition.imageSource === 'string'
                  ? { uri: tradition.imageSource }
                  : tradition.imageSource
              }
              style={styles.image}
              imageStyle={styles.imageRadius}
            >
              <View style={styles.overlay} />
            </ImageBackground>
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Ionicons name="book-outline" size={48} color="rgba(255,255,255,0.7)" />
              <Text style={styles.placeholderText}>{tradition.title}</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.bodyCard}>
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph: string, i: number) => {
              // Render lines that start with - as bullet points
              if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                return (
                  <View key={i} style={styles.bulletRow}>
                    <View style={styles.bulletDot} />
                    <Text style={styles.bodyText}>
                      {paragraph.replace(/^[-*]\s/, '')}
                    </Text>
                  </View>
                );
              }
              return (
                <Text key={i} style={styles.bodyText}>{paragraph}</Text>
              );
            })
          ) : (
            <Text style={styles.emptyText}>No content available for this tradition.</Text>
          )}
        </View>

        {/* Back button */}
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
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10, gap: 10 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32 },
  title: { fontSize: 20, fontWeight: '800', color: '#3B1F00', textAlign: 'center', letterSpacing: 1.5, marginBottom: 16 },
  imageCard: { width: '100%', height: 200, borderRadius: 14, overflow: 'hidden', marginBottom: 16, borderWidth: 1, borderColor: '#E0D0B8' },
  image: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  imageRadius: { borderRadius: 14 },
  imagePlaceholder: { backgroundColor: '#C4A882', gap: 8 },
  placeholderText: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '700', textAlign: 'center', paddingHorizontal: 16 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  bodyCard: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#E0D0B8', padding: 16, marginBottom: 20, gap: 10 },
  bodyText: { fontSize: 13, color: '#5C4A30', lineHeight: 22, textAlign: 'justify' },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F5A623', marginTop: 8, flexShrink: 0 },
  emptyText: { fontSize: 13, color: '#A08060', fontStyle: 'italic', textAlign: 'center' },
  backButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#F5A623', paddingVertical: 12, borderRadius: 10, paddingHorizontal: 32, alignSelf: 'center' },
  backButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});