import React from 'react';
import ContentDetailScreen from '../components/ContentDetailScreen';

export default function CultureDetailScreen({ navigation, route }: any) {
  return (
    <ContentDetailScreen
      navigation={navigation}
      item={route?.params?.item}
      heroIcon="globe-outline"
      heroColor="#8B6914"
      accentColor="#F5A623"
      label="Culture"
    />
    
  );
}