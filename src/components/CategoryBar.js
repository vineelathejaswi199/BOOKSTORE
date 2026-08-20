import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

const CategoryPill = ({ category, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.pill, selected && styles.pillSelected]}
    onPress={() => onPress(category.id)}
    activeOpacity={0.75}
  >
    <MaterialIcons
      name={category.icon}
      size={14}
      color={selected ? Colors.white : Colors.primary}
    />
    <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
      {category.name}
    </Text>
  </TouchableOpacity>
);

const CategoryBar = ({ categories, selectedId, onSelect }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.bar}
  >
    {categories.map((cat) => (
      <CategoryPill
        key={cat.id}
        category={cat}
        selected={selectedId === cat.id}
        onPress={onSelect}
      />
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.lightGray,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: {
    fontSize: Typography.fontSizeSM,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.primary,
  },
  pillTextSelected: {
    color: Colors.white,
  },
});

export { CategoryPill, CategoryBar };
