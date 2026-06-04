import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function CategoryCard({
  title,
  imageSource,
  onDiscover,
  centered = false,
}:any) {
 
  if (centered) {
    return (
      <View style={styles.centeredCard}>
        <Text style={styles.centeredTitle}>{title}</Text>
        <TouchableOpacity
          style={styles.centeredBtn}
          activeOpacity={0.8}
          onPress={onDiscover}
        >
          <Text style={styles.discoverText}>Discover</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 339x241 — title top left, image right, button bottom left (Home screen)
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity
          style={styles.discoverBtn}
          activeOpacity={0.8}
          onPress={onDiscover}
        >
          <Text style={styles.discoverText}>Discover</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.right}>
        {imageSource ? (
          <Image source={imageSource} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  
  card: {
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F5C070',
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    width: '100%',
    aspectRatio: 339 / 241,
  },
  left: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    gap: 8,
  },
  right: {
    width: '42%',
    backgroundColor: '#FFE8C2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#3B1F00',
    lineHeight: 20,
  },
  image: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain',
  },
  imagePlaceholder: {
    width: '80%',
    height: '80%',
    backgroundColor: '#F5C070',
    borderRadius: 12,
    opacity: 0.4,
  },
  discoverBtn: {
    backgroundColor: '#F5A623',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  discoverText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  // ── YourCulture card: 339x138 ────────────────────────────────────────────────
  centeredCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F5C070',
    marginBottom: 12,
    width: '100%',
    minHeight: 138,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 8,
  },
  centeredTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#3B1F00',
    textAlign: 'center',
  },
  centeredBtn: {
    backgroundColor: '#F5A623',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
  },
});