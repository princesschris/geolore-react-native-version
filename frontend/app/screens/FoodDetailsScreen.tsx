import React from 'react';
import ContentDetailScreen from '../components/ContentDetailScreen';

function buildMarkdown(food: any): string {
  const lines: string[] = [];

  if (food.native_name) lines.push(`_${food.native_name}_\n`);
  if (food.category)    lines.push(`**Category:** ${food.category}\n`);

  const ingredients: string[] = Array.isArray(food.ingredients) ? food.ingredients : [];
  const steps:       string[] = Array.isArray(food.steps)       ? food.steps       : [];

  if (ingredients.length > 0) {
    lines.push(`### Ingredients\n`);
    ingredients.forEach((item) => lines.push(`- ${item}`));
    lines.push('');
  }

  if (steps.length > 0) {
    lines.push(`### How to Prepare\n`);
    steps.forEach((step, i) => lines.push(`${i + 1}. ${step}`));
    lines.push('');
  }

  return lines.join('\n').trim();
}

export default function FoodDetailsScreen({ navigation, route }: any) {
  const food = route?.params?.food;

  return (
    <ContentDetailScreen
      navigation={navigation}
      rawContent={food ? buildMarkdown(food) : ''}
      heroTitle={food?.name ?? 'Food'}
      heroIcon="restaurant-outline"
      heroColor="#6B3A2A"
      accentColor="#F5A623"
      label="Food"
    />
  );
}