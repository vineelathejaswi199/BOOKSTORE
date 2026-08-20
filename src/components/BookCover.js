import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

const BookCover = ({ book, width = 100, height = 150, style }) => {
  const colors = [book.coverColor || '#1A1A2E', book.coverAccent || '#E94560'];

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.cover, { width, height }, Shadows.medium, style]}
    >
      {/* Spine detail */}
      <View style={[styles.spine, { height }]} />
      {/* Book content */}
      <View style={styles.content}>
        <Text style={[styles.title, { fontSize: Math.max(8, width * 0.1) }]} numberOfLines={3}>
          {book.title}
        </Text>
        <View style={styles.divider} />
        <Text style={[styles.author, { fontSize: Math.max(7, width * 0.08) }]} numberOfLines={2}>
          {book.author}
        </Text>
      </View>
      {/* Decorative circle */}
      <View style={[styles.circle, { width: width * 0.6, height: width * 0.6, borderRadius: width * 0.3 }]} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  cover: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  spine: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 6,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  content: {
    padding: Spacing.sm,
    zIndex: 1,
  },
  title: {
    color: Colors.white,
    fontWeight: Typography.fontWeightBold,
    lineHeight: 14,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: 4,
  },
  author: {
    color: 'rgba(255,255,255,0.8)',
    fontWeight: Typography.fontWeightMedium,
    lineHeight: 12,
  },
  circle: {
    position: 'absolute',
    top: -20,
    right: -20,
    backgroundColor: 'rgba(255,255,255,0.07)',
    zIndex: 0,
  },
});

export default BookCover;
