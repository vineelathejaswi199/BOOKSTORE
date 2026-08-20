import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { BOOKS } from '../data/books';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import BookCover from '../components/BookCover';
import StarRating from '../components/StarRating';
import { Badge, DiscountBadge } from '../components/Badge';
import BookCard from '../components/BookCard';
import Toast from '../components/Toast';
import useStore from '../store/useStore';
import { formatPrice, formatNumber } from '../utils/helpers';

const TABS = ['Overview', 'Details', 'Reviews'];

const BookDetailScreen = ({ navigation, route }) => {
  const { bookId } = route.params;
  const book = BOOKS.find((b) => b.id === bookId);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const addToCart = useStore((s) => s.addToCart);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const isInWishlist = useStore((s) => s.isInWishlist(bookId));
  const getCartCount = useStore((s) => s.getCartCount);
  const showToast = useStore((s) => s.showToast);
  const toastMessage = useStore((s) => s.toastMessage);

  const [activeTab, setActiveTab] = useState('Overview');
  const [qty, setQty] = useState(1);

  if (!book) {
    return (
      <View style={styles.notFound}>
        <Text>Book not found</Text>
      </View>
    );
  }

  const coverW = isTablet ? 180 : 130;
  const coverH = coverW * 1.5;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(book);
    showToast(`${qty}× "${book.title}" added to cart!`);
  };

  const relatedBooks = BOOKS.filter(
    (b) => b.category === book.category && b.id !== book.id
  ).slice(0, 6);

  const reviews = [
    { id: 1, user: 'Sarah M.', rating: 5, text: 'Absolutely loved this book! Could not put it down.', date: '2 days ago' },
    { id: 2, user: 'Tom K.', rating: 4, text: 'Really engaging story with great character development.', date: '1 week ago' },
    { id: 3, user: 'Priya S.', rating: 5, text: 'One of the best books I have read this year. Highly recommend!', date: '2 weeks ago' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Custom Back Header */}
      <LinearGradient
        colors={[book.coverColor, book.coverAccent || Colors.primary]}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={['top']} style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{book.title}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Cart')}
            style={styles.cartBtn}
          >
            <MaterialIcons name="shopping-cart" size={22} color={Colors.white} />
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero section */}
        <LinearGradient
          colors={[book.coverColor, book.coverAccent || Colors.primary, Colors.background]}
          style={styles.hero}
        >
          <View style={styles.heroInner}>
            <View style={styles.coverWrap}>
              <BookCover book={book} width={coverW} height={coverH} />
              <TouchableOpacity
                style={[styles.wishlistBtn, isInWishlist && styles.wishlistBtnActive]}
                onPress={() => {
                  toggleWishlist(book);
                  showToast(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
                }}
              >
                <MaterialIcons
                  name={isInWishlist ? 'favorite' : 'favorite-border'}
                  size={20}
                  color={isInWishlist ? Colors.accent : Colors.white}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.heroInfo}>
              {book.badge && <Badge label={book.badge} style={{ alignSelf: 'flex-start' }} />}
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.bookAuthor}>by {book.author}</Text>
              <StarRating rating={book.rating} size={15} showCount count={book.reviewCount} />
              <View style={styles.priceRow}>
                <Text style={styles.price}>{formatPrice(book.price * qty)}</Text>
                {book.originalPrice > book.price && (
                  <Text style={styles.originalPrice}>{formatPrice(book.originalPrice)}</Text>
                )}
                <DiscountBadge discount={book.discount} />
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Quantity + Add to Cart */}
        <View style={styles.ctaSection}>
          <View style={styles.qtyControl}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQty(Math.max(1, qty - 1))}
            >
              <MaterialIcons name="remove" size={18} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{qty}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(qty + 1)}>
              <MaterialIcons name="add" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
            <MaterialIcons name="add-shopping-cart" size={20} color={Colors.white} />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buyNowBtn}
            onPress={() => {
              handleAddToCart();
              navigation.navigate('Cart');
            }}
          >
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'Overview' && (
            <View style={styles.overview}>
              <Text style={styles.sectionTitle}>About This Book</Text>
              <Text style={styles.description}>{book.description}</Text>
              {book.tags && (
                <View style={styles.tagRow}>
                  {book.tags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {activeTab === 'Details' && (
            <View style={styles.details}>
              {[
                { label: 'Publisher', value: book.publisher },
                { label: 'Year', value: book.year },
                { label: 'Pages', value: `${book.pages} pages` },
                { label: 'Language', value: book.language },
                { label: 'ISBN', value: book.isbn },
                { label: 'Category', value: book.category.charAt(0).toUpperCase() + book.category.slice(1) },
              ].map(({ label, value }) => (
                <View key={label} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{label}</Text>
                  <Text style={styles.detailValue}>{value}</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'Reviews' && (
            <View style={styles.reviewsSection}>
              {/* Summary */}
              <View style={styles.reviewSummary}>
                <Text style={styles.bigRating}>{book.rating}</Text>
                <View>
                  <StarRating rating={book.rating} size={20} />
                  <Text style={styles.ratingCount}>
                    Based on {formatNumber(book.reviewCount)} reviews
                  </Text>
                </View>
              </View>
              {reviews.map((rev) => (
                <View key={rev.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{rev.user[0]}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reviewUser}>{rev.user}</Text>
                      <StarRating rating={rev.rating} size={12} />
                    </View>
                    <Text style={styles.reviewDate}>{rev.date}</Text>
                  </View>
                  <Text style={styles.reviewText}>{rev.text}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <View>
            <View style={styles.relatedHeader}>
              <Text style={styles.sectionTitle}>You May Also Like</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedList}>
              {relatedBooks.map((rb) => (
                <BookCard
                  key={rb.id}
                  book={rb}
                  width={140}
                  onPress={() => navigation.replace('BookDetail', { bookId: rb.id })}
                />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <Toast message={toastMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Header
  headerGradient: { paddingBottom: Spacing.sm },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },
  backBtn: { padding: Spacing.xs },
  headerTitle: {
    flex: 1,
    color: Colors.white,
    fontSize: Typography.fontSizeLG,
    fontWeight: Typography.fontWeightBold,
  },
  cartBtn: { padding: Spacing.xs },

  // Hero
  hero: { paddingBottom: Spacing.xxl },
  heroInner: {
    flexDirection: 'row',
    padding: Spacing.xl,
    gap: Spacing.lg,
    alignItems: 'flex-start',
  },
  coverWrap: { position: 'relative' },
  wishlistBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: BorderRadius.full,
    padding: Spacing.sm,
  },
  wishlistBtnActive: { backgroundColor: 'rgba(255,255,255,0.9)' },
  heroInfo: { flex: 1, gap: Spacing.sm },
  bookTitle: {
    color: Colors.white,
    fontSize: Typography.fontSize2XL,
    fontWeight: Typography.fontWeightExtraBold,
    lineHeight: 28,
  },
  bookAuthor: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: Typography.fontSizeMD,
    fontWeight: Typography.fontWeightMedium,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  price: {
    color: Colors.white,
    fontSize: Typography.fontSize2XL,
    fontWeight: Typography.fontWeightBold,
  },
  originalPrice: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: Typography.fontSizeSM,
    textDecorationLine: 'line-through',
  },

  // CTA
  ctaSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    gap: Spacing.sm,
    ...Shadows.small,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  qtyBtn: {
    padding: Spacing.sm,
    backgroundColor: Colors.lightGray,
  },
  qtyText: {
    paddingHorizontal: Spacing.md,
    fontSize: Typography.fontSizeLG,
    fontWeight: Typography.fontWeightBold,
    color: Colors.dark,
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  addToCartText: {
    color: Colors.white,
    fontWeight: Typography.fontWeightBold,
    fontSize: Typography.fontSizeMD,
  },
  buyNowBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  buyNowText: {
    color: Colors.white,
    fontWeight: Typography.fontWeightBold,
    fontSize: Typography.fontSizeMD,
  },

  // Tabs
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: Colors.accent },
  tabText: {
    fontSize: Typography.fontSizeMD,
    fontWeight: Typography.fontWeightMedium,
    color: Colors.darkGray,
  },
  tabTextActive: { color: Colors.accent, fontWeight: Typography.fontWeightBold },
  tabContent: {
    backgroundColor: Colors.white,
    marginBottom: Spacing.lg,
  },

  // Overview
  overview: { padding: Spacing.lg, gap: Spacing.md },
  sectionTitle: {
    fontSize: Typography.fontSizeXL,
    fontWeight: Typography.fontWeightBold,
    color: Colors.dark,
  },
  description: {
    fontSize: Typography.fontSizeMD,
    color: Colors.darkGray,
    lineHeight: 24,
  },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  tag: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  tagText: {
    fontSize: Typography.fontSizeSM,
    color: Colors.primary,
    fontWeight: Typography.fontWeightMedium,
  },

  // Details
  details: { padding: Spacing.lg },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderColor: Colors.lightGray,
  },
  detailLabel: {
    fontSize: Typography.fontSizeMD,
    color: Colors.darkGray,
    fontWeight: Typography.fontWeightMedium,
  },
  detailValue: {
    fontSize: Typography.fontSizeMD,
    color: Colors.dark,
    fontWeight: Typography.fontWeightSemiBold,
  },

  // Reviews
  reviewsSection: { padding: Spacing.lg, gap: Spacing.md },
  reviewSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.lg,
  },
  bigRating: {
    fontSize: Typography.fontSize4XL,
    fontWeight: Typography.fontWeightBold,
    color: Colors.dark,
  },
  ratingCount: {
    fontSize: Typography.fontSizeSM,
    color: Colors.darkGray,
    marginTop: 4,
  },
  reviewCard: {
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontWeight: Typography.fontWeightBold,
    fontSize: Typography.fontSizeMD,
  },
  reviewUser: {
    fontWeight: Typography.fontWeightBold,
    color: Colors.dark,
    fontSize: Typography.fontSizeMD,
  },
  reviewDate: {
    fontSize: Typography.fontSizeXS,
    color: Colors.gray,
  },
  reviewText: {
    fontSize: Typography.fontSizeMD,
    color: Colors.darkGray,
    lineHeight: 22,
  },

  // Related
  relatedHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  relatedList: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
});

export default BookDetailScreen;
