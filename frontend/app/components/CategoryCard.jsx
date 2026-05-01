import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function CategoryCard({
  title,
  imageSource,
  onDiscover,
  imageLeft = false,
  centered = false,
}) {
  // Centered style — title and button centered, no image (used in YourCulture)
  if (centered) {
    return (
      <View style={styles.centeredCard}>
        <Text style={styles.centeredTitle}>{title}</Text>
        <TouchableOpacity style={styles.discoverBtn} activeOpacity={0.8} onPress={onDiscover}>
          <Text style={styles.discoverText}>Discover</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Default style — image on left or right
  return (
    <View style={styles.card}>
      {imageLeft ? (
        <>
          <View style={styles.imageWrapper}>
            {imageSource ? (
              <Image source={imageSource} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder} />
            )}
          </View>
          <View style={styles.contentRight}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity style={styles.discoverBtn} activeOpacity={0.8} onPress={onDiscover}>
              <Text style={styles.discoverText}>Discover</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.contentLeft}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity style={styles.discoverBtn} activeOpacity={0.8} onPress={onDiscover}>
              <Text style={styles.discoverText}>Discover</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.imageWrapper}>
            {imageSource ? (
              <Image source={imageSource} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder} />
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Default card (with image)
  card: {
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F5A623',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    overflow: 'hidden',
    minHeight: 120,
  },
  contentLeft: {
    flex: 1,
    paddingRight: 12,
    justifyContent: 'center',
  },
  contentRight: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#3B1F00',
    marginBottom: 12,
    lineHeight: 21,
  },
  imageWrapper: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },
  imagePlaceholder: {
    width: 90,
    height: 90,
    backgroundColor: '#F5C070',
    borderRadius: 12,
    opacity: 0.3,
  },

  // Centered card (no image)
  centeredCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F5A623',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 14,
  },
  centeredTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3B1F00',
    marginBottom: 10,
    textAlign: 'center',
  },

  // Shared
  discoverBtn: {
    backgroundColor: '#F5A623',
    paddingVertical: 7,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignSelf: 'center',
  },
  discoverText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});