import React, { useState } from 'react';
import {
  View, Image, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import LabeledInput from '../components/LabeledInput';
import CountryPicker from '../components/CountryPicker';
import { Country } from '../data/countries';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

export default function WhereAreYouFromScreen({ navigation }: any) {
  const [countryOfOrigin, setCountryOfOrigin] = useState<Country | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Country | null>(null);
  const [tribe,           setTribe]           = useState('');
  const [loading,         setLoading]         = useState(false);

  const { user, setUser } = useAuth();

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
          tribe:             tribe.trim(),
          current_location:  currentLocation?.name ?? null,
        })
        .eq('id', user?.id)
        .select()
        .single();

      if (error) throw error;

      // Update AuthContext with new profile data
      if (data) setUser(data);

      // Navigate to Home — culture data is now in AuthContext,
      // YourCultureScreen will read it directly from there
      navigation?.navigate('Home');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not save your details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          <LabeledInput
            label="Tribe / Ethnicity"
            value={tribe}
            onChangeText={setTribe}
            autoCapitalize="words"
          />
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
  form:               { width: '100%' },
  doneButton: {
    backgroundColor: '#F5A623', paddingVertical: 13,
    borderRadius: 10, alignItems: 'center', marginTop: 8, width: '100%',
  },
  doneButtonDisabled: { backgroundColor: '#E0C49A' },
  doneButtonText:     { color: '#fff', fontSize: 15, fontWeight: '700' },
});