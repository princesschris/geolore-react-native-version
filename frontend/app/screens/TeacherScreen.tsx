import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ScrollView, ActivityIndicator, Alert, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import ReviewCard from '../components/ReviewCard';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

interface Review {
  id:            string;
  reviewer_name: string;
  rating:        number;
  review:        string;
  helpful_count: number;
  created_at:    string;
}

const StarRating = ({ rating = 0 }: { rating: number }) => (
  <View style={styles.starsRow}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Ionicons key={i} name={i < rating ? 'star' : 'star-outline'} size={16} color="#F5A623" />
    ))}
  </View>
);

const TappableStars = ({ rating, onRate }: { rating: number; onRate: (r: number) => void }) => (
  <View style={styles.starsRow}>
    {Array.from({ length: 5 }).map((_, i) => (
      <TouchableOpacity key={i} onPress={() => onRate(i + 1)}>
        <Ionicons name={i < rating ? 'star' : 'star-outline'} size={28} color="#F5A623" />
      </TouchableOpacity>
    ))}
  </View>
);

export default function TeacherScreen({ navigation, route }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [reviews,     setReviews]     = useState<Review[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [submitting,  setSubmitting]  = useState(false);
  const [myRating,    setMyRating]    = useState(0);
  const [myReview,    setMyReview]    = useState('');
  const [showForm,    setShowForm]    = useState(false);
  const { user } = useAuth();

  const teacher = route?.params?.teacher ?? {
    id: null, name: 'Tutor', location: 'Unknown',
    rating: 0, pricePerHr: 0, registeredStudents: 0,
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear().toString().slice(-2)}`;
  };

  const fetchReviews = async () => {
    if (!teacher.id) { setLoading(false); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('tutor_id', teacher.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setReviews(data ?? []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [teacher.id]);

  const handleHelpful = async (reviewId: string, currentCount: number) => {
    setReviews((prev) =>
      prev.map((r) => r.id === reviewId ? { ...r, helpful_count: r.helpful_count + 1 } : r)
    );
    await supabase.from('reviews').update({ helpful_count: currentCount + 1 }).eq('id', reviewId);
  };

  const handleSubmitReview = async () => {
    if (myRating === 0) { Alert.alert('Rating required', 'Please tap a star to rate.'); return; }
    if (!myReview.trim()) { Alert.alert('Review required', 'Please write a short review.'); return; }
    if (!user?.id || !teacher.id) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        tutor_id:      teacher.id,
        reviewer_id:   user.id,
        reviewer_name: `${user.first_name} ${user.last_name}`,
        rating:        myRating,
        review:        myReview.trim(),
      });
      if (error) throw error;
      setMyRating(0);
      setMyReview('');
      setShowForm(false);
      fetchReviews();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
    : teacher.rating ?? 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF5" />

      <View style={styles.topBar}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search" />
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="person-outline" size={20} color="#5C3A00" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation?.navigate('Notifications')}>
          <Ionicons name="notifications-outline" size={20} color="#5C3A00" />
        </TouchableOpacity>
      </View>

      <BuntingBanner />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={48} color="#C4A882" />
          </View>
          <Text style={styles.teacherName}>{teacher.name}</Text>
          <StarRating rating={avgRating} />
          <Text style={styles.studentCount}>{teacher.registeredStudents ?? 0} registered students</Text>
          <Text style={styles.location}>Based in {teacher.location} {teacher.flag ?? ''}</Text>

          {/* Languages */}
          {(teacher.languages ?? []).length > 0 && (
            <View style={styles.languagesRow}>
              {teacher.languages.map((lang: string) => (
                <View key={lang} style={styles.langBadge}>
                  <Text style={styles.langBadgeText}>{lang}</Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.price}>${teacher.pricePerHr}/hr</Text>

          <TouchableOpacity
            style={styles.bookButton}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('BookAppointment', { teacher })}
          >
            <Text style={styles.bookButtonText}>Book Appointment</Text>
          </TouchableOpacity>
        </View>

        {/* Reviews header */}
        <View style={styles.reviewsHeader}>
          <Text style={styles.reviewsTitle}>REVIEWS</Text>
          <TouchableOpacity
            style={styles.addReviewBtn}
            onPress={() => setShowForm(!showForm)}
            activeOpacity={0.8}
          >
            <Ionicons name={showForm ? 'close' : 'add'} size={16} color="#fff" />
            <Text style={styles.addReviewBtnText}>{showForm ? 'Cancel' : 'Leave a review'}</Text>
          </TouchableOpacity>
        </View>

        {/* Review form */}
        {showForm && (
          <View style={styles.reviewForm}>
            <Text style={styles.reviewFormLabel}>Your rating</Text>
            <TappableStars rating={myRating} onRate={setMyRating} />
            <Text style={styles.reviewFormLabel}>Your review</Text>
            <TextInput
              style={styles.reviewInput}
              placeholder="Share your experience..."
              placeholderTextColor="#C4A882"
              value={myReview}
              onChangeText={setMyReview}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[styles.submitReviewBtn, submitting && styles.submitReviewBtnDisabled]}
              onPress={handleSubmitReview}
              disabled={submitting}
              activeOpacity={0.8}
            >
              {submitting
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={styles.submitReviewBtnText}>Submit Review</Text>
              }
            </TouchableOpacity>
          </View>
        )}

        {/* Reviews list */}
        {loading ? (
          <ActivityIndicator color="#F5A623" style={{ marginTop: 24 }} />
        ) : reviews.length === 0 ? (
          <View style={styles.noReviews}>
            <Text style={styles.noReviewsText}>No reviews yet. Be the first!</Text>
          </View>
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              reviewerName={review.reviewer_name}
              date={formatDate(review.created_at)}
              rating={review.rating}
              review={review.review}
              helpfulCount={review.helpful_count}
              onHelpful={() => handleHelpful(review.id, review.helpful_count)}
            />
          ))
        )}
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10, gap: 10 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 28 },
  profileCard: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E0D0B8', padding: 20, alignItems: 'center', marginBottom: 24, gap: 6 },
  avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#F5E6CC', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  teacherName: { fontSize: 22, fontWeight: '800', color: '#3B1F00' },
  starsRow: { flexDirection: 'row', gap: 4 },
  studentCount: { fontSize: 12, color: '#A08060' },
  location: { fontSize: 12, color: '#A08060' },
  price: { fontSize: 16, fontWeight: '800', color: '#F5A623' },
  languagesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginVertical: 4 },
  langBadge: { backgroundColor: '#FFF3E0', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#F5C070' },
  langBadgeText: { fontSize: 11, fontWeight: '700', color: '#5C3A00' },
  bookButton: { backgroundColor: '#F5A623', paddingVertical: 11, paddingHorizontal: 32, borderRadius: 10, marginTop: 6 },
  bookButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  reviewsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  reviewsTitle: { fontSize: 16, fontWeight: '800', color: '#3B1F00', letterSpacing: 1.5 },
  addReviewBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F5A623', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10 },
  addReviewBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  reviewForm: { backgroundColor: '#FFF3E0', borderRadius: 14, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#F5C070', gap: 10 },
  reviewFormLabel: { fontSize: 13, fontWeight: '700', color: '#3B1F00' },
  reviewInput: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#E0D0B8', padding: 12, fontSize: 13, color: '#3B1F00', minHeight: 90 },
  submitReviewBtn: { backgroundColor: '#3B1F00', borderRadius: 10, paddingVertical: 11, alignItems: 'center' },
  submitReviewBtnDisabled: { backgroundColor: '#8B6F4E' },
  submitReviewBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  noReviews: { alignItems: 'center', paddingVertical: 24 },
  noReviewsText: { fontSize: 13, color: '#A08060', fontStyle: 'italic' },
});