import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';

// ─── Types ────────────────────────────────────────────────────────────────────

type InlineSegment = { text: string; bold: boolean; italic: boolean };

type Block =
  | { type: 'h1';       text: string }
  | { type: 'h2';       text: string }
  | { type: 'h3';       text: string }
  | { type: 'h4';       text: string }
  | { type: 'bullet';   segments: InlineSegment[] }
  | { type: 'numbered'; n: number; segments: InlineSegment[] }
  | { type: 'paragraph'; segments: InlineSegment[] };

export type ContentItem = {
  id:      string;
  title:   string;
  content: string;
  [key: string]: any;
};

export type ContentDetailScreenProps = {
  navigation:   any;
  item?:        ContentItem | null | undefined;
  rawContent?:  string;
  heroTitle?:   string;
  heroIcon?:    string;
  heroColor?:   string;
  accentColor?: string;
  label?:       string;
};

// ─── Inline parser — handles **bold**, *italic*, _italic_ ─────────────────────

function parseInline(text: string): InlineSegment[] {
  const segments: InlineSegment[] = [];
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*|_(.+?)_)/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      segments.push({ text: text.slice(last, match.index), bold: false, italic: false });
    }
    if (match[0].startsWith('**')) {
      segments.push({ text: match[2], bold: true, italic: false });
    } else {
      segments.push({ text: match[3] ?? match[4], bold: false, italic: true });
    }
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    segments.push({ text: text.slice(last), bold: false, italic: false });
  }

  return segments.filter(s => s.text.length > 0);
}

// ─── Block parser ─────────────────────────────────────────────────────────────

function parseBlocks(raw: string): Block[] {
  if (!raw || typeof raw !== 'string') return [];

  const blocks: Block[] = [];

  // Normalise all newline variants and JSON-escaped sequences
  const normalised = raw
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Strip UTF-8 BOM
    .replace(/^\uFEFF/, '');

  const lines = normalised.split('\n');
  let paraLines: string[] = [];

  const flushPara = () => {
    const text = paraLines.join(' ').trim();
    if (text) blocks.push({ type: 'paragraph', segments: parseInline(text) });
    paraLines = [];
  };

  for (const line of lines) {
    // Trim ALL trailing whitespace including the trailing spaces the .md file uses
    // e.g. "- trade    " becomes "- trade"
    const t = line.trim();

    // Skip horizontal rules
    if (/^[-*_]{3,}$/.test(t)) {
      flushPara();
      continue;
    }

    if (/^#{4}\s/.test(t)) {
      flushPara();
      blocks.push({ type: 'h4', text: t.replace(/^#{4}\s*/, '').trim() });
    } else if (/^#{3}\s/.test(t)) {
      flushPara();
      blocks.push({ type: 'h3', text: t.replace(/^#{3}\s*/, '').trim() });
    } else if (/^#{2}\s/.test(t)) {
      flushPara();
      blocks.push({ type: 'h2', text: t.replace(/^#{2}\s*/, '').trim() });
    } else if (/^#{1}\s/.test(t)) {
      flushPara();
      blocks.push({ type: 'h1', text: t.replace(/^#{1}\s*/, '').trim() });
    } else if (/^[-*•+]\s/.test(t)) {
      flushPara();
      blocks.push({ type: 'bullet', segments: parseInline(t.replace(/^[-*•+]\s*/, '').trim()) });
    } else if (/^\d+[.)]\s/.test(t)) {
      flushPara();
      const n = parseInt(t.match(/^(\d+)/)![1], 10);
      blocks.push({ type: 'numbered', n, segments: parseInline(t.replace(/^\d+[.)]\s*/, '').trim()) });
    } else if (t === '') {
      flushPara();
    } else {
      paraLines.push(t);
    }
  }

  flushPara();
  return blocks;
}

// ─── Inline renderer ──────────────────────────────────────────────────────────

function InlineText({ segments, style }: { segments: InlineSegment[]; style: any }) {
  return (
    <Text style={style}>
      {segments.map((seg, i) => (
        <Text
          key={i}
          style={[
            seg.bold   && { fontWeight: '800' as const },
            seg.italic && { fontStyle:  'italic' as const },
          ]}
        >
          {seg.text}
        </Text>
      ))}
    </Text>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ContentDetailScreen({
  navigation,
  item,
  rawContent,
  heroTitle,
  heroIcon    = 'document-text-outline',
  heroColor   = '#C4A882',
  accentColor = '#F5A623',
  label,
}: ContentDetailScreenProps) {

  const resolvedContent = rawContent ?? item?.content ?? '';
  const resolvedTitle   = heroTitle   ?? item?.title  ?? '';

  if (!item && !rawContent) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
        <View style={styles.centeredState}>
          <Ionicons name="alert-circle-outline" size={48} color="#C4A882" />
          <Text style={styles.stateText}>No content found</Text>
          <TouchableOpacity style={[styles.pill, { backgroundColor: accentColor }]} onPress={() => navigation?.goBack()}>
            <Text style={styles.pillText}>Go back</Text>
          </TouchableOpacity>
        </View>
        <BottomTabBar />
      </SafeAreaView>
    );
  }

  const blocks = parseBlocks(resolvedContent);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={heroColor} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: heroColor }]}>
          <TouchableOpacity style={styles.heroBack} onPress={() => navigation?.goBack()} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={[styles.heroBadge, { backgroundColor: heroColor + '55' }]}>
            <Ionicons name={heroIcon as any} size={40} color="#fff" />
          </View>
          {label && <Text style={styles.heroLabel}>{label}</Text>}
          <Text style={styles.heroTitle}>{resolvedTitle}</Text>
        </View>

        {/* Content */}
        <View style={styles.card}>
          {blocks.length === 0 ? (
            <Text style={styles.emptyText}>No content available</Text>
          ) : (
            blocks.map((block, i) => {
              switch (block.type) {

                case 'h1':
                  return (
                    <Text key={i} style={[styles.h1, i > 0 && { marginTop: 24 }]}>
                      {block.text}
                    </Text>
                  );

                case 'h2':
                  return (
                    <View key={i} style={[styles.h2Wrap, i > 0 && { marginTop: 20 }]}>
                      <Text style={[styles.h2, { color: accentColor }]}>{block.text}</Text>
                      <View style={[styles.h2Line, { backgroundColor: accentColor + '50' }]} />
                    </View>
                  );

                case 'h3':
                  return (
                    <View key={i} style={[styles.h3Wrap, i > 0 && { marginTop: 16 }]}>
                      <View style={[styles.h3Bar, { backgroundColor: accentColor }]} />
                      <Text style={[styles.h3, { color: accentColor }]}>{block.text}</Text>
                    </View>
                  );

                case 'h4':
                  return (
                    <Text key={i} style={[styles.h4, i > 0 && { marginTop: 10 }]}>
                      {block.text}
                    </Text>
                  );

                case 'bullet':
                  return (
                    <View key={i} style={styles.bulletRow}>
                      <View style={[styles.bulletDot, { backgroundColor: accentColor }]} />
                      <InlineText segments={block.segments} style={styles.listText} />
                    </View>
                  );

                case 'numbered':
                  return (
                    <View key={i} style={styles.bulletRow}>
                      <Text style={[styles.numberedIndex, { color: accentColor }]}>{block.n}.</Text>
                      <InlineText segments={block.segments} style={styles.listText} />
                    </View>
                  );

                default:
                  return (
                    <InlineText key={i} segments={(block as any).segments} style={styles.bodyText} />
                  );
              }
            })
          )}
        </View>

      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea:      { flex: 1, backgroundColor: '#FFFDF5' },
  scrollContent: { paddingBottom: 40 },

  hero: {
    paddingTop: 56, paddingBottom: 36,
    paddingHorizontal: 24,
    alignItems: 'center', gap: 10,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroBack: {
    position: 'absolute', top: 16, left: 16,
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroBadge: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  heroLabel: {
    fontSize: 11, fontWeight: '700',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 1.4, textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 22, fontWeight: '900', color: '#fff',
    textAlign: 'center', lineHeight: 30, paddingHorizontal: 12,
  },

  card: {
    marginHorizontal: 16, marginTop: 20,
    backgroundColor: '#fff', borderRadius: 20,
    borderWidth: 1, borderColor: '#EDE0CC',
    padding: 20, gap: 8,
    shadowColor: '#C4882A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },

  h1:     { fontSize: 22, fontWeight: '900', color: '#3B1F00', lineHeight: 30 },

  h2Wrap: { gap: 4 },
  h2:     { fontSize: 18, fontWeight: '800', lineHeight: 26 },
  h2Line: { height: 2, borderRadius: 1 },

  h3Wrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  h3Bar:  { width: 4, height: 18, borderRadius: 2 },
  h3:     { fontSize: 15, fontWeight: '800', letterSpacing: 0.4, textTransform: 'uppercase' },

  h4:     { fontSize: 14, fontWeight: '700', color: '#5C3A00' },

  bulletRow:     { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingLeft: 4 },
  bulletDot:     { width: 7, height: 7, borderRadius: 4, marginTop: 8, flexShrink: 0 },
  numberedIndex: { fontSize: 14, fontWeight: '700', marginTop: 2, flexShrink: 0, minWidth: 20 },
  listText:      { flex: 1, fontSize: 14, color: '#3B2800', lineHeight: 22 },

  bodyText:  { fontSize: 14, color: '#3B2800', lineHeight: 24 },
  emptyText: { fontSize: 13, color: '#A08060', fontStyle: 'italic' },

  centeredState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 48 },
  stateText:     { fontSize: 14, color: '#A08060', fontWeight: '500' },
  pill:          { paddingVertical: 10, paddingHorizontal: 28, borderRadius: 10 },
  pillText:      { color: '#fff', fontSize: 13, fontWeight: '700' },
});