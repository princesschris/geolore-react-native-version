import React from 'react';
import ContentDetailScreen from '../components/ContentDetailScreen';

export default function StoryDetailScreen({ navigation, route }: any) {
  return (
    <ContentDetailScreen
      navigation={navigation}
      item={route?.params?.story ?? route?.params?.item}
      heroIcon="book-outline"
      heroColor="#6B3FA0"
      accentColor="#A855F7"
      label="Story"
    />
  );
}