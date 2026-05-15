import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function FashionCard({ title, description, imageSource, onView }:any) {
  return (
    <View style={styles.card}>
      {/* Image */}
      <View style={styles.imageWrapper}>
        {imageSource ? (
          <Image source={imageSource} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={4}>{description}</Text>
        <TouchableOpacity style={styles.viewBtn} activeOpacity={0.8} onPress={onView}>
          <Text style={styles.viewBtnText}>View</Text>
        </TouchableOpacity>
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
    marginBottom: 14,
    flexDirection: 'row',
    overflow: 'hidden',
    minHeight: 140,
  },
  imageWrapper: {
    width: '42%',
    backgroundColor: '#FFE8C2',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#F5C070',
    opacity: 0.4,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#3B1F00',
    marginBottom: 4,
  },
  description: {
    fontSize: 11,
    color: '#7A5C3A',
    lineHeight: 17,
    flex: 1,
    marginBottom: 8,
  },
  viewBtn: {
    backgroundColor: '#F5A623',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  viewBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});