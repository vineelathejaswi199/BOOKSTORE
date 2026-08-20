import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

const SectionHeader = ({ title, subtitle, onSeeAll }) => (
  <View style={styles.container}>
    <View style={styles.left}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
    {onSeeAll && (
      <TouchableOpacity onPress={onSeeAll} style={styles.seeAll}>
        <Text style={styles.seeAllText}>See All</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  left: { flex: 1 },
  title: {
    fontSize: Typography.fontSizeXL,
    fontWeight: Typography.fontWeightBold,
    color: Colors.dark,
  },
  subtitle: {
    fontSize: Typography.fontSizeSM,
    color: Colors.darkGray,
    marginTop: 2,
  },
  seeAll: {
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
  },
  seeAllText: {
    fontSize: Typography.fontSizeMD,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.accent,
  },
});

export default SectionHeader;
