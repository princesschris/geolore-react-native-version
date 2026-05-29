import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ScrollView, Dimensions, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import TopBar from '../components/TopBar';
import ImageCard from '../components/ImageCard';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface Tradition {
  id:         string;
  title:      string;
  content:    string;
  image_url?: string;
  sort_order: number;
}

export default function TraditionsScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll,     setShowAll]     = useState(false);
  const [traditions,  setTraditions]  = useState<Tradition[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);

  const { user } = useAuth();
  const tribe = user?.tribe ?? 'Igbo';

  const fetchTraditions = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: sbError } = await supabase
        .from('culture_content')
        .select('id, title, content, image_url, sort_order')
        .eq('category', 'traditions')
        .eq('culture', tribe)
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
  const displayed = showAll ? filtered : filtered.slice(0, 6);

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
        {!loading && !error && traditions.length === 0 && (
          <View style={styles.centeredState}>
            <Ionicons name="library-outline" size={48} color="#C4A882" />
            <Text style={styles.stateText}>No traditions found for {tribe}</Text>
          </View>
        )}

        {/* Grid */}
        {!loading && !error && displayed.length > 0 && (
          <>
            <View style={styles.grid}>
              {displayed.map((tradition) => (
                <ImageCard
                  key={tradition.id}
                  title={tradition.title}
                  imageSource={tradition.image_url ? { uri: tradition.image_url } : undefined}
                  width={CARD_WIDTH}
                  height={120}
                  onPress={() =>
                    navigation?.navigate('TraditionDetails', {
                      tradition: {
                        id:    tradition.id,
                        title: tradition.title,
                        body:  tradition.content,
                      },
                    })
                  }
                />
              ))}
            </View>

            {!showAll && filtered.length > 6 && (
              <TouchableOpacity
                style={styles.viewMoreBtn}
                activeOpacity={0.8}
                onPress={() => setShowAll(true)}
              >
                <Text style={styles.viewMoreText}>View More</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5', shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32 },
  title: { fontSize: 20, fontWeight: '800', color: '#3B1F00', textAlign: 'center', letterSpacing: 1.5, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', marginBottom: 20 },
  centeredState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 12 },
  stateText: { fontSize: 14, color: '#A08060', fontWeight: '500' },
  retryBtn: { backgroundColor: '#F5A623', paddingVertical: 10, paddingHorizontal: 28, borderRadius: 10 },
  retryBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  viewMoreBtn: { backgroundColor: '#F5A623', paddingVertical: 13, borderRadius: 10, alignItems: 'center', marginBottom: 12 },
  viewMoreText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});