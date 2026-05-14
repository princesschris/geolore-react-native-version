import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';

export default function ImageCard({ title, imageSource, onPress, width, height = 110 }:any) {
  return (
    <TouchableOpacity
      style={[styles.card, { width, height }]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      {imageSource ? (
        <ImageBackground
          source={imageSource}
          style={styles.image}
          imageStyle={styles.imageBorderRadius}
        >
          {/* Dark overlay */}
          <View style={styles.overlay} />
          <Text style={styles.title}>{title}</Text>
        </ImageBackground>
      ) : (
        // Placeholder when no image
        <View style={[styles.image, styles.placeholder]}>
          <View style={styles.overlay} />
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 8,
  },
  imageBorderRadius: {
    borderRadius: 12,
  },
  placeholder: {
    backgroundColor: '#C4A882',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.42)',
    borderRadius: 12,
  },
  title: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 16,
    zIndex: 1,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});