import React from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {
  BOOKS,
  CATEGORIES,
  FEATURED_BOOKS,
  BESTSELLERS,
  NEW_ARRIVALS,
  TOP_RATED,
  FEATURED_DEALS,
} from '../data/books';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import BookCover from '../components/BookCover';
import SectionHeader from '../components/SectionHeader';
import { CategoryBar } from '../components/CategoryBar';
import StarRating from '../components/StarRating';
import { Badge, DiscountBadge } from '../components/Badge';
import Toast from '../components/Toast';
import useStore from '../store/useStore';
import { formatPrice } from '../utils/helpers';

// Hero Slide
const HeroSlide = ({ book, onPress }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  return (
    <LinearGradient
      colors={[book.coverColor, book.coverAccent || '#E94560', '#1A1A2E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.heroSlide, { width, height: isTablet ? 300 : 220 }]}
    >
      <View style={styles.heroContent}>
        <View style={styles.heroText}>
          {book.badge && (
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>⭐ {book.badge}</Text>
            </View>
          )}
          <Text style={[styles.heroTitle, isTablet && { fontSize: 28 }]} numberOfLines={2}>
            {book.title}
          </Text>
          <Text style={styles.heroAuthor}>by {book.author}</Text>
          <View style={styles.heroMeta}>
            <StarRating rating={book.rating} size={14} showCount count={book.reviewCount} />
          </View>
          <View style={styles.heroPrice}>
            <Text style={styles.heroPriceText}>{formatPrice(book.price)}</Text>
            <Text style={styles.heroOriginalPrice}>{formatPrice(book.originalPrice)}</Text>
            <DiscountBadge discount={book.discount} />
          </View>
          <TouchableOpacity style={styles.heroBtn} onPress={onPress}>
            <Text style={styles.heroBtnText}>View Book</Text>
            <MaterialIcons name="arrow-forward" size={16} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <BookCover book={book} width={isTablet ? 130 : 100} height={isTablet ? 195 : 150} />
      </View>
      {/* Decorative circles */}
      <View style={styles.deco1} />
      <View style={styles.deco2} />
    </LinearGradient>
  );
};

// Horizontal featured list
const HorizontalBookList = ({ books, onPress }) => {
  const { width } = useWindowDimensions();
  const cardW = width >= 768 ? 160 : 140;
  return (
    <FlatList
      horizontal
      data={books}
      keyExtractor={(b) => b.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.hList}
      renderItem={({ item }) => (
        <BookCard book={item} width={cardW} onPress={() => onPress(item)} />
      )}
    />
  );
};

// Deal card (wider horizontal card)
const DealCard = ({ book, onPress }) => {
  const addToCart = useStore((s) => s.addToCart);
  const showToast = useStore((s) => s.showToast);
  return (
    <TouchableOpacity style={styles.dealCard} onPress={onPress} activeOpacity={0.85}>
      <BookCover book={book} width={80} height={120} />
      <View style={styles.dealInfo}>
        <Text style={styles.dealTitle} numberOfLines={2}>{book.title}</Text>
        <Text style={styles.dealAuthor}>{book.author}</Text>
        <StarRating rating={book.rating} size={12} />
        <View style={styles.dealPriceRow}>
          <Text style={styles.dealPrice}>{formatPrice(book.price)}</Text>
          <Text style={styles.dealOriginal}>{formatPrice(book.originalPrice)}</Text>
        </View>
        <TouchableOpacity
          style={styles.dealBtn}
          onPress={() => { addToCart(book); showToast(`"${book.title}" added to cart!`); }}
        >
          <MaterialIcons name="add-shopping-cart" size={14} color={Colors.white} />
          <Text style={styles.dealBtnText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
      <DiscountBadge discount={book.discount} style={styles.dealDiscount} />
    </TouchableOpacity>
  );
};

const HomeScreen = ({ navigation }) => {
  const toastMessage = useStore((s) => s.toastMessage);
  const [heroIndex, setHeroIndex] = React.useState(0);
  const { width } = useWindowDimensions();

  const goToBook = (book) => navigation.navigate('BookDetail', { bookId: book.id });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Header navigation={navigation} showSearch />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Hero Carousel */}
        <FlatList
          horizontal
          pagingEnabled
          data={FEATURED_BOOKS}
          keyExtractor={(b) => b.id}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            setHeroIndex(Math.round(e.nativeEvent.contentOffset.x / width));
          }}
          renderItem={({ item }) => (
            <HeroSlide book={item} onPress={() => goToBook(item)} />
          )}
        />
        {/* Dots */}
        <View style={styles.dots}>
          {FEATURED_BOOKS.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === heroIndex && styles.dotActive]}
            />
          ))}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          {[
            { icon: 'local-library', label: '12,000+ Books', color: Colors.accent },
            { icon: 'star', label: '4.8 Avg Rating', color: Colors.gold },
            { icon: 'local-shipping', label: 'Free Shipping $35+', color: Colors.success },
          ].map((s) => (
            <View key={s.label} style={styles.statItem}>
              <MaterialIcons name={s.icon} size={20} color={s.color} />
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Categories */}
        <SectionHeader title="Browse Categories" />
        <CategoryBar
          categories={CATEGORIES}
          selectedId={null}
          onSelect={(id) => navigation.navigate('Browse', { categoryId: id })}
        />

        {/* Bestsellers */}
        <SectionHeader
          title="Bestsellers"
          subtitle="Top picks this week"
          onSeeAll={() => navigation.navigate('Browse')}
        />
        <HorizontalBookList books={BESTSELLERS} onPress={goToBook} />

        {/* Flash Deals */}
        <LinearGradient
          colors={[Colors.accent, '#C1121F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.dealsSection}
        >
          <View style={styles.dealsHeader}>
            <MaterialIcons name="local-offer" size={20} color={Colors.white} />
            <Text style={styles.dealsSectionTitle}>Flash Deals</Text>
            <Text style={styles.dealsSectionSub}>Up to 45% off</Text>
          </View>
        </LinearGradient>
        {FEATURED_DEALS.map((book) => (
          <DealCard key={book.id} book={book} onPress={() => goToBook(book)} />
        ))}

        {/* New Arrivals */}
        <SectionHeader
          title="New Arrivals"
          subtitle="Fresh off the press"
          onSeeAll={() => navigation.navigate('Browse')}
        />
        <HorizontalBookList books={NEW_ARRIVALS} onPress={goToBook} />

        {/* Top Rated */}
        <SectionHeader
          title="Top Rated"
          subtitle="Readers' favorites"
          onSeeAll={() => navigation.navigate('Browse')}
        />
        <HorizontalBookList books={TOP_RATED} onPress={goToBook} />

        {/* Newsletter Banner */}
        <LinearGradient
          colors={[Colors.primary, Colors.secondary]}
          style={styles.newsletter}
        >
          <MaterialIcons name="mail-outline" size={32} color={Colors.accent} />
          <Text style={styles.newsletterTitle}>Get 10% Off Your First Order</Text>
          <Text style={styles.newsletterSub}>Subscribe to our newsletter for exclusive deals</Text>
          <TouchableOpacity style={styles.newsletterBtn}>
            <Text style={styles.newsletterBtnText}>Subscribe Now</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={{ height: 24 }} />
      </ScrollView>

      <Toast message={toastMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },

  // Hero
  heroSlide: {
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    gap: Spacing.lg,
    zIndex: 1,
  },
  heroText: { flex: 1 },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  heroBadgeText: {
    color: Colors.white,
    fontSize: Typography.fontSizeXS,
    fontWeight: Typography.fontWeightSemiBold,
  },
  heroTitle: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: Typography.fontWeightExtraBold,
    lineHeight: 28,
    marginBottom: Spacing.xs,
  },
  heroAuthor: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: Typography.fontSizeMD,
    marginBottom: Spacing.sm,
  },
  heroMeta: { marginBottom: Spacing.sm },
  heroPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  heroPriceText: {
    color: Colors.white,
    fontSize: Typography.fontSizeXL,
    fontWeight: Typography.fontWeightBold,
  },
  heroOriginalPrice: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: Typography.fontSizeSM,
    textDecorationLine: 'line-through',
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  heroBtnText: {
    color: Colors.white,
    fontWeight: Typography.fontWeightSemiBold,
    fontSize: Typography.fontSizeSM,
  },
  deco1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -80,
    right: -50,
  },
  deco2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: -40,
    left: 40,
  },

  // Dots
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    width: 18,
    backgroundColor: Colors.accent,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.darkGray,
    textAlign: 'center',
  },

  // Horizontal list
  hList: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },

  // Deals
  dealsSection: {
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  dealsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dealsSectionTitle: {
    color: Colors.white,
    fontSize: Typography.fontSizeXL,
    fontWeight: Typography.fontWeightBold,
    flex: 1,
  },
  dealsSectionSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: Typography.fontSizeSM,
    fontWeight: Typography.fontWeightSemiBold,
  },
  dealCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.small,
    position: 'relative',
    overflow: 'hidden',
  },
  dealInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    gap: 5,
  },
  dealTitle: {
    fontSize: Typography.fontSizeMD,
    fontWeight: Typography.fontWeightBold,
    color: Colors.dark,
    lineHeight: 20,
  },
  dealAuthor: {
    fontSize: Typography.fontSizeSM,
    color: Colors.darkGray,
  },
  dealPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dealPrice: {
    fontSize: Typography.fontSizeLG,
    fontWeight: Typography.fontWeightBold,
    color: Colors.accent,
  },
  dealOriginal: {
    fontSize: Typography.fontSizeSM,
    color: Colors.gray,
    textDecorationLine: 'line-through',
  },
  dealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xs,
  },
  dealBtnText: {
    color: Colors.white,
    fontSize: Typography.fontSizeSM,
    fontWeight: Typography.fontWeightSemiBold,
  },
  dealDiscount: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
  },

  // Newsletter
  newsletter: {
    margin: Spacing.lg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  newsletterTitle: {
    color: Colors.white,
    fontSize: Typography.fontSize2XL,
    fontWeight: Typography.fontWeightBold,
    textAlign: 'center',
  },
  newsletterSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: Typography.fontSizeMD,
    textAlign: 'center',
  },
  newsletterBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
  },
  newsletterBtnText: {
    color: Colors.white,
    fontWeight: Typography.fontWeightBold,
    fontSize: Typography.fontSizeMD,
  },
});

export default HomeScreen;
