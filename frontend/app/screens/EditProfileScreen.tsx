import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';
import LabeledInput from '../components/LabeledInput';

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState('Chinasom');
  const [email, setEmail] = useState('chelotam@gmail.com');
  const [username, setUsername] = useState('Ebootie');
  const [password, setPassword] = useState('••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('+234 9160 927 25');

  const handleSave = () => {
    // Add your save logic here
    navigation?.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation?.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={22} color="#5C3A00" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              {/* Replace with actual image:
              <Image source={require('../../assets/images/avatar.png')} style={styles.avatar} /> */}
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={52} color="#C4A882" />
              </View>
              {/* Edit icon */}
              <TouchableOpacity style={styles.editAvatarBtn}>
                <Ionicons name="pencil" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <LabeledInput
              label="Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
            <LabeledInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <LabeledInput
              label="Username"
              value={username}
              onChangeText={setUsername}
            />
            <LabeledInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              showToggle
              isPasswordVisible={showPassword}
              onToggleShow={() => setShowPassword(!showPassword)}
            />
            <LabeledInput
              label="Phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveBtn}
            activeOpacity={0.8}
            onPress={handleSave}
          >
            <Ionicons name="pencil-outline" size={16} color="#fff" />
            <Text style={styles.saveBtnText}>Save Changes</Text>
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: '#F5A623',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 36,
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'cover',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5E6CC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F5C070',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5A623',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },

  // Form
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
  },
  form: {
    width: '100%',
    marginBottom: 24,
  },

  // Save button
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F5A623',
    paddingVertical: 13,
    borderRadius: 10,
    width: '100%',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});