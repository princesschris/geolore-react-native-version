import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import TopBar from '../components/TopBar';

const MEMBERS = [
  { id: '1', name: 'Chinazom' },
  { id: '2', name: 'Chielotam' },
  { id: '3', name: 'Ella' },
  { id: '4', name: 'Princess' },
  { id: '5', name: 'Angela' },
];

// Selected member avatars shown at top
const SelectedAvatars = ({ selectedIds, members }) => {
  const selected = members.filter((m) => selectedIds.includes(m.id));
  return (
    <View style={styles.selectedRow}>
      {selected.map((m) => (
        <View key={m.id} style={styles.selectedAvatar}>
          <Ionicons name="person" size={18} color="#C4A882" />
          <Text style={styles.selectedName} numberOfLines={1}>{m.name}</Text>
        </View>
      ))}
    </View>
  );
};

export default function NewGroupScreen({ navigation }) {
  const [groupName, setGroupName] = useState('');
  const [selected, setSelected] = useState(['2', '5']); // Chielotam & Angela pre-selected

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (!groupName.trim()) return;
    navigation?.navigate('GroupChat', { name: groupName });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <TopBar showSearch={false} />
      <BuntingBanner />

      {/* Group image + name input */}
      <View style={styles.groupSetup}>
        <TouchableOpacity style={styles.cameraBtn}>
          <Ionicons name="camera-outline" size={28} color="#F5A623" />
        </TouchableOpacity>
        <View style={styles.nameInputWrapper}>
          <TextInput
            style={styles.nameInput}
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Enter group name"
            placeholderTextColor="#C4B49A"
          />
        </View>
      </View>

      {/* Selected member avatars */}
      <SelectedAvatars selectedIds={selected} members={MEMBERS} />

      {/* Member list */}
      <FlatList
        data={MEMBERS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = selected.includes(item.id);
          return (
            <TouchableOpacity
              style={[styles.memberRow, isSelected && styles.memberRowSelected]}
              onPress={() => toggleSelect(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.memberAvatar}>
                <Ionicons name="person" size={22} color={isSelected ? '#F5A623' : '#C4A882'} />
              </View>
              <Text style={[styles.memberName, isSelected && styles.memberNameSelected]}>
                {item.name}
              </Text>
              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Create button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.createBtn, !groupName.trim() && styles.createBtnDisabled]}
          activeOpacity={0.8}
          onPress={handleCreate}
          disabled={!groupName.trim()}
        >
          <Text style={styles.createBtnText}>Create Group</Text>
        </TouchableOpacity>
      </View>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  groupSetup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  cameraBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#F5C070',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameInputWrapper: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#F5C070',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  nameInput: {
    fontSize: 14,
    color: '#3B1F00',
  },
  selectedRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
    flexWrap: 'wrap',
  },
  selectedAvatar: {
    alignItems: 'center',
    gap: 4,
  },
  selectedAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF3E0',
    borderWidth: 1.5,
    borderColor: '#F5A623',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedName: {
    fontSize: 10,
    color: '#F5A623',
    fontWeight: '600',
    maxWidth: 50,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E6D6',
    gap: 12,
  },
  memberRowSelected: {
    backgroundColor: '#FFF8F0',
  },
  memberAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F5E6CC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F5C070',
  },
  memberName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#3B1F00',
  },
  memberNameSelected: {
    color: '#F5A623',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#C4A882',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#F5A623',
    borderColor: '#F5A623',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0D0B8',
  },
  createBtn: {
    backgroundColor: '#F5A623',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  createBtnDisabled: { backgroundColor: '#F5C070' },
  createBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});