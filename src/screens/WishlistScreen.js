import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import BookCard from '../components/BookCard';
import Toast from '../components/Toast';
import useStore from '../store/useStore';

const WishlistScreen = ({ navigation }) => {
  const wishlist = useStore((s) => s.wishlist);
  const toastMessage = useStore((s) => s.toastMessage);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const numCols = isTablet ? 4 : width >= 500 ? 3 : 2;
  const cardW = (width - (numCols + 1) * 12) / numCols;

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.headerInner}>
          <View style={styles.headerLeft}>
            <MaterialIcons name="favorite" size={22} color={Colors.accent} />
            <Text style={styles.headerTitle}>Wishlist</Text>
          </View>
          <Text style={styles.headerCount}>
            {wishlist.length} {wishlist.length === 1 ? 'book' : 'books'}
          </Text>
        </SafeAreaView>
      </LinearGradient>

      {wishlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="favorite-border" size={80} color={Colors.lightGray} />
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptySub}>
            Tap the heart icon on any book to save it here
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate('Browse')}
          >
            <Text style={styles.browseBtnText}>Browse Books</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item.id}
          numColumns={numCols}
          key={numCols}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <BookCard
              book={item}
              width={cardW}
              onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
            />
          )}
          ListHeaderComponent={
            <View style={styles.sortBar}>
              <Text style={styles.sortText}>Saved books</Text>
            </View>
          }
        />
      )}

      <Toast message={toastMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingBottom: Spacing.md },
  headerInner: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  headerTitle: {
    color: Colors.white, fontSize: Typography.fontSizeXL,
    fontWeight: Typography.fontWeightBold,
  },
  headerCount: {
    color: 'rgba(255,255,255,0.7)', fontSize: Typography.fontSizeMD,
    fontWeight: Typography.fontWeightMedium,
  },
  emptyContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    gap: Spacing.md, padding: Spacing.xxxxl,
  },
  emptyTitle: {
    fontSize: Typography.fontSize2XL, fontWeight: Typography.fontWeightBold, color: Colors.darkGray,
  },
  emptySub: {
    fontSize: Typography.fontSizeMD, color: Colors.gray,
    textAlign: 'center', lineHeight: 22,
  },
  browseBtn: {
    backgroundColor: Colors.primary, paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md, borderRadius: BorderRadius.full, marginTop: Spacing.sm,
  },
  browseBtnText: { color: Colors.white, fontWeight: Typography.fontWeightBold, fontSize: Typography.fontSizeMD },
  grid: { padding: 6, paddingBottom: 24 },
  row: { justifyContent: 'flex-start' },
  sortBar: {
    paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm,
  },
  sortText: { fontSize: Typography.fontSizeSM, color: Colors.darkGray },
});

export default WishlistScreen;
