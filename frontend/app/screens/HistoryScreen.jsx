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

// Decorative bunting banner component
const BuntingBanner = () => {
  const colors = ['#E74C3C', '#F5A623', '#2ECC71', '#3498DB', '#9B59B6', '#E74C3C', '#F5A623', '#2ECC71'];
  return (
    <View style={bunting.container}>
      {/* String line */}
      <View style={bunting.string} />
      {/* Flags */}
      <View style={bunting.flagsRow}>
        {colors.map((color, i) => (
          <View
            key={i}
            style={[
              bunting.flag,
              { backgroundColor: color, marginLeft: i === 0 ? 0 : -2 },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const bunting = StyleSheet.create({
  container: {
    width: '100%',
    height: 32,
    marginBottom: 8,
    justifyContent: 'flex-start',
  },
  string: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: '#C4A882',
  },
  flagsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    top: 0,
  },
  flag: {
    width: 14,
    height: 20,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    transform: [{ rotate: '0deg' }],
  },
});

export default function HistoryScreen({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Home');

  // Culture name can be passed via route params
  const cultureName = route?.params?.culture ?? 'IGBO';

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
        <Text style={styles.title}>HISTORY</Text>

        {/* History Image Card */}
        <View style={styles.imageCard}>
          {/* Replace with your actual history image */}
          {/* <Image source={require('../assets/history-main.png')} style={styles.historyImage} /> */}
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={48} color="#C4A882" />
          </View>
        </View>

        {/* History Body Text */}
        <Text style={styles.bodyText}>
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Nla dolorem quis ipsa.
          Consequatur odio ulam maxime aliquam qque, quaerat, ducimus, expedita dolores a
          msque reiciendistus reprehenderit? Officia, repellat nihil cum corporis delectus minus
          nostrum dolorum optio sunt soli quia a modi velit ex blanditiis libero atque, cumque.
          T Nihil eus raque aspectores ipsam aperiam rem sequi nihil perferendis laborum quod
          distinctio. Odio quod, deserunt aliquid totam nulla malesuada represendes eget
          voluptas? Perspiciatis unde quisquam repettat okey minima. Laboriosam maxime fugiat
          fugit quisquam, non iure cumque obcaecati aspernates excepteur distinctio alias numquam
          similique ulam, tempora minus vitae eo pariatur libero praesum porro soluta. Foo ulam
          dolor, sit amet consectetur adipiscing, elit.
        </Text>

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
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3B1F00',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1.5,
  },
  imageCard: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0D0B8',
  },
  historyImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#F5E6CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyText: {
    fontSize: 13,
    color: '#5C4A30',
    lineHeight: 21,
    marginBottom: 28,
    textAlign: 'justify',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F5A623',
    paddingVertical: 12,
    borderRadius: 10,
    alignSelf: 'center',
    paddingHorizontal: 32,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});