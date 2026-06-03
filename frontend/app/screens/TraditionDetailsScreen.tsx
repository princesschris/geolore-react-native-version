import React from 'react';
import ContentDetailScreen from '../components/ContentDetailScreen';

export default function TraditionDetailScreen({ navigation, route }: any) {
  const tradition = route?.params?.tradition;

  return (
    <ContentDetailScreen
      navigation={navigation}
      rawContent={tradition?.content ?? tradition?.body ?? ''}
      heroTitle={tradition?.title ?? 'Tradition'}
      heroIcon="book-outline"
      heroColor="#4A3728"
      accentColor="#F5A623"
      label="Tradition"
    />
  );
}