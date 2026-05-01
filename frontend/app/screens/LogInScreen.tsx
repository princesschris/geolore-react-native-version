import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import LabeledInput from '../components/LabeledInput';

const GoogleIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 48 48">
    <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </Svg>
);

export default function LoginScreen({ navigation }:any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    navigation?.navigate('GetStarted');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Tiger Mascot */}
        <View style={styles.mascotPlaceholder}>
          <Text style={styles.mascotEmoji}>🐯</Text>
        </View>

        <Text style={styles.title}>Welcome Back</Text>

        <View style={styles.form}>
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

          <TouchableOpacity
            style={styles.forgotWrapper}
            onPress={() => navigation?.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            activeOpacity={0.8}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
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

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation?.navigate('Register')}>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDF5',
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 48,
  },
  mascotPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  mascotEmoji: {
    fontSize: 68,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F5A623',
    marginBottom: 28,
    marginTop: 6,
  },
  form: {
    width: '100%',
  },
  forgotWrapper: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -8,
  },
  forgotText: {
    fontSize: 12,
    color: '#F5A623',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#F5A623',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0D0B8',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#A08060',
    fontSize: 12,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#E0D0B8',
    borderRadius: 10,
    paddingVertical: 11,
    marginBottom: 24,
    backgroundColor: '#fff',
  },
  googleButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 12,
    color: '#A08060',
  },
  registerLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F5A623',
  },
});