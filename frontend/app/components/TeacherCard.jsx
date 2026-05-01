import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StarRating = ({ rating = 3, max = 5 }) => (
  <View style={styles.starsRow}>
    {Array.from({ length: max }).map((_, i) => (
      <Ionicons
        key={i}
        name={i < rating ? 'star' : 'star-outline'}
        size={13}
        color="#F5A623"
      />
    ))}
  </View>
);

export default function TeacherCard({ name, location, rating, pricePerHr, imageSource, onPress }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.left}>
        {/* Avatar */}
        {imageSource ? (
          <Image source={imageSource} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={28} color="#C4A882" />
          </View>
        )}
      </View>

      <View style={styles.middle}>
        <Text style={styles.meetText}>Meet</Text>
        <Text style={styles.name}>{name}</Text>
        <StarRating rating={rating} />
        <Text style={styles.location}>Based in {location}</Text>
      </View>

      <View style={styles.right}>
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>${pricePerHr} PER/HR</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#F5A623',
    padding: 14,
    marginBottom: 14,
    gap: 12,
  },
  left: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    resizeMode: 'cover',
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5E6CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  middle: {
    flex: 1,
  },
  meetText: {
    fontSize: 11,
    color: '#A08060',
    marginBottom: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3B1F00',
    marginBottom: 3,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 3,
  },
  location: {
    fontSize: 11,
    color: '#A08060',
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  priceBadge: {
    backgroundColor: '#F5A623',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  priceText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
});