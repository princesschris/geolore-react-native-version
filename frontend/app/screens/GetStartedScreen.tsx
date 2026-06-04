import React from 'react';
import {View,Text, Image,TouchableOpacity,StyleSheet, SafeAreaView,  StatusBar} from 'react-native';

export default function GetStartedScreen({ navigation }:any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <View style={styles.container}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.tagline}>
         Where Heritage lives, breathes and speaks - through stories passed down, memeories held close and traditions that never fade
        </Text>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => navigation?.navigate('WhereAreYouFrom')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
    paddingHorizontal: 36,
    // paddingBottom: 48,
  },
   logo: {
  width: 240,
  height: 240,
  // resizeMode: 'contain',
},
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#E87D0D',
    marginBottom: 16,
  },
  tagline: {
    fontSize: 13,
    color: '#A08060',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 20,
    maxWidth: 280,
  },
  button: {
    backgroundColor: '#F5A623',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 12,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});