import React, { useState, useEffect } from 'react';
import {
  View, Image, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, ActivityIndicator,
  Alert, Modal, FlatList, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LabeledInput from '../components/LabeledInput';
import CountryPicker from '../components/CountryPicker';
import { Country } from '../../data/countries';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

function TribePickerModal({
  visible, tribes, onSelect, onClose,
}: {
  visible: boolean;
  tribes: string[];
  onSelect: (t: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const filtered = query.trim()
    ? tribes.filter((t) => t.toLowerCase().includes(query.toLowerCase()))
    : tribes;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={modal.overlay}>
        <View style={modal.sheet}>
          <View style={modal.handle} />
          <Text style={modal.title}>Select Tribe / Ethnicity</Text>

          <View style={modal.searchWrap}>
            <Ionicons name="search-outline" size={16} color="#A08060" />
            <TextInput
              style={modal.searchInput}
              placeholder="Search tribes…"
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

export default function WhereAreYouFromScreen({ navigation, route }: any) {
  const nextScreen = route?.params?.nextScreen ?? 'Home';
  const [countryOfOrigin, setCountryOfOrigin] = useState<Country | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Country | null>(null);
  const [tribe,           setTribe]           = useState('');
  const [loading,         setLoading]         = useState(false);

  const [availableTribes,  setAvailableTribes]  = useState<string[]>([]);
  const [loadingTribes,    setLoadingTribes]    = useState(false);
  const [showTribePicker,  setShowTribePicker]  = useState(false);

  const { user, setUser } = useAuth();

  useEffect(() => {
    if (!countryOfOrigin) { setAvailableTribes([]); setTribe(''); return; }
    const fetch = async () => {
      setLoadingTribes(true);
      setTribe(''); 
      const { data } = await supabase
        .from('tribes')
        .select('tribe')
        .eq('country', countryOfOrigin.name)
        .order('tribe');
      setAvailableTribes((data ?? []).map((r: any) => r.tribe));
      setLoadingTribes(false);
    };
    fetch();
  }, [countryOfOrigin?.name]);

  const handleDone = async () => {
    if (!countryOfOrigin) {
      Alert.alert('Required', 'Please select your country of origin.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          country_of_origin: countryOfOrigin.name,
          country_flag:      countryOfOrigin.flag,
          tribe:             tribe.trim() || null,
          current_location:  currentLocation?.name ?? null,
        })
        .eq('id', user?.id)
        .select()
        .single();
      if (error) throw error;
      if (data) setUser(data);
      navigation?.navigate(nextScreen);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not save your details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const hasTribes     = availableTribes.length > 0;
  const noTribesInDB  = countryOfOrigin && !loadingTribes && availableTribes.length === 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Where are you{'\n'}from?</Text>

        <Image source={require('../../assets/images/flags.jpeg')} style={styles.flagsImage} />

        <View style={styles.form}>
          <CountryPicker
            label="Country of origin"
            selected={countryOfOrigin}
            onSelect={setCountryOfOrigin}
          />
          <Text style={styles.fieldLabel}>Tribe / Ethnicity</Text>

          {loadingTribes ? (
            <View style={styles.tribeLoadingRow}>
              <ActivityIndicator size="small" color="#F5A623" />
              <Text style={styles.tribeLoadingText}>Loading tribes…</Text>
            </View>
          ) : hasTribes ? (
            <TouchableOpacity
              style={[styles.tribePicker, tribe && styles.tribePickerSelected]}
              onPress={() => setShowTribePicker(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tribePickerText, !tribe && styles.tribePickerPlaceholder]}>
                {tribe || 'Select your tribe…'}
              </Text>
              <Ionicons name="chevron-down" size={16} color={tribe ? '#F5A623' : '#C4A882'} />
            </TouchableOpacity>
          ) : (
            
            <LabeledInput
              value={tribe}
              onChangeText={setTribe}
              autoCapitalize="words"
              placeholder={noTribesInDB ? `e.g. Enter your tribe in ${countryOfOrigin?.name}` : 'e.g. Igbo, Yoruba, Hausa…'}
            />
          )}

   
          <CountryPicker
            label="Current Location"
            selected={currentLocation}
            onSelect={setCurrentLocation}
          />
        </View>

        <TouchableOpacity
          style={[styles.doneButton, loading && styles.doneButtonDisabled]}
          activeOpacity={0.8}
          onPress={handleDone}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.doneButtonText}>Done</Text>
          }
        </TouchableOpacity>
      </ScrollView>

      <TribePickerModal
        visible={showTribePicker}
        tribes={availableTribes}
        onSelect={(t) => { setTribe(t); setShowTribePicker(false); }}
        onClose={() => setShowTribePicker(false)}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea:      { flex: 1, backgroundColor: '#FFFDF5' },
  scrollContent: { alignItems: 'center', paddingHorizontal: 28, paddingTop: 40, paddingBottom: 48 },
  title: {
    fontSize: 26, fontWeight: '800', color: '#E87D0D',
    textAlign: 'center', marginBottom: 24, lineHeight: 34,
  },
  flagsImage: {
    width: '100%', height: 220, borderRadius: 16,
    resizeMode: 'cover', marginBottom: 32,
  },
  form: { width: '100%', gap: 4 },

  fieldLabel: { fontSize: 13, fontWeight: '700', color: '#3B1F00', marginBottom: 6, marginTop: 12 },

  tribeLoadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14 },
  tribeLoadingText: { fontSize: 13, color: '#A08060' },

  tribePicker: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFF3E0', borderRadius: 10,
    borderWidth: 1, borderColor: '#E0D0B8',
    paddingVertical: 13, paddingHorizontal: 14, marginBottom: 4,
  },
  tribePickerSelected:     { borderColor: '#F5A623', backgroundColor: '#FFFBF5' },
  tribePickerText:         { fontSize: 14, fontWeight: '600', color: '#3B1F00' },
  tribePickerPlaceholder:  { color: '#C4A882', fontWeight: '400' },

  doneButton: {
    backgroundColor: '#F5A623', paddingVertical: 13,
    borderRadius: 10, alignItems: 'center', marginTop: 24, width: '100%',
  },
  doneButtonDisabled: { backgroundColor: '#E0C49A' },
  doneButtonText:     { color: '#fff', fontSize: 15, fontWeight: '700' },
});
const modal = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#FFFDF5', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 12, paddingHorizontal: 16, maxHeight: '75%',
  },
  handle: { width: 40, height: 4, backgroundColor: '#E0D0B8', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  title:  { fontSize: 17, fontWeight: '800', color: '#3B1F00', textAlign: 'center', marginBottom: 14 },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', borderRadius: 12,
    borderWidth: 1, borderColor: '#E0D0B8',
    paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10,
  },
  searchInput:  { flex: 1, fontSize: 13, color: '#3B1F00' },
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