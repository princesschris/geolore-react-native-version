import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Modal, TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import SearchBar from './SearchBar';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

type TopBarProps = {
  searchQuery?:    string;
  onSearchChange?: (text: string) => void;
  showSearch?:     boolean;
};

export default function TopBar({
  searchQuery = '',
  onSearchChange,
  showSearch = true,
}: TopBarProps) {
  const navigation  = useNavigation<any>();
  const isFocused   = useIsFocused();
  const { user }    = useAuth();
  const insets      = useSafeAreaInsets();

  const [unread, setUnread] = useState(0);
  const [open,   setOpen]   = useState(false);

  const animation   = useRef(new Animated.Value(0)).current;
  const fabRef      = useRef<View>(null);
  const [fabPos,  setFabPos]  = useState({ x: 0, y: 0, w: 0, h: 0 });

  const channelName = useRef(`topbar_notifs_${user?.id}_${Math.random().toString(36).slice(2)}`);

  const fetchCount = async () => {
    if (!user?.id) return;
    const { count } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_done', false);
    setUnread(count ?? 0);
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchCount();

    const existing = supabase.getChannels().find(c => c.topic === `realtime:${channelName.current}`);
    if (existing) supabase.removeChannel(existing);

    const channel = supabase
      .channel(channelName.current)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        () => setUnread(p => p + 1))
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        () => fetchCount())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  useEffect(() => { if (isFocused) fetchCount(); }, [isFocused]);

  const openMenu = () => {
    fabRef.current?.measureInWindow((x, y, w, h) => {
      setFabPos({ x, y, w, h });
      setOpen(true);
      Animated.spring(animation, {
        toValue: 1, useNativeDriver: true, friction: 6, tension: 80,
      }).start();
    });
  };

  const closeMenu = () => {
    Animated.timing(animation, {
      toValue: 0, duration: 180, useNativeDriver: true,
    }).start(() => setOpen(false));
  };

  const ACTIONS = [
    { icon: 'notifications-outline' as const, label: 'Alerts',  screen: 'Notifications', badge: unread },
    { icon: 'person-outline'        as const, label: 'Profile', screen: 'Profile',        badge: 0 },
    { icon: 'calendar-outline'      as const, label: 'Events',  screen: 'Events',         badge: 0 },
  ];

  return (
    <>
      <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
        {showSearch && (
          <SearchBar
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="Search"
            collapsed={open}
            onIconPress={open ? closeMenu : undefined}
          />
        )}

        {/* Anchor always rendered so measureInWindow works; visually shows FAB or nothing */}
        <View ref={fabRef} collapsable={false}>
          {!open && (
            <TouchableOpacity
              style={styles.fab}
              onPress={openMenu}
              activeOpacity={0.85}
            >
              <Ionicons name="apps-outline" size={20} color="#fff" />
              {unread > 0 && (
                <View style={styles.fabBadge}>
                  <Text style={styles.badgeText}>{unread > 99 ? '99+' : unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {open && (
        <Modal transparent animationType="none" visible={open} onRequestClose={closeMenu}>
          <TouchableWithoutFeedback onPress={closeMenu}>
            <View style={styles.overlay}>
              {ACTIONS.map((action, i) => {
                const opacity = animation.interpolate({
                  inputRange:  [0, 0.4, 1],
                  outputRange: [0, 0,   1],
                });
                const scale = animation.interpolate({
                  inputRange:  [0, 1],
                  outputRange: [0.5, 1],
                });

                const offsetX = -(i + 1) * 54;

                const translateX = animation.interpolate({
                  inputRange:  [0, 1],
                  outputRange: [0, offsetX],
                });

                return (
                  <Animated.View
                    key={action.label}
                    style={[
                      styles.actionWrap,
                      {
                        position: 'absolute',
                        right: 16,
                        top: fabPos.y,
                        transform: [{ translateX }, { scale }],
                        opacity,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.actionBtn}
                      activeOpacity={0.85}
                      onPress={() => { closeMenu(); setTimeout(() => navigation.navigate(action.screen), 200); }}
                    >
                      <Ionicons name={action.icon} size={18} color="#5C3A00" />
                      {action.badge > 0 && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{action.badge > 99 ? '99+' : action.badge}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                    <Text style={styles.actionLabel}>{action.label}</Text>
                  </Animated.View>
                );
              })}

              {/* Ghost FAB in same position to close */}
              <TouchableOpacity
                style={[
                  styles.fab, styles.fabOpen,
                  { position: 'absolute', right: 16, top: fabPos.y },
                ]}
                onPress={closeMenu}
                activeOpacity={0.85}
              >
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 10,
  },
  fab: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#F5A623',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#F5A623', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4, shadowRadius: 6, elevation: 6,
  },
  fabOpen: { backgroundColor: '#D97706' },
  fabBadge: {
    position: 'absolute', top: -3, right: -3,
    backgroundColor: '#E74C3C', borderRadius: 8,
    minWidth: 14, height: 14,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2,
  },
  overlay: { flex: 1 },
  actionWrap: {
    alignItems: 'center',
    gap: 4,
  },
  actionBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, shadowRadius: 5, elevation: 5,
    borderWidth: 1, borderColor: '#F0E6D6',
  },
  actionLabel: {
    fontSize: 9, fontWeight: '700', color: '#5C3A00',
    backgroundColor: 'rgba(255,253,245,0.92)',
    paddingHorizontal: 5, paddingVertical: 2,
    borderRadius: 5, textAlign: 'center',
  },
  badge: {
    position: 'absolute', top: -3, right: -3,
    backgroundColor: '#F5A623', borderRadius: 8,
    minWidth: 14, height: 14,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2,
  },
  badgeText: { color: '#fff', fontSize: 8, fontWeight: '800' },
});