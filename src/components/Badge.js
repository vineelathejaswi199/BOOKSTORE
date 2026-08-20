import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

const BADGE_STYLES = {
  Bestseller: { bg: Colors.accent, text: Colors.white },
  'Top Rated': { bg: Colors.gold, text: Colors.dark },
  'Award Winner': { bg: '#7C3AED', text: Colors.white },
  'Fan Favorite': { bg: '#DB2777', text: Colors.white },
  Classic: { bg: '#059669', text: Colors.white },
  Trending: { bg: '#F59E0B', text: Colors.dark },
  'New Release': { bg: '#2563EB', text: Colors.white },
  'New': { bg: '#10B981', text: Colors.white },
  default: { bg: Colors.primary, text: Colors.white },
};

const Badge = ({ label, style }) => {
  if (!label) return null;
  const { bg, text } = BADGE_STYLES[label] || BADGE_STYLES.default;

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
};

const DiscountBadge = ({ discount, style }) => {
  if (!discount || discount <= 0) return null;
  return (
    <View style={[styles.badge, styles.discountBadge, style]}>
      <Text style={styles.discountLabel}>-{discount}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  label: {
    fontSize: Typography.fontSizeXS,
    fontWeight: Typography.fontWeightBold,
    letterSpacing: 0.3,
  },
  discountBadge: {
    backgroundColor: Colors.success,
  },
  discountLabel: {
    fontSize: Typography.fontSizeXS,
    fontWeight: Typography.fontWeightBold,
    color: Colors.white,
  },
});

export { Badge, DiscountBadge };
