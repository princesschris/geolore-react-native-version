import React, { useState } from 'react';
import {
  Image, View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import LabeledInput from '../components/LabeledInput';
import { registerUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/roles';

const GoogleIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 48 48">
    <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </Svg>
);

const ROLE_OPTIONS: { role: UserRole; label: string; description: string; icon: string }[] = [
  { role: 'student', label: 'Student',   icon: '🎓', description: 'I want to learn about cultures and book language tutors.' },
  { role: 'tutor',   label: 'Tutor',     icon: '📚', description: 'I want to teach my language and manage student sessions.' },
  { role: 'both',    label: 'Both',      icon: '🌍', description: 'I want to learn AND teach. Full access to all features.' },
];

export default function RegisterScreen({ navigation }: any) {
  const [firstName,       setFirstName]       = useState('');
  const [lastName,        setLastName]         = useState('');
  const [email,           setEmail]           = useState('');
  const [confirmEmail,    setConfirmEmail]    = useState('');
  const [username,        setUsername]        = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword,    setShowPassword]    = useState(false);
  const [showConfirmPw,   setShowConfirmPw]   = useState(false);
  const [step,            setStep]            = useState<1 | 2>(1);
  const [selectedRole,    setSelectedRole]    = useState<UserRole | null>(null);
  const [loading,         setLoading]         = useState(false);

  const { setUser } = useAuth();

  const validateStep1 = (): string | null => {
    if (!firstName.trim() || !lastName.trim()) return 'Please enter your full name.';
    if (!email.trim())                          return 'Please enter your email.';
    if (email.trim() !== confirmEmail.trim())   return 'Emails do not match.';
    if (!username.trim())                       return 'Please enter a username.';
    if (password.length < 6)                   return 'Password must be at least 6 characters.';
    if (password !== confirmPassword)           return 'Passwords do not match.';
    return null;
  };

  const handleNextStep = () => {
    const error = validateStep1();
    if (error) { Alert.alert('Please check your details', error); return; }
    setStep(2);
  };

  const handleRegister = async () => {
    if (!selectedRole) {
      Alert.alert('Pick a role', 'Please select how you want to use GeoLore.');
      return;
    }
    setLoading(true);
    try {
      const userDoc = await registerUser(firstName, lastName, email, username, password, selectedRole);
      setUser(userDoc);
      if (selectedRole === 'tutor' || selectedRole === 'both') {
        navigation?.navigate('Requirements');
      } else {
        navigation?.navigate('GetStarted');
      }
    } catch (err: any) {
      let message = 'Something went wrong. Please try again.';
      if (err.message?.includes('already registered')) message = 'That email is already registered. Try logging in.';
      if (err.message?.includes('invalid email'))      message = 'Please enter a valid email address.';
      if (err.message?.includes('weak password') || err.message?.includes('at least 6')) {
        message = 'Password must be at least 6 characters.';
      }
      Alert.alert('Registration failed', err.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      <LabeledInput label="First Name"       value={firstName}       onChangeText={setFirstName}       autoCapitalize="words" />
      <LabeledInput label="Last Name"        value={lastName}        onChangeText={setLastName}        autoCapitalize="words" />
      <LabeledInput label="Email"            value={email}           onChangeText={setEmail}           keyboardType="email-address" />
      <LabeledInput label="Confirm Email"    value={confirmEmail}    onChangeText={setConfirmEmail}    keyboardType="email-address" />
      <LabeledInput label="Username"         value={username}        onChangeText={setUsername} />
      <LabeledInput label="Password"         value={password}        onChangeText={setPassword}
        secureTextEntry showToggle isPasswordVisible={showPassword}
        onToggleShow={() => setShowPassword(!showPassword)} />
      <LabeledInput label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword}
        secureTextEntry showToggle isPasswordVisible={showConfirmPw}
        onToggleShow={() => setShowConfirmPw(!showConfirmPw)} />

      <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8} onPress={handleNextStep}>
        <Text style={styles.primaryBtnText}>Next</Text>
      </TouchableOpacity>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity style={styles.googleButton} activeOpacity={0.8}>
        <GoogleIcon />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <View style={styles.bottomRow}>
        <Text style={styles.bottomText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation?.navigate('Login')}>
          <Text style={styles.bottomLink}>Log In</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.roleHeading}>How will you use GeoLore?</Text>
      <Text style={styles.roleSubheading}>You can always change this later from your profile.</Text>

      {ROLE_OPTIONS.map(({ role, label, description, icon }) => {
        const isSelected = selectedRole === role;
        return (
          <TouchableOpacity
            key={role}
            style={[styles.roleCard, isSelected && styles.roleCardSelected]}
            onPress={() => setSelectedRole(role)}
            activeOpacity={0.8}
          >
            <Text style={styles.roleIcon}>{icon}</Text>
            <View style={styles.roleTextBlock}>
              <Text style={[styles.roleLabel, isSelected && styles.roleLabelSelected]}>{label}</Text>
              <Text style={styles.roleDescription}>{description}</Text>
            </View>
            <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
              {isSelected && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        style={[styles.primaryBtn, (!selectedRole || loading) && styles.primaryBtnDisabled]}
        activeOpacity={0.85}
        onPress={handleRegister}
        disabled={!selectedRole || loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.primaryBtnText}>Create account</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity style={styles.backLink} onPress={() => setStep(1)}>
        <Text style={styles.backLinkText}>← Back</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Image source={require('../../assets/images/tiger.png')} style={styles.mascot} />
        <Text style={styles.title}>Register</Text>

        <View style={styles.stepRow}>
          <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]} />
          <View style={styles.stepLine} />
          <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]} />
        </View>

        <View style={styles.form}>
          {step === 1 ? renderStep1() : renderStep2()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  scrollContent: { alignItems: 'center', paddingHorizontal: 28, paddingTop: 32, paddingBottom: 48 },
  mascot: { width: 130, height: 130, resizeMode: 'contain' },
  title: { fontSize: 24, fontWeight: '800', color: '#F5A623', marginBottom: 12, marginTop: 4 },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E0D0B8' },
  stepDotActive: { backgroundColor: '#F5A623' },
  stepLine: { width: 40, height: 2, backgroundColor: '#E0D0B8', marginHorizontal: 6 },
  form: { width: '100%' },
  primaryBtn: { backgroundColor: '#F5A623', paddingVertical: 13, borderRadius: 10, alignItems: 'center', marginTop: 8, marginBottom: 16 },
  primaryBtnDisabled: { backgroundColor: '#E0C49A' },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E0D0B8' },
  dividerText: { marginHorizontal: 10, color: '#A08060', fontSize: 12 },
  googleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderWidth: 1.5, borderColor: '#E0D0B8', borderRadius: 10, paddingVertical: 11, marginBottom: 20, backgroundColor: '#fff' },
  googleButtonText: { fontSize: 13, fontWeight: '600', color: '#555' },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  bottomText: { fontSize: 12, color: '#A08060' },
  bottomLink: { fontSize: 12, fontWeight: '700', color: '#F5A623' },
  roleHeading: { fontSize: 18, fontWeight: '800', color: '#3B1F00', marginBottom: 6, alignSelf: 'flex-start' },
  roleSubheading: { fontSize: 12, color: '#A08060', marginBottom: 20, alignSelf: 'flex-start' },
  roleCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF3E0', borderRadius: 14, borderWidth: 1.5, borderColor: '#E0D0B8', padding: 14, marginBottom: 12, gap: 12 },
  roleCardSelected: { borderColor: '#F5A623', backgroundColor: '#FEF6E8' },
  roleIcon: { fontSize: 30 },
  roleTextBlock: { flex: 1 },
  roleLabel: { fontSize: 15, fontWeight: '800', color: '#3B1F00', marginBottom: 3 },
  roleLabelSelected: { color: '#E67E22' },
  roleDescription: { fontSize: 12, color: '#7A5C3A', lineHeight: 17 },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#C4A882', alignItems: 'center', justifyContent: 'center' },
  radioOuterSelected: { borderColor: '#F5A623' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#F5A623' },
  backLink: { alignItems: 'center', marginTop: 4 },
  backLinkText: { fontSize: 13, color: '#A08060', fontWeight: '600' },
});