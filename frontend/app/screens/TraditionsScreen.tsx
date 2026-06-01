import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import TopBar from '../components/TopBar';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

interface Tradition {
  id:         string;
  title:      string;
  content:    string;
  sort_order: number;
}

const TraditionCard = ({
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
      <Ionicons name="leaf-outline" size={28} color="#F5A623" />
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

export default function TraditionsScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll,     setShowAll]     = useState(false);
  const [traditions,  setTraditions]  = useState<Tradition[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);

  const { user } = useAuth();
  const tribe = user?.tribe
    ? user.tribe.charAt(0).toUpperCase() + user.tribe.slice(1).toLowerCase()
    : 'Igbo';

  const fetchTraditions = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: sbError } = await supabase
        .from('culture_content')
        .select('id, title, content, sort_order')
        .eq('category', 'traditions')
        .ilike('culture', tribe)
        .order('sort_order', { ascending: true });

      if (sbError) throw sbError;
      setTraditions(data ?? []);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load traditions');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchTraditions(); }, [tribe]));

  const filtered  = traditions.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const displayed = showAll ? filtered : filtered.slice(0, 10);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BuntingBanner />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>TRADITIONS</Text>

        {/* Loading */}
        {loading && (
          <View style={styles.centeredState}>
            <ActivityIndicator size="large" color="#F5A623" />
            <Text style={styles.stateText}>Loading traditions...</Text>
          </View>
        )}

        {/* Error */}
        {!loading && error && (
          <View style={styles.centeredState}>
            <Ionicons name="alert-circle-outline" size={48} color="#C4A882" />
            <Text style={styles.stateText}>Could not load traditions</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchTraditions}>
              <Text style={styles.retryBtnText}>Try again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <View style={styles.centeredState}>
            <Ionicons name="leaf-outline" size={48} color="#C4A882" />
            <Text style={styles.stateText}>No traditions found for {tribe}</Text>
          </View>
        )}

        {/* List */}
        {!loading && !error && displayed.map((tradition) => (
          <TraditionCard
            key={tradition.id}
            title={tradition.title}
            description={tradition.content}
            onView={() =>
              navigation?.navigate('TraditionDetails', {
                tradition: {
                  id:      tradition.id,
                  title:   tradition.title,
                  content: tradition.content,
                },
              })
            }
          />
        ))}

        {/* View More */}
        {!loading && !error && !showAll && filtered.length > 10 && (
          <TouchableOpacity
            style={styles.viewMoreBtn}
            activeOpacity={0.8}
            onPress={() => setShowAll(true)}
          >
            <Text style={styles.viewMoreText}>View More</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32 },
  title: {
    fontSize: 20, fontWeight: '800', color: '#3B1F00',
    textAlign: 'center', letterSpacing: 1.5, marginBottom: 20,
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
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#FFF3E0',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  cardBody: { flex: 1, gap: 4 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#3B1F00' },
  cardPreview: { fontSize: 12, color: '#A08060', lineHeight: 18 },
  viewBtn: {
    backgroundColor: '#F5A623',
    paddingVertical: 8, paddingHorizontal: 16,
    borderRadius: 20, flexShrink: 0,
  },
  viewBtnText: { color: '#fff', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  viewMoreBtn: {
    backgroundColor: '#F5A623', paddingVertical: 13,
    borderRadius: 10, alignItems: 'center', marginBottom: 12,
  },
  viewMoreText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  centeredState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 12 },
  stateText: { fontSize: 14, color: '#A08060', fontWeight: '500' },
  retryBtn: { backgroundColor: '#F5A623', paddingVertical: 10, paddingHorizontal: 28, borderRadius: 10 },
  retryBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});