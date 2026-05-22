import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

export default function NewGroupScreen({ navigation }: any) {
  const [groupName, setGroupName] = useState('');
  const [loading,   setLoading]   = useState(false);
  const { user } = useAuth();

  const handleCreate = async () => {
    if (!groupName.trim()) {
      Alert.alert('Required', 'Please enter a group name.');
      return;
    }
    setLoading(true);
    try {
      // Create the group
      const { data: newGroup, error: groupError } = await supabase
        .from('groups')
        .insert({ name: groupName.trim(), created_by: user?.id })
        .select()
        .single();

      if (groupError) throw groupError;

      // Add creator as first member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({ group_id: newGroup.id, user_id: user?.id });

      if (memberError) throw memberError;

      Alert.alert('Group created!', `"${groupName}" is ready.`, [
        {
          text: 'Open chat',
          onPress: () => navigation?.replace('GroupChat', { name: newGroup.name, id: newGroup.id }),
        },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not create group.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back-outline" size={22} color="#5C3A00" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Group</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Group avatar placeholder */}
        <View style={styles.avatarSection}>
          <View style={styles.groupAvatar}>
            <Ionicons name="people" size={52} color="#F5A623" />
          </View>
          <Text style={styles.hint}>Tap to add a group photo</Text>
        </View>

        <Text style={styles.label}>Group name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter group name..."
          placeholderTextColor="#C4A882"
          value={groupName}
          onChangeText={setGroupName}
          autoCapitalize="words"
          maxLength={50}
        />
        <Text style={styles.charCount}>{groupName.length}/50</Text>

        <TouchableOpacity
          style={[styles.createBtn, (!groupName.trim() || loading) && styles.createBtnDisabled]}
          activeOpacity={0.85}
          onPress={handleCreate}
          disabled={!groupName.trim() || loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.createBtnText}>Create Group</Text>
          }
        </TouchableOpacity>
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12 },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '800', color: '#F5A623', textAlign: 'center' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 32, gap: 10 },
  groupAvatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#F5C070' },
  hint: { fontSize: 12, color: '#A08060' },
  label: { fontSize: 13, fontWeight: '700', color: '#3B1F00', marginBottom: 8 },
  input: { backgroundColor: '#FFF3E0', borderRadius: 12, borderWidth: 1, borderColor: '#E0D0B8', paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, color: '#3B1F00', marginBottom: 4 },
  charCount: { fontSize: 11, color: '#C4A882', alignSelf: 'flex-end', marginBottom: 24 },
  createBtn: { backgroundColor: '#F5A623', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  createBtnDisabled: { backgroundColor: '#E0C49A' },
  createBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});