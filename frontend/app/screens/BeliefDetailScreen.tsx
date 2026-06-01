import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import TopBar from '../components/TopBar';

const CARD_COLORS = ['#F5A623', '#8B6F4E'];

// ─── Markdown parser ──────────────────────────────────────────────────────────
type Block =
  | { type: 'h3';        text: string }
  | { type: 'h4';        text: string }
  | { type: 'bullet';    text: string }
  | { type: 'paragraph'; text: string };

function parseBlocks(raw: string): Block[] {
  const blocks: Block[] = [];
  const lines = raw.split('\n');
  let paraLines: string[] = [];

  const flushPara = () => {
    const text = paraLines.join(' ').trim();
    if (text) blocks.push({ type: 'paragraph', text });
    paraLines = [];
  };

  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith('#### ')) {
      flushPara();
      blocks.push({ type: 'h4', text: t.replace(/^####\s+/, '') });
    } else if (t.startsWith('###') || t.startsWith('##')) {
      flushPara();
      blocks.push({ type: 'h3', text: t.replace(/^#{2,3}\s+/, '') });
    } else if (/^[-*•]/.test(t)) {
      flushPara();
      blocks.push({ type: 'bullet', text: t.replace(/^[-*•]\s*/, '') });
    } else if (t === '') {
      flushPara();
    } else {
      paraLines.push(t);
    }
  }
  flushPara();
  return blocks;
}

function stripInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g,     '$1')
    .replace(/_(.*?)_/g,       '$1')
    .replace(/`(.*?)`/g,       '$1');
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function BeliefDetailScreen({ navigation, route }: any) {
  const belief = route?.params?.belief;
  const index  = route?.params?.index ?? 0;

  if (!belief) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <TopBar showSearch={false} />
        <View style={styles.centeredState}>
          <Ionicons name="alert-circle-outline" size={48} color="#C4A882" />
          <Text style={styles.stateText}>No belief content found</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => navigation?.goBack()}>
            <Text style={styles.retryBtnText}>Go back</Text>
          </TouchableOpacity>
        </View>
        <BottomTabBar />
      </SafeAreaView>
    );
  }

  const cardColor = belief.color ?? CARD_COLORS[index % CARD_COLORS.length];
  const blocks = parseBlocks(belief.content ?? belief.body ?? '');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
      <TopBar showSearch={false} />
      <BuntingBanner />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Title banner uses the card colour from the grid */}
        <View style={[styles.titleBanner, { backgroundColor: cardColor }]}>
          <Text style={styles.titleText}>{belief.title.toUpperCase()}</Text>
        </View>

        <View style={styles.card}>
          {blocks.length > 0 ? blocks.map((block, i) => {
            if (block.type === 'h3') return (
              <View key={i} style={[styles.sectionHeadingWrap, i > 0 && { marginTop: 12 }]}>
                <Text style={styles.sectionHeadingText}>{stripInline(block.text).toUpperCase()}</Text>
                <View style={styles.sectionDivider} />
              </View>
            );
            if (block.type === 'h4') return (
              <Text key={i} style={styles.subHeadingText}>{stripInline(block.text)}</Text>
            );
            if (block.type === 'bullet') return (
              <Text key={i} style={styles.bulletText}>{'  \u2022  '}{stripInline(block.text)}</Text>
            );
            return (
              <Text key={i} style={styles.bodyText}>{stripInline(block.text)}</Text>
            );
          }) : (
            <Text style={styles.emptyText}>No content available</Text>
          )}
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
    borderRadius: 12, paddingVertical: 18, paddingHorizontal: 20,
    alignItems: 'center', marginBottom: 16,
  },
  titleText: { fontSize: 18, fontWeight: '800', color: '#fff', textAlign: 'center', letterSpacing: 1 },
  card: {
    backgroundColor: '#fff', borderRadius: 14, borderWidth: 1,
    borderColor: '#E8D8C0', padding: 20, marginBottom: 20, gap: 6,
  },
  sectionHeadingWrap: { marginTop: 12, marginBottom: 6 },
  sectionHeadingText: { fontSize: 13, fontWeight: '800', color: '#F5A623', letterSpacing: 0.8, marginBottom: 6 },
  sectionDivider: { height: 1, backgroundColor: '#E8D8C0' },
  subHeadingText: { fontSize: 13, fontWeight: '700', color: '#6B5040', marginTop: 8, marginBottom: 2, paddingLeft: 4 },
  bulletText: { fontSize: 13, color: '#3B2800', lineHeight: 22, paddingLeft: 4 },
  bodyText: { fontSize: 13, color: '#3B2800', lineHeight: 22 },
  emptyText: { fontSize: 13, color: '#A08060', fontStyle: 'italic' },
  centeredState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 48 },
  stateText: { fontSize: 14, color: '#A08060', fontWeight: '500' },
  retryBtn: { backgroundColor: '#F5A623', paddingVertical: 10, paddingHorizontal: 28, borderRadius: 10 },
  retryBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  backButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: '#F5A623', paddingVertical: 12,
    borderRadius: 10, paddingHorizontal: 32, alignSelf: 'center',
  },
  backButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});