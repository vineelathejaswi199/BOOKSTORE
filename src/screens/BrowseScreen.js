import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { BOOKS, CATEGORIES } from '../data/books';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import { CategoryBar } from '../components/CategoryBar';
import Toast from '../components/Toast';
import useStore from '../store/useStore';

const SORT_OPTIONS = [
  { key: 'featured', label: 'Featured' },
  { key: 'price_low', label: 'Price: Low to High' },
  { key: 'price_high', label: 'Price: High to Low' },
  { key: 'rating', label: 'Top Rated' },
  { key: 'newest', label: 'Newest' },
  { key: 'discount', label: 'Biggest Discount' },
];

const BrowseScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const numCols = isTablet ? 4 : width >= 500 ? 3 : 2;
  const cardW = (width - (numCols + 1) * 12) / numCols;

  const searchQuery = useStore((s) => s.searchQuery);
  const selectedCategory = useStore((s) => s.selectedCategory);
  const setSelectedCategory = useStore((s) => s.setSelectedCategory);
  const sortBy = useStore((s) => s.sortBy);
  const setSortBy = useStore((s) => s.setSortBy);
  const toastMessage = useStore((s) => s.toastMessage);

  const [sortModalVisible, setSortModalVisible] = useState(false);

  // Apply initial category from route params
  React.useEffect(() => {
    if (route?.params?.categoryId) {
      setSelectedCategory(route.params.categoryId);
    }
  }, [route?.params?.categoryId]);

  const filteredBooks = useMemo(() => {
    let books = [...BOOKS];

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      books = books.filter((b) => b.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          (b.tags && b.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Sort
    switch (sortBy) {
      case 'price_low':
        books.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        books.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        books.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        books.sort((a, b) => b.year - a.year);
        break;
      case 'discount':
        books.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default:
        // featured: keep original order
        break;
    }

    return books;
  }, [selectedCategory, searchQuery, sortBy]);

  const handleBookPress = useCallback(
    (book) => navigation.navigate('BookDetail', { bookId: book.id }),
    [navigation]
  );

  const currentSortLabel = SORT_OPTIONS.find((o) => o.key === sortBy)?.label || 'Sort';

  const renderBook = useCallback(
    ({ item }) => (
      <BookCard book={item} width={cardW} onPress={() => handleBookPress(item)} />
    ),
    [cardW, handleBookPress]
  );

  const renderEmpty = () => (
    <View style={styles.empty}>
      <MaterialIcons name="search-off" size={64} color={Colors.lightGray} />
      <Text style={styles.emptyTitle}>No books found</Text>
      <Text style={styles.emptySub}>Try adjusting your filters or search query</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header navigation={navigation} showSearch />
      <SafeAreaView edges={['bottom']} style={styles.flex}>
        {/* Category Bar */}
        <View style={styles.filterSection}>
          <CategoryBar
            categories={CATEGORIES}
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </View>

        {/* Sort + count bar */}
        <View style={styles.sortBar}>
          <Text style={styles.resultCount}>
            {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
          </Text>
          <TouchableOpacity
            style={styles.sortBtn}
            onPress={() => setSortModalVisible(true)}
          >
            <MaterialIcons name="sort" size={16} color={Colors.primary} />
            <Text style={styles.sortBtnText}>{currentSortLabel}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Book Grid */}
        <FlatList
          data={filteredBooks}
          renderItem={renderBook}
          keyExtractor={(item) => item.id}
          numColumns={numCols}
          key={numCols}
          contentContainerStyle={[
            styles.grid,
            filteredBooks.length === 0 && styles.gridEmpty,
          ]}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
        />
      </SafeAreaView>

      {/* Sort Modal */}
      <Modal
        visible={sortModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSortModalVisible(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Sort By</Text>
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={styles.sortOption}
                onPress={() => {
                  setSortBy(opt.key);
                  setSortModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    sortBy === opt.key && styles.sortOptionSelected,
                  ]}
                >
                  {opt.label}
                </Text>
                {sortBy === opt.key && (
                  <MaterialIcons name="check" size={18} color={Colors.accent} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Toast message={toastMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  filterSection: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  resultCount: {
    fontSize: Typography.fontSizeSM,
    color: Colors.darkGray,
    fontWeight: Typography.fontWeightMedium,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.offWhite,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sortBtnText: {
    fontSize: Typography.fontSizeSM,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.primary,
  },
  grid: {
    padding: 6,
  },
  gridEmpty: {
    flex: 1,
  },
  row: {
    justifyContent: 'flex-start',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxxxl,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: Typography.fontSizeXL,
    fontWeight: Typography.fontWeightBold,
    color: Colors.darkGray,
  },
  emptySub: {
    fontSize: Typography.fontSizeMD,
    color: Colors.gray,
    textAlign: 'center',
  },
  // Sort modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: Colors.overlay,
  },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxxl,
    ...Shadows.large,
  },
  modalHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.lightGray,
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: Typography.fontSizeXL,
    fontWeight: Typography.fontWeightBold,
    color: Colors.dark,
    marginBottom: Spacing.md,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderColor: Colors.lightGray,
  },
  sortOptionText: {
    fontSize: Typography.fontSizeMD,
    color: Colors.dark,
    fontWeight: Typography.fontWeightMedium,
  },
  sortOptionSelected: {
    color: Colors.accent,
    fontWeight: Typography.fontWeightBold,
  },
});

export default BrowseScreen;
