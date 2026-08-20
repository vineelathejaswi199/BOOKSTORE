import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../theme';

const StarRating = ({ rating, size = 12, showCount, count }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<MaterialIcons key={i} name="star" size={size} color={Colors.gold} />);
    } else if (i === fullStars && hasHalf) {
      stars.push(<MaterialIcons key={i} name="star-half" size={size} color={Colors.gold} />);
    } else {
      stars.push(<MaterialIcons key={i} name="star-border" size={size} color={Colors.gold} />);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.stars}>{stars}</View>
      {showCount && count !== undefined && (
        <Text style={[styles.count, { fontSize: size - 1 }]}>({count.toLocaleString()})</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  stars: {
    flexDirection: 'row',
    gap: 1,
  },
  count: {
    color: Colors.darkGray,
    fontWeight: Typography.fontWeightRegular,
  },
});

export default StarRating;
