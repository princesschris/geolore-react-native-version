import React from 'react';
import ContentDetailScreen from '../components/ContentDetailScreen';

type FashionOutfit = {
  title:                 string;
  subtitle?:             string;
  imageSource?:          any;
  fashion_description?:  string;
  fashion_materials?:    string;
  fashion_worn_by?:      string;
  fashion_occasions?:    string;
  fashion_significance?: string;
  fashion_modern_usage?: string;
};

function buildMarkdown(outfit: FashionOutfit): string {
  const section = (heading: string, body?: string) => {
    if (!body?.trim()) return '';
    return `### ${heading}\n\n${body.trim()}\n\n`;
  };

  return [
    outfit.subtitle ? `_${outfit.subtitle}_\n\n` : '',
    section('Description',           outfit.fashion_description),
    section('Materials',             outfit.fashion_materials),
    section('Who Wears It',          outfit.fashion_worn_by),
    section('Occasions',             outfit.fashion_occasions),
    section('Cultural Significance', outfit.fashion_significance),
    section('Modern Usage',          outfit.fashion_modern_usage),
  ].join('').trim();
}

export default function FashionDetailScreen({ navigation, route }: any) {
  const outfit: FashionOutfit = route?.params?.outfit ?? {
    title:               'Fashion',
    fashion_description: 'No description available.',
  };

  return (
    <ContentDetailScreen
      navigation={navigation}
      rawContent={buildMarkdown(outfit)}
      heroTitle={outfit.title}
      heroIcon="shirt-outline"
      heroColor="#8B5E3C"
      accentColor="#F5A623"
      label="Fashion"
    />
  );
}