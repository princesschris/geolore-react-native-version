import React from 'react';
import {
  View, Text, TouchableOpacity,StyleSheet,SafeAreaView,StatusBar,Dimensions,Image} from 'react-native';

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }:any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <View style={styles.container}>
        <Image source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>GeoLore</Text>
          
        <Text style={styles.tagline}>
          Where heritage lives, breathes and speaks
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('Login')}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('Register')}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDF5',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    // paddingTop: 80,
    // paddingBottom: 48,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#E87D0D',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  tagline: {
    fontSize: 13,
    color: '#A08060',
    textAlign: 'center',
    lineHeight: 20,
    // marginBottom: 30,
    maxWidth: 260,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#F5A623',
    paddingVertical: 13,
    borderRadius: 10,
    // borderColor:'#f5a623',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  logo: {
  width: 240,
  height: 240,
  // resizeMode: 'contain',
},
});