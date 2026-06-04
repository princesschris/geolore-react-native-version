import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import LabeledInput from '../components/LabeledInput';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../components/CustomAlert';

export default function EditProfileScreen({ navigation }: any) {
  const { user, setUser } = useAuth();
  const { showAlert }     = useAlert();

  const [firstName, setFirstName] = useState(user?.first_name ?? '');
  const [lastName,  setLastName]  = useState(user?.last_name  ?? '');
  const [username,  setUsername]  = useState(user?.username   ?? '');
  const [phone,     setPhone]     = useState(user?.phone      ?? '');
  const [loading,   setLoading]   = useState(false);

  const email = user?.email ?? '';

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      showAlert('warning', 'Required fields', 'Please enter your first and last name.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          first_name: firstName.trim(),
          last_name:  lastName.trim(),
          username:   username.trim(),
          phone:      phone.trim(),
        })
        .eq('id', user?.id)
        .select()
        .single();

      if (error) throw error;
      if (data) setUser(data);

      showAlert('success', 'Profile updated!', 'Your changes have been saved successfully.');
      setTimeout(() => navigation?.goBack(), 1500);
    } catch (err: any) {
      showAlert('error', 'Save failed', err.message || 'Could not save changes. Please try again.');
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
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={52} color="#C4A882" />
              </View>
              <TouchableOpacity style={styles.editAvatarBtn}>
                <Ionicons name="pencil" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.form}>
            <LabeledInput label="First Name" value={firstName} onChangeText={setFirstName} autoCapitalize="words" />
            <LabeledInput label="Last Name"  value={lastName}  onChangeText={setLastName}  autoCapitalize="words" />

            <View style={styles.readOnlyWrapper}>
              <Text style={styles.readOnlyLabel}>Email</Text>
              <View style={styles.readOnlyField}>
                <Text style={styles.readOnlyText}>{email}</Text>
                <Ionicons name="lock-closed-outline" size={16} color="#C4A882" />
              </View>
              <Text style={styles.readOnlyHint}>Email cannot be changed here.</Text>
            </View>

            <LabeledInput label="Username"     value={username} onChangeText={setUsername} />
            <LabeledInput label="Phone number" value={phone}    onChangeText={setPhone}    keyboardType="phone-pad" />
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
            activeOpacity={0.8}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="pencil-outline" size={16} color="#fff" />
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12 },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '800', color: '#F5A623', textAlign: 'center' },
  avatarSection: { alignItems: 'center', marginBottom: 28 },
  avatarWrapper: { position: 'relative' },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F5E6CC', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#F5C070' },
  editAvatarBtn: { position: 'absolute', bottom: 2, right: 2, width: 28, height: 28, borderRadius: 14, backgroundColor: '#F5A623', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 32 },
  form: { width: '100%', marginBottom: 24 },
  readOnlyWrapper: { marginBottom: 16 },
  readOnlyLabel: { fontSize: 13, fontWeight: '700', color: '#3B1F00', marginBottom: 6 },
  readOnlyField: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F5F0E8', borderRadius: 10, borderWidth: 1, borderColor: '#E0D0B8', paddingVertical: 13, paddingHorizontal: 14 },
  readOnlyText: { fontSize: 14, color: '#A08060' },
  readOnlyHint: { fontSize: 11, color: '#C4A882', marginTop: 4, fontStyle: 'italic' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#F5A623', paddingVertical: 13, borderRadius: 10, width: '100%' },
  saveBtnDisabled: { backgroundColor: '#E0C49A' },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});