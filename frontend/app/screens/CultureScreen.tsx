import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import TopBar from '../components/TopBar';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

type CultureItem = {
  id:       string;
  culture:  string;
  category: string;
  title:    string;
  content:  string;
  sort_order: number;
};

// Reuse the same card style as FashionCard but inline — no extra component needed
const CultureCard = ({
  title,
  description,
  onView,
}: {
  title: string;
  description: string;
  onView: () => void;
}) => (
  <View style={styles.card}>
    <View style={styles.cardIcon}>
      <Ionicons name="globe-outline" size={28} color="#F5A623" />
    </View>
    <View style={styles.cardBody}>
      <Text style={styles.cardTitle}>{title}</Text>
      {description ? (
        <Text style={styles.cardPreview} numberOfLines={3}>
          {description}
        </Text>
      ) : null}
    </View>
    <TouchableOpacity style={styles.viewBtn} activeOpacity={0.8} onPress={onView}>
      <Text style={styles.viewBtnText}>VIEW</Text>
    </TouchableOpacity>
  </View>
);

export default function CultureScreen({ navigation }: any) {
  const { user } = useAuth();
  const [items, setItems]     = useState<CultureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Capitalise tribe to match seeded culture names e.g. "Igbo", "Yoruba"
  const tribe = user?.tribe
    ? user.tribe.charAt(0).toUpperCase() + user.tribe.slice(1).toLowerCase()
    : 'Igbo';

  useEffect(() => {
    fetchCulture();
  }, [tribe]);

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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>CULTURE</Text>

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
        {!loading && !error && filtered.map((item) => (
          <CultureCard
            key={item.id}
            title={item.title}
            description={item.content}
            onView={() => navigation?.navigate('CultureDetail', { item })}
          />
        ))}
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32 },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3B1F00',
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F5A623',
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardBody: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#3B1F00',
  },
  cardPreview: {
    fontSize: 12,
    color: '#A08060',
    lineHeight: 18,
  },
  viewBtn: {
    backgroundColor: '#F5A623',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexShrink: 0,
  },
  viewBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  centeredState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  stateText: { fontSize: 14, color: '#A08060', fontWeight: '500' },
  retryBtn: {
    backgroundColor: '#F5A623',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  retryBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});