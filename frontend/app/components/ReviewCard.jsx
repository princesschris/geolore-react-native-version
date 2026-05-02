import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StarRating = ({ rating = 5 }) => (
  <View style={styles.starsRow}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Ionicons
        key={i}
        name={i < rating ? 'star' : 'star-outline'}
        size={12}
        color="#F5A623"
      />
    ))}
  </View>
);

export default function ReviewCard({ reviewerName, date, rating, review, helpfulCount }) {
  const [helpful, setHelpful] = useState(null);

  return (
    <View style={styles.card}>
      {/* Reviewer Info */}
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={20} color="#C4A882" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.reviewerName}>{reviewerName}</Text>
          <StarRating rating={rating} />
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>

      {/* Review Text */}
      <Text style={styles.reviewText}>{review}</Text>

      {/* Helpful Row */}
      <View style={styles.helpfulRow}>
        <Text style={styles.helpfulLabel}>
          {helpfulCount} people found this helpful
        </Text>
        <TouchableOpacity
          style={[styles.helpfulBtn, helpful === true && styles.helpfulBtnActive]}
          onPress={() => setHelpful(true)}
        >
          <Text style={[styles.helpfulBtnText, helpful === true && styles.helpfulBtnTextActive]}>
            Yes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.helpfulBtn, helpful === false && styles.helpfulBtnActive]}
          onPress={() => setHelpful(false)}
        >
          <Text style={[styles.helpfulBtnText, helpful === false && styles.helpfulBtnTextActive]}>
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0D0B8',
    padding: 14,
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5E6CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3B1F00',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  date: {
    fontSize: 11,
    color: '#A08060',
  },
  reviewText: {
    fontSize: 12,
    color: '#5C4A30',
    lineHeight: 19,
    marginBottom: 10,
  },
  helpfulRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  helpfulLabel: {
    flex: 1,
    fontSize: 11,
    color: '#A08060',
  },
  helpfulBtn: {
    borderWidth: 1,
    borderColor: '#E0D0B8',
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  helpfulBtnActive: {
    backgroundColor: '#F5A623',
    borderColor: '#F5A623',
  },
  helpfulBtnText: {
    fontSize: 11,
    color: '#A08060',
    fontWeight: '600',
  },
  helpfulBtnTextActive: {
    color: '#fff',
  },
});