import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import BookCover from './BookCover';
import StarRating from './StarRating';
import { Badge, DiscountBadge } from './Badge';
import { formatPrice, truncate } from '../utils/helpers';
import useStore from '../store/useStore';

const BookCard = ({ book, onPress, width, style }) => {
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const isInWishlist = useStore((s) => s.isInWishlist(book.id));
  const addToCart = useStore((s) => s.addToCart);
  const showToast = useStore((s) => s.showToast);
  const coverW = width ? width - 24 : 130;
  const coverH = coverW * 1.5;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(book);
    showToast(`"${book.title}" added to cart!`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(book);
    showToast(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  return (
    <TouchableOpacity
      style={[styles.card, width ? { width } : {}, style]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Cover */}
      <View style={styles.coverWrap}>
        <BookCover book={book} width={coverW} height={coverH} />
        {/* Wishlist button */}
        <TouchableOpacity style={styles.wishlistBtn} onPress={handleWishlist}>
          <MaterialIcons
            name={isInWishlist ? 'favorite' : 'favorite-border'}
            size={18}
            color={isInWishlist ? Colors.accent : Colors.white}
          />
        </TouchableOpacity>
        {/* Badge */}
        {book.badge && (
          <Badge label={book.badge} style={styles.badgeOverlay} />
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {truncate(book.title, 40)}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author}
        </Text>
        <StarRating rating={book.rating} size={11} />
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(book.price)}</Text>
          {book.originalPrice > book.price && (
            <Text style={styles.originalPrice}>{formatPrice(book.originalPrice)}</Text>
          )}
          <DiscountBadge discount={book.discount} />
        </View>
      </View>

      {/* Add to cart */}
      <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
        <MaterialIcons name="add-shopping-cart" size={16} color={Colors.white} />
        <Text style={styles.cartBtnText}>Add</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.small,
    margin: Spacing.xs,
  },
  coverWrap: {
    position: 'relative',
  },
  wishlistBtn: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: BorderRadius.full,
    padding: Spacing.xs,
    zIndex: 10,
  },
  badgeOverlay: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    zIndex: 10,
  },
  info: {
    padding: Spacing.sm,
    gap: 4,
  },
  title: {
    fontSize: Typography.fontSizeSM,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.dark,
    lineHeight: 17,
  },
  author: {
    fontSize: Typography.fontSizeXS,
    color: Colors.darkGray,
    fontWeight: Typography.fontWeightMedium,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    marginTop: 2,
  },
  price: {
    fontSize: Typography.fontSizeMD,
    fontWeight: Typography.fontWeightBold,
    color: Colors.accent,
  },
  originalPrice: {
    fontSize: Typography.fontSizeXS,
    color: Colors.gray,
    textDecorationLine: 'line-through',
  },
  cartBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
    marginHorizontal: Spacing.sm,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  cartBtnText: {
    color: Colors.white,
    fontSize: Typography.fontSizeSM,
    fontWeight: Typography.fontWeightSemiBold,
  },
});

export default BookCard;
