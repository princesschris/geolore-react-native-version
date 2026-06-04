import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, FlatList, ActivityIndicator,
  Animated, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import TopBar from '../components/TopBar';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

type Proverb = {
  id:           string;
  culture:      string;
  native_text:  string;
  translation:  string;
  meaning?:     string;
  explanation?: string;
};

const ProverbCard = ({ item, index }: { item: Proverb; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    Animated.spring(anim, {
      toValue:         expanded ? 0 : 1,
      useNativeDriver: false,
      friction:        8,
    }).start();
    setExpanded(!expanded);
  };
  const accents = ['#F5A623', '#3B1F00', '#8B6F4E', '#C4853A'];
  const accent  = accents[index % accents.length];

  const chevronRotation = anim.interpolate({
    inputRange:  [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={[styles.card, { borderLeftColor: accent }]}>
      <TouchableOpacity onPress={toggle} activeOpacity={0.75} style={styles.cardTop}>
        <Text style={[styles.quoteSymbol, { color: accent }]}>"</Text>
        <View style={styles.cardTopText}>
          <Text style={styles.nativeText}>{item.native_text}</Text>
          <Text style={styles.translationText}>{item.translation}</Text>
        </View>
        <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
          <Ionicons name="chevron-down" size={18} color="#A08060" />
        </Animated.View>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.expandedSection}>
          <View style={styles.divider} />

          {item.meaning ? (
            <View style={styles.detailRow}>
              <View style={[styles.detailTag, { backgroundColor: accent }]}>
                <Text style={styles.detailTagText}>Meaning</Text>
              </View>
              <Text style={styles.detailText}>{item.meaning}</Text>
            </View>
          ) : null}

          {item.explanation ? (
            <View style={styles.detailRow}>
              <View style={[styles.detailTag, { backgroundColor: '#F5E6CC' }]}>
                <Text style={[styles.detailTagText, { color: '#5C3A00' }]}>Explanation</Text>
              </View>
              <Text style={styles.detailText}>{item.explanation}</Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
};
export default function ProverbsScreen() {
  const { user }   = useAuth();
  const [proverbs, setProverbs]     = useState<Proverb[]>([]);
  const [loading,  setLoading]      = useState(true);
  const [error,    setError]        = useState<string | null>(null);
  const [search,   setSearch]       = useState('');

  const rawTribe = user?.tribe ?? 'igbo';
  const tribe    = rawTribe.charAt(0).toUpperCase() + rawTribe.slice(1).toLowerCase();

  useEffect(() => { fetchProverbs(); }, [tribe]);

  const fetchProverbs = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from('proverbs')
        .select('id, culture, native_text, translation, meaning, explanation')
        .eq('culture', tribe)
        .order('native_text', { ascending: true });
      if (err) throw err;
      setProverbs(data ?? []);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load proverbs');
    } finally {
      setLoading(false);
    }
  };

  const filtered = proverbs.filter((p) =>
    p.native_text.toLowerCase().includes(search.toLowerCase()) ||
    p.translation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
      <TopBar searchQuery={search} onSearchChange={setSearch} />
      <BuntingBanner />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PROVERBS</Text>
        <Text style={styles.headerSub}>
          {loading ? '...' : `${filtered.length} ${tribe} proverbs`}
        </Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#F5A623" />
          <Text style={styles.stateText}>Loading {tribe} proverbs...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={48} color="#C4A882" />
          <Text style={styles.stateText}>Could not load proverbs</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchProverbs}>
            <Text style={styles.retryBtnText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="chatbubble-ellipses-outline" size={48} color="#C4A882" />
          <Text style={styles.stateText}>No proverbs found for {tribe}</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <ProverbCard item={item} index={index} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListFooterComponent={<View style={{ height: 32 }} />}
        />
      )}

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:  { flex: 1, backgroundColor: '#FFFDF5' },

  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20, fontWeight: '800', color: '#3B1F00', letterSpacing: 1.5,
  },
  headerSub: {
    fontSize: 12, fontWeight: '600', color: '#A08060',
  },

  centered: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 48,
  },
  stateText:    { fontSize: 14, color: '#A08060', fontWeight: '500' },
  retryBtn:     { backgroundColor: '#F5A623', paddingVertical: 10, paddingHorizontal: 28, borderRadius: 10 },
  retryBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  listContent: { paddingHorizontal: 16, paddingTop: 4 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0E6D6',
    borderLeftWidth: 4,
    paddingHorizontal: 14,
    paddingVertical: 14,
    shadowColor: '#3B1F00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  quoteSymbol: {
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 36,
    marginTop: -4,
  },
  cardTopText: { flex: 1, gap: 4 },
  nativeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B1F00',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  translationText: {
    fontSize: 12,
    color: '#8B6F4E',
    lineHeight: 18,
  },
  expandedSection: { marginTop: 12, gap: 12 },
  divider:         { height: 1, backgroundColor: '#F0E6D6' },

  detailRow: { gap: 6 },
  detailTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  detailTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  detailText: {
    fontSize: 13,
    color: '#5C4A30',
    lineHeight: 20,
  },
});