import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import BottomTabBar from '../components/BottomTabBar';
import BuntingBanner from '../components/BuntingBanner';
import ClassCard from '../components/ClassCard';

// Sample classes data — replace with your API/data source
const CLASSES = [
  {
    id: '1',
    teacherName: 'Chinazom',
    timeFrom: '2:00pm',
    timeTo: '4:00pm',
    teacher: { name: 'Chinazom', location: 'Japan', rating: 3, pricePerHr: 50 },
  },
  {
    id: '2',
    teacherName: 'Chielotam',
    timeFrom: '3:00pm',
    timeTo: '5:00pm',
    teacher: { name: 'Chielotam', location: 'Nigeria', rating: 4, pricePerHr: 40 },
  },
  {
    id: '3',
    teacherName: 'Chianzom Aduradu',
    timeFrom: '11:00Am',
    timeTo: '12:00pm',
    teacher: { name: 'Chianzom Aduradu', location: 'Nigeria', rating: 5, pricePerHr: 60 },
  },
];

export default function ClassesScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Home');

  const filteredClasses = CLASSES.filter((c) =>
    c.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {/* Title */}
        <Text style={styles.title}>CLASSES</Text>

        {/* Class Cards */}
        {filteredClasses.length > 0 ? (
          filteredClasses.map((cls) => (
            <ClassCard
              key={cls.id}
              teacherName={cls.teacher.name}
              timeFrom={cls.timeFrom}
              timeTo={cls.timeTo}
              onViewDetails={() =>
                navigation?.navigate('ClassInfo', {
                  tutorName: cls.teacher.name,
                  timeFrom: cls.timeFrom,
                  timeTo: cls.timeTo,
                  payment: `$${cls.teacher?.pricePerHr ?? 40}`,
                })
              }
            />
          ))
        ) : (
          navigation?.navigate('NoClasses')
        )}
      </ScrollView>

      <BottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFDF5' },
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
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3B1F00',
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#A08060',
    fontWeight: '600',
  },
});