// ─────────────────────────────────────────────────────────────────────────────
//  components/CountryPicker.tsx
//
//  Searchable country dropdown with flag emojis.
//  Usage:
//    <CountryPicker
//      label="Country of origin"
//      selected={country}
//      onSelect={(c) => setCountry(c)}
//    />
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COUNTRIES, Country } from '../../data/countries';

interface CountryPickerProps {
  label:    string;
  selected: Country | null;
  onSelect: (country: Country) => void;
}

export default function CountryPicker({ label, selected, onSelect }: CountryPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch]             = useState('');

  const filtered = useMemo(() =>
    COUNTRIES.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  );

  const handleSelect = (country: Country) => {
    onSelect(country);
    setModalVisible(false);
    setSearch('');
  };

  return (
    <>
      {/* Field label */}
      <Text style={styles.label}>{label}</Text>

      {/* Trigger button */}
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.triggerText, !selected && styles.placeholder]}>
          {selected ? `${selected.flag}  ${selected.name}` : `Select ${label}`}
        </Text>
        <Ionicons name="chevron-down-outline" size={18} color="#C4A882" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

          {/* Modal header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select {label}</Text>
            <TouchableOpacity
              onPress={() => { setModalVisible(false); setSearch(''); }}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={22} color="#3B1F00" />
            </TouchableOpacity>
          </View>

          {/* Search bar */}
          <View style={styles.searchRow}>
            <Ionicons name="search-outline" size={18} color="#A08060" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search country..."
              placeholderTextColor="#C4A882"
              value={search}
              onChangeText={setSearch}
              autoFocus
              autoCapitalize="words"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color="#C4A882" />
              </TouchableOpacity>
            )}
          </View>

          {/* Country list */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.code}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.countryRow,
                  selected?.code === item.code && styles.countryRowSelected,
                ]}
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.countryFlag}>{item.flag}</Text>
                <Text style={[
                  styles.countryName,
                  selected?.code === item.code && styles.countryNameSelected,
                ]}>
                  {item.name}
                </Text>
                {selected?.code === item.code && (
                  <Ionicons name="checkmark" size={18} color="#F5A623" />
                )}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No country found for "{search}"</Text>
              </View>
            }
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3B1F00',
    marginBottom: 6,
    marginTop: 4,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0D0B8',
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  triggerText: {
    fontSize: 14,
    color: '#3B1F00',
    fontWeight: '600',
  },
  placeholder: {
    color: '#C4A882',
    fontWeight: '400',
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFDF5',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0D0B8',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#3B1F00',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5E6CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E0D0B8',
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#3B1F00',
    padding: 0,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 20,
    gap: 14,
  },
  countryRowSelected: {
    backgroundColor: '#FEF6E8',
  },
  countryFlag: { fontSize: 24 },
  countryName: {
    flex: 1,
    fontSize: 14,
    color: '#3B1F00',
    fontWeight: '500',
  },
  countryNameSelected: {
    color: '#E67E22',
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0E6D6',
    marginLeft: 58,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 48,
  },
  emptyText: {
    fontSize: 13,
    color: '#A08060',
  },
});