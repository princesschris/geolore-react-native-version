import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

export default function ScrollPicker({ items, selectedValue, onValueChange, width = 80 }) {
  const scrollRef = useRef(null);
  const selectedIndex = items.indexOf(selectedValue);

  useEffect(() => {
    if (scrollRef.current && selectedIndex >= 0) {
      scrollRef.current.scrollTo({
        y: selectedIndex * ITEM_HEIGHT,
        animated: false,
      });
    }
  }, []);

  const handleScrollEnd = (e) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
    if (items[clampedIndex] !== selectedValue) {
      onValueChange(items[clampedIndex]);
    }
  };

  return (
    <View style={[styles.container, { width }]}>
      {/* Selection highlight — renders behind ScrollView */}
      <View style={styles.selectionHighlight} pointerEvents="none" />

      {/* Top fade — renders behind ScrollView */}
      <View style={styles.fadeTop} pointerEvents="none" />

      {/* Bottom fade — renders behind ScrollView */}
      <View style={styles.fadeBottom} pointerEvents="none" />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        contentContainerStyle={{
          paddingVertical: ITEM_HEIGHT * 2,
        }}
        style={{ height: PICKER_HEIGHT }}
      >
        {items.map((item, index) => {
          const isSelected = item === selectedValue;
          return (
            <View key={index} style={styles.item}>
              <Text style={[styles.itemText, isSelected && styles.selectedText]}>
                {item}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: PICKER_HEIGHT,
    overflow: 'hidden',
    position: 'relative',
  },
  selectionHighlight: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: '#F5A623',
    backgroundColor: '#FFF3E0',
    zIndex: 0,
  },
  fadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 2,
    backgroundColor: 'rgba(255,253,245,0.45)',
    zIndex: 0,
  },
  fadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 2,
    backgroundColor: 'rgba(255,253,245,0.45)',
    zIndex: 0,
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 16,
    color: '#8B6F4E',
    fontWeight: '600',
  },
  selectedText: {
    fontSize: 20,
    color: '#3B1F00',
    fontWeight: '800',
  },
});