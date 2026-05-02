import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import ReviewCard from '../components/ReviewCard';

const StarRating = ({ rating = 3 }) => (
  <View style={styles.starsRow}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Ionicons
        key={i}
        name={i < rating ? 'star' : 'star-outline'}
        size={16}
        color="#F5A623"
      />
    ))}
  </View>
);

// Sample reviews — replace with your API data
const REVIEWS = [
  {
    id: '1',
    reviewerName: 'Aduradu Chinazom',
    date: '17/04/26',
    rating: 5,
    review:
      'I really liked her, she and kind, my only issue is that she was a little late too our session',
    helpfulCount: 10,
  },
  {
    id: '2',
    reviewerName: 'Chris-Ugachukwu Princess',
    date: '17/04/26',
    rating: 4,
    review:
      'Great teacher! Very patient and explains concepts clearly. Would definitely book again.',
    helpfulCount: 6,
  },
  {
    id: '3',
    reviewerName: 'Emeka Okafor',
    date: '15/04/26',
    rating: 5,
    review:
      'Absolutely wonderful experience. She made learning so much fun and engaging.',
    helpfulCount: 8,
  },
];

export default function TeacherScreen({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Home');

  // Teacher details passed from LanguagesScreen
  const teacher = route?.params?.teacher ?? {
    name: 'Amaka',
    location: 'Nigeria',
    rating: 3,
    pricePerHr: 50,
    registeredStudents: 22,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search"
        />
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="person-outline" size={20} color="#5C3A00" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <View>
            <Ionicons name="notifications-outline" size={20} color="#5C3A00" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>5</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Bunting Banner */}
      <BuntingBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Teacher Profile Card */}
        <View style={styles.profileCard}>
          {/* Avatar */}
          {teacher.imageSource ? (
            <Image source={teacher.imageSource} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={48} color="#C4A882" />
            </View>
          )}

          {/* Name & Rating */}
          <Text style={styles.teacherName}>{teacher.name}</Text>
          <StarRating rating={teacher.rating} />
          <Text style={styles.studentCount}>
            {teacher.registeredStudents ?? 22} registered students
          </Text>
          <Text style={styles.location}>Based in {teacher.location}</Text>

          {/* Book Appointment Button */}
          <TouchableOpacity
            style={styles.bookButton}
            activeOpacity={0.8}
            onPress={() =>
              navigation?.navigate('BookAppointment', { teacher })
            }
          >
            <Text style={styles.bookButtonText}>Book Appointment</Text>
          </TouchableOpacity>
        </View>

        {/* Reviews Section */}
        <Text style={styles.reviewsTitle}>REVIEWS</Text>

        {REVIEWS.map((review) => (
          <ReviewCard
            key={review.id}
            reviewerName={review.reviewerName}
            date={review.date}
            rating={review.rating}
            review={review.review}
            helpfulCount={review.helpfulCount}
          />
        ))}

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation?.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={16} color="#fff" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <BottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDF5',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    gap: 10,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#F5A623',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0D0B8',
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    resizeMode: 'cover',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F5E6CC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  teacherName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3B1F00',
    marginBottom: 6,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: 6,
  },
  studentCount: {
    fontSize: 12,
    color: '#A08060',
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: '#A08060',
    marginBottom: 16,
  },
  bookButton: {
    backgroundColor: '#F5A623',
    paddingVertical: 11,
    paddingHorizontal: 32,
    borderRadius: 10,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  reviewsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3B1F00',
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F5A623',
    paddingVertical: 12,
    borderRadius: 10,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginTop: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});