import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, ActivityIndicator,
  Modal, FlatList, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CategoryCard from '../components/CategoryCard';
import BottomTabBar from '../components/BottomTabBar';
import TopBar from '../components/TopBar';
import { useRole, useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';

function PickerModal({
  visible, title, items, onSelect, onClose,
}: {
  visible: boolean; title: string; items: string[];
  onSelect: (val: string) => void; onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const filtered = query.trim()
    ? items.filter((i) => i.toLowerCase().includes(query.toLowerCase()))
    : items;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={modal.overlay}>
        <View style={modal.sheet}>
          <View style={modal.handle} />
          <Text style={modal.title}>{title}</Text>
          <View style={modal.searchWrap}>
            <Ionicons name="search-outline" size={16} color="#A08060" />
            <TextInput
              style={modal.searchInput}
              placeholder={`Search…`}
              placeholderTextColor="#C4A882"
              value={query}
              onChangeText={setQuery}
              autoCapitalize="words"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={16} color="#C4A882" />
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={modal.item}
                onPress={() => { onSelect(item); setQuery(''); }}
                activeOpacity={0.7}
              >
                <Text style={modal.itemText}>{item}</Text>
                <Ionicons name="chevron-forward" size={16} color="#C4A882" />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={modal.empty}>
                <Text style={modal.emptyText}>No results for "{query}"</Text>
              </View>
            }
          />
          <TouchableOpacity style={modal.cancelBtn} onPress={onClose}>
            <Text style={modal.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function YourCultureScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');

  const { user, setUser } = useAuth();

  const [countries,         setCountries]         = useState<string[]>([]);
  const [tribes,            setTribes]            = useState<string[]>([]);
  const [selectedCountry,   setSelectedCountry]   = useState('');
  const [selectedTribe,     setSelectedTribe]     = useState('');
  const [loadingTribes,     setLoadingTribes]     = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showTribePicker,   setShowTribePicker]   = useState(false);
  const [saving,            setSaving]            = useState(false);

  const cultureName = user?.tribe        ?? null;
  const cultureFlag = user?.country_flag ?? '🌍';

  const CULTURE_CATEGORIES = [
    { key: 'history',   title: 'History',   screen: 'History'   },
    { key: 'fashion',   title: 'Fashion',   screen: 'Fashion'   },
    { key: 'festivals', title: 'Festivals', screen: 'Festivals' },
    { key: 'beliefs',   title: 'Beliefs',   screen: 'Beliefs'   },
    { key: 'stories',   title: 'Stories',   screen: 'Stories'   },
    { key: 'proverbs',  title: 'Proverbs',  screen: 'Proverbs'  },
    { key: 'culture',   title: 'Culture',   screen: 'Culture'   },
  ];

  const filtered = CULTURE_CATEGORIES.filter((cat) =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchCountries = async () => {
      const { data } = await supabase
        .from('tribes').select('country').order('country');
      setCountries([...new Set((data ?? []).map((r: any) => r.country))]);
    };
    fetchCountries();
  }, []);

  
  
  useEffect(() => {
    const preloadTribes = async () => {
      const country = user?.country_of_origin;
      if (!country) return;
      setSelectedCountry(country);
      setLoadingTribes(true);
      const { data } = await supabase
        .from('tribes').select('tribe').eq('country', country).order('tribe');
      setTribes((data ?? []).map((r: any) => r.tribe));
      setLoadingTribes(false);
    };
    preloadTribes();
  }, [user?.country_of_origin]);

  const handleSelectCountry = async (country: string) => {
    setSelectedCountry(country);
    setSelectedTribe('');
    setShowCountryPicker(false);
    setLoadingTribes(true);
    const { data } = await supabase
      .from('tribes').select('tribe').eq('country', country).order('tribe');
    setTribes((data ?? []).map((r: any) => r.tribe));
    setLoadingTribes(false);
  };

  const handleSave = async () => {
    if (!selectedTribe) return;
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ tribe: selectedTribe, country_of_origin: selectedCountry })
        .eq('id', user?.id)
        .select()
        .single();
      if (error) throw error;
      if (data) setUser(data);
    } catch {}
    finally { setSaving(false); }
  };

  if (!cultureName) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
        <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <ScrollView contentContainerStyle={styles.setupContent} keyboardShouldPersistTaps="handled">

          <LinearGradient
            colors={['#F5A623', '#E8891A']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.setupHero}
          >
            <Text style={styles.setupEmoji}>🌍</Text>
            <Text style={styles.setupHeroTitle}>What's your culture?</Text>
            <Text style={styles.setupHeroSub}>Select your country and tribe to personalise your experience.</Text>
          </LinearGradient>

          {}
          <View style={styles.selectorCard}>
            <View style={styles.selectorHeader}>
              <View style={[styles.selectorIconWrap, selectedCountry && styles.selectorIconDone]}>
                <Ionicons name={selectedCountry ? 'checkmark' : 'globe-outline'} size={16} color={selectedCountry ? '#fff' : '#F5A623'} />
              </View>
              <Text style={styles.selectorTitle}>Country</Text>
            </View>
            <TouchableOpacity
              style={[styles.selectorBtn, selectedCountry && styles.selectorBtnSelected]}
              onPress={() => setShowCountryPicker(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.selectorBtnText, !selectedCountry && styles.selectorBtnPlaceholder]}>
                {selectedCountry || 'Select your country…'}
              </Text>
              <Ionicons name="chevron-down" size={16} color={selectedCountry ? '#F5A623' : '#C4A882'} />
            </TouchableOpacity>
          </View>

          {}
          {selectedCountry ? (
            <View style={styles.selectorCard}>
              <View style={styles.selectorHeader}>
                <View style={[styles.selectorIconWrap, selectedTribe && styles.selectorIconDone]}>
                  <Ionicons name={selectedTribe ? 'checkmark' : 'people-outline'} size={16} color={selectedTribe ? '#fff' : '#F5A623'} />
                </View>
                <Text style={styles.selectorTitle}>Tribe / Ethnicity</Text>
              </View>
              {loadingTribes ? (
                <ActivityIndicator color="#F5A623" style={{ marginTop: 12 }} />
              ) : (
                <TouchableOpacity
                  style={[styles.selectorBtn, selectedTribe && styles.selectorBtnSelected]}
                  onPress={() => setShowTribePicker(true)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.selectorBtnText, !selectedTribe && styles.selectorBtnPlaceholder]}>
                    {selectedTribe || 'Select your tribe…'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={selectedTribe ? '#F5A623' : '#C4A882'} />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.selectorCardDisabled}>
              <View style={styles.selectorHeader}>
                <View style={styles.selectorIconWrap}>
                  <Ionicons name="people-outline" size={16} color="#C4A882" />
                </View>
                <Text style={[styles.selectorTitle, { color: '#C4A882' }]}>Tribe / Ethnicity</Text>
              </View>
              <Text style={styles.selectorHint}>Select a country first</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.saveBtn, (!selectedTribe || saving) && styles.saveBtnDisabled]}
            activeOpacity={0.85}
            onPress={handleSave}
            disabled={!selectedTribe || saving}
          >
            {saving
              ? <ActivityIndicator color="#fff" />
              : <>
                  <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                  <Text style={styles.saveBtnText}>Save & Continue</Text>
                </>
            }
          </TouchableOpacity>

          <Text style={styles.notListedText}>
            Don't see your tribe?{' '}
            <Text style={styles.notListedLink}>Contact us to add it</Text>
          </Text>
        </ScrollView>

        <PickerModal
          visible={showCountryPicker}
          title="Select Country"
          items={countries}
          onSelect={handleSelectCountry}
          onClose={() => setShowCountryPicker(false)}
        />
        <PickerModal
          visible={showTribePicker}
          title="Select Tribe"
          items={tribes}
          onSelect={(t) => { setSelectedTribe(t); setShowTribePicker(false); }}
          onClose={() => setShowTribePicker(false)}
        />

        <BottomTabBar />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.cultureHeader}
          onPress={() => setShowTribePicker(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.cultureName}>{cultureName.toUpperCase()}</Text>
          <Text style={styles.cultureFlag}>{cultureFlag}</Text>
          <View style={styles.editBadge}>
            <Ionicons name="pencil-outline" size={13} color="#F5A623" />
          </View>
        </TouchableOpacity>

        <PickerModal
          visible={showCountryPicker}
          title="Select Country"
          items={countries}
          onSelect={handleSelectCountry}
          onClose={() => setShowCountryPicker(false)}
        />
        <PickerModal
          visible={showTribePicker}
          title="Select Tribe"
          items={tribes}
          onSelect={async (t) => {
            setSelectedTribe(t);
            setShowTribePicker(false);
            setSaving(true);
            try {
              const { data, error } = await supabase
                .from('users')
                .update({ tribe: t, country_of_origin: selectedCountry })
                .eq('id', user?.id)
                .select()
                .single();
              if (error) throw error;
              if (data) setUser(data);
            } catch {}
            finally { setSaving(false); }
          }}
          onClose={() => setShowTribePicker(false)}
        />
        {saving && (
          <View style={styles.savingBanner}>
            <ActivityIndicator size="small" color="#F5A623" />
            <Text style={styles.savingText}>Saving…</Text>
          </View>
        )}

        {filtered.map((cat) => (
          <CategoryCard
            key={cat.key}
            title={cat.title}
            imageSource={(cat as any).imageSource}
            centered
            onDiscover={() => navigation?.navigate(cat.screen)}
          />
        ))}
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:      { flex: 1, backgroundColor: '#FFFDF5' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20, alignItems: 'stretch' },

  cultureHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10, marginBottom: 24, marginTop: 8,
  },
  cultureName: { fontSize: 28, fontWeight: '800', color: '#3B1F00', letterSpacing: 1 },
  cultureFlag: { fontSize: 28 },
  setupContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40, gap: 16 },
  setupHero: { borderRadius: 20, padding: 24, alignItems: 'center', gap: 6, marginBottom: 4 },
  setupEmoji:     { fontSize: 44, marginBottom: 4 },
  setupHeroTitle: { fontSize: 22, fontWeight: '800', color: '#fff', textAlign: 'center' },
  setupHeroSub:   { fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 19 },

  selectorCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 12,
    borderWidth: 1, borderColor: '#F0E6D6',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  selectorCardDisabled: {
    backgroundColor: '#FAFAFA', borderRadius: 16, padding: 16, gap: 8,
    borderWidth: 1, borderColor: '#EEE',
  },
  selectorHeader:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  selectorIconWrap: { width: 30, height: 30, borderRadius: 9, backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center' },
  selectorIconDone: { backgroundColor: '#F5A623' },
  selectorTitle:    { fontSize: 14, fontWeight: '700', color: '#3B1F00' },
  selectorHint:     { fontSize: 12, color: '#C4A882', paddingLeft: 40 },
  selectorBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFFDF5', borderRadius: 10,
    borderWidth: 1, borderColor: '#E0D0B8',
    paddingVertical: 13, paddingHorizontal: 14,
  },
  selectorBtnSelected:     { borderColor: '#F5A623', backgroundColor: '#FFFBF5' },
  selectorBtnText:         { fontSize: 14, fontWeight: '600', color: '#3B1F00' },
  selectorBtnPlaceholder:  { color: '#C4A882', fontWeight: '400' },

  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#F5A623', borderRadius: 14, paddingVertical: 15,
    shadowColor: '#F5A623', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  saveBtnDisabled: { backgroundColor: '#E0C49A', shadowOpacity: 0 },
  saveBtnText:     { color: '#fff', fontWeight: '800', fontSize: 15 },

  notListedText: { textAlign: 'center', fontSize: 12, color: '#A08060' },
  notListedLink: { color: '#F5A623', fontWeight: '700' },

  editBadge: {
    width: 26, height: 26, borderRadius: 8,
    backgroundColor: '#FFF3E0', borderWidth: 1, borderColor: '#F5C070',
    alignItems: 'center', justifyContent: 'center', marginLeft: 4,
  },
  savingBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 8,
  },
  savingText: { fontSize: 12, color: '#A08060', fontWeight: '600' },
});

const modal = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#FFFDF5', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 12, paddingHorizontal: 16, maxHeight: '75%',
  },
  handle:   { width: 40, height: 4, backgroundColor: '#E0D0B8', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  title:    { fontSize: 17, fontWeight: '800', color: '#3B1F00', textAlign: 'center', marginBottom: 14 },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', borderRadius: 12,
    borderWidth: 1, borderColor: '#E0D0B8',
    paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10,
  },
  searchInput: { flex: 1, fontSize: 13, color: '#3B1F00' },
  item: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5EDE0',
  },
  itemText:   { fontSize: 15, color: '#3B1F00', fontWeight: '500' },
  empty:      { alignItems: 'center', paddingTop: 32 },
  emptyText:  { fontSize: 13, color: '#A08060' },
  cancelBtn:  { backgroundColor: '#FFF3E0', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8, marginBottom: 20 },
  cancelText: { fontSize: 14, fontWeight: '700', color: '#3B1F00' },
});