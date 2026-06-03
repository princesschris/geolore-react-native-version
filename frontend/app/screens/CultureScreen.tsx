import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import TopBar from '../components/TopBar';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

type CultureItem = {
  id:         string;
  culture:    string;
  category:   string;
  title:      string;
  content:    string;
  sort_order: number;
};

const CARD_ACCENTS = ['#F5A623', '#E07B39', '#C4573A', '#8B3A2F', '#5C3A00'];
const CARD_BG      = ['#FFF8EE', '#FFF3E8', '#FFF0EA', '#FEF0EC', '#FDF3EE'];
const ICONS: any[] = [
  'flag-outline', 'people-outline', 'storefront-outline',
  'ribbon-outline', 'book-outline', 'musical-notes-outline',
  'color-palette-outline', 'leaf-outline',
];

const CultureCard = ({ title, index, onPress }: { title: string; index: number; onPress: () => void }) => {
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
  const bg     = CARD_BG[index % CARD_BG.length];
  const icon   = ICONS[index % ICONS.length];

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: bg }]} activeOpacity={0.75} onPress={onPress}>
      <View style={[styles.accentBar, { backgroundColor: accent }]} />
      <View style={[styles.iconWrap, { backgroundColor: accent + '22' }]}>
        <Ionicons name={icon} size={22} color={accent} />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardNumber}>{String(index + 1).padStart(2, '0')}</Text>
        <Text style={styles.cardTitle} numberOfLines={2}>{title}</Text>
      </View>
      <View style={[styles.arrowWrap, { backgroundColor: accent }]}>
        <Ionicons name="arrow-forward" size={16} color="#fff" />
      </View>
    </TouchableOpacity>
  );
};

export default function CultureScreen({ navigation }: any) {
  const { user } = useAuth();
  const [items,       setItems]       = useState<CultureItem[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const tribe = user?.tribe
    ? user.tribe.charAt(0).toUpperCase() + user.tribe.slice(1).toLowerCase()
    : 'Igbo';

  useEffect(() => { fetchCulture(); }, [tribe]);

  const fetchCulture = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: supabaseError } = await supabase
        .from('culture_content')
        .select('*')
        .eq('category', 'culture')
        .ilike('culture', tribe)
        .order('sort_order', { ascending: true });
      if (supabaseError) throw supabaseError;
      setItems(data ?? []);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load culture items');
    } finally {
      setLoading(false);
    }
  };

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BuntingBanner />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerEyebrow}>{tribe} Heritage</Text>
            <Text style={styles.headerTitle}>Culture</Text>
          </View>
          <View style={styles.headerBadge}>
            <Ionicons name="globe" size={28} color="#F5A623" />
          </View>
        </View>

        {/* Count pill */}
        {!loading && !error && filtered.length > 0 && (
          <View style={styles.countRow}>
            <View style={styles.countPill}>
              <Text style={styles.countText}>{filtered.length} topics</Text>
            </View>
          </View>
        )}

        {/* Loading */}
        {loading && (
          <View style={styles.centeredState}>
            <ActivityIndicator size="large" color="#F5A623" />
            <Text style={styles.stateText}>Loading {tribe} culture...</Text>
          </View>
        )}

        {/* Error */}
        {!loading && error && (
          <View style={styles.centeredState}>
            <Ionicons name="alert-circle-outline" size={48} color="#C4A882" />
            <Text style={styles.stateText}>Could not load culture items</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchCulture}>
              <Text style={styles.retryBtnText}>Try again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <View style={styles.centeredState}>
            <Ionicons name="globe-outline" size={48} color="#C4A882" />
            <Text style={styles.stateText}>No culture items found for {tribe}</Text>
          </View>
        )}

        {/* List */}
        {!loading && !error && filtered.map((item, index) => (
          <CultureCard
            key={item.id}
            title={item.title}
            index={index}
            onPress={() => navigation?.navigate('CultureDetail', { item })}
          />
        ))}

      </ScrollView>
      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:      { flex: 1, backgroundColor: '#FFFDF5' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 32 },

  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20, paddingHorizontal: 4,
  },
  headerLeft:    { gap: 2 },
  headerEyebrow: { fontSize: 12, fontWeight: '600', color: '#F5A623', letterSpacing: 1.2, textTransform: 'uppercase' },
  headerTitle:   { fontSize: 28, fontWeight: '900', color: '#3B1F00', letterSpacing: 0.5 },
  headerBadge: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#F5C070',
  },

  countRow:  { marginBottom: 16 },
  countPill: {
    alignSelf: 'flex-start', backgroundColor: '#FFF3E0',
    borderRadius: 20, paddingVertical: 4, paddingHorizontal: 12,
    borderWidth: 1, borderColor: '#F5C070',
  },
  countText: { fontSize: 12, fontWeight: '700', color: '#F5A623' },

  card: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 16, marginBottom: 12, padding: 14, gap: 12,
    shadowColor: '#C4882A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 2,
  },
  accentBar: { width: 3, height: 40, borderRadius: 4 },
  iconWrap: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  cardBody:   { flex: 1, gap: 2 },
  cardNumber: { fontSize: 10, fontWeight: '800', color: '#C4A882', letterSpacing: 1 },
  cardTitle:  { fontSize: 15, fontWeight: '800', color: '#3B1F00', lineHeight: 21 },
  arrowWrap: {
    width: 32, height: 32, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },

  centeredState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 12 },
  stateText:     { fontSize: 14, color: '#A08060', fontWeight: '500' },
  retryBtn:      { backgroundColor: '#F5A623', paddingVertical: 10, paddingHorizontal: 28, borderRadius: 10 },
  retryBtnText:  { color: '#fff', fontSize: 13, fontWeight: '700' },
});