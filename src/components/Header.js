import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import useStore from '../store/useStore';

const Header = ({ navigation, title, showSearch = false, showBack = false, transparent = false }) => {
  const cartCount = useStore((s) => s.getCartCount());
  const searchQuery = useStore((s) => s.searchQuery);
  const setSearchQuery = useStore((s) => s.setSearchQuery);

  return (
    <LinearGradient
      colors={[Colors.primary, Colors.secondary]}
      style={styles.gradient}
    >
      <SafeAreaView edges={['top']} style={styles.safe}>
        <View style={styles.row}>
          {showBack ? (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
              <MaterialIcons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>
          ) : (
            <View style={styles.brand}>
              <MaterialIcons name="auto-stories" size={24} color={Colors.accent} />
              <Text style={styles.brandText}>PageTurn</Text>
            </View>
          )}

          {title && !showSearch && (
            <Text style={styles.title}>{title}</Text>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('Search')}
            >
              <MaterialIcons name="search" size={24} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('Cart')}
            >
              <MaterialIcons name="shopping-cart" size={24} color={Colors.white} />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {showSearch && (
          <View style={styles.searchRow}>
            <MaterialIcons name="search" size={20} color={Colors.gray} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search books, authors..."
              placeholderTextColor={Colors.gray}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialIcons name="close" size={18} color={Colors.gray} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    paddingBottom: Spacing.md,
  },
  safe: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
  },
  brandText: {
    color: Colors.white,
    fontSize: Typography.fontSizeXL,
    fontWeight: Typography.fontWeightExtraBold,
    letterSpacing: 0.5,
  },
  title: {
    flex: 1,
    color: Colors.white,
    fontSize: Typography.fontSizeLG,
    fontWeight: Typography.fontWeightBold,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  iconBtn: {
    position: 'relative',
    padding: Spacing.xs,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: Typography.fontWeightBold,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    height: 40,
  },
  searchIcon: {
    marginRight: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    color: Colors.dark,
    fontSize: Typography.fontSizeMD,
  },
});

export default Header;
