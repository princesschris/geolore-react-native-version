import React from 'react';
import ContentDetailScreen from '../components/ContentDetailScreen';

export default function FestivalDetailScreen({ navigation, route }: any) {
  const festival = route?.params?.festival;

  return (
    <ContentDetailScreen
      navigation={navigation}
      rawContent={festival?.content ?? festival?.body ?? ''}
      heroTitle={festival?.title ?? 'Festival'}
      heroIcon="bonfire-outline"
      heroColor="#7B3F00"
      accentColor="#F5A623"
      label="Festival"
    />
  );
}