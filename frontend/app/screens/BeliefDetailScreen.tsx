import React from 'react';
import ContentDetailScreen from '../components/ContentDetailScreen';

const CARD_COLORS = ['#7B3F00', '#5C3A1E', '#8B6F4E', '#6B3A2A'];

export default function BeliefDetailScreen({ navigation, route }: any) {
  const belief = route?.params?.belief;
  const index  = route?.params?.index ?? 0;

  const heroColor = belief?.color ?? CARD_COLORS[index % CARD_COLORS.length];

  return (
    <ContentDetailScreen
      navigation={navigation}
      rawContent={belief?.content ?? belief?.body ?? ''}
      heroTitle={belief?.title ?? 'Belief'}
      heroIcon="eye-outline"
      heroColor={heroColor}
      accentColor="#F5A623"
      label="Belief"
    />
  );
}