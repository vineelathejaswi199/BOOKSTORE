import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import BookCover from '../components/BookCover';
import Toast from '../components/Toast';
import useStore from '../store/useStore';
import { formatPrice } from '../utils/helpers';

const CartItem = ({ item, onRemove, onUpdateQty }) => (
  <View style={styles.cartItem}>
    <BookCover book={item} width={60} height={90} />
    <View style={styles.itemInfo}>
      <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.itemAuthor}>{item.author}</Text>
      <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
    </View>
    <View style={styles.itemActions}>
      <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
        <MaterialIcons name="delete-outline" size={20} color={Colors.accent} />
      </TouchableOpacity>
      <View style={styles.qtyRow}>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => onUpdateQty(item.quantity - 1)}
        >
          <MaterialIcons name="remove" size={16} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.qtyText}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => onUpdateQty(item.quantity + 1)}
        >
          <MaterialIcons name="add" size={16} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.lineTotal}>{formatPrice(item.price * item.quantity)}</Text>
    </View>
  </View>
);

const CartScreen = ({ navigation }) => {
  const cart = useStore((s) => s.cart);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const updateQuantity = useStore((s) => s.updateQuantity);
  const getCartTotal = useStore((s) => s.getCartTotal);
  const clearCart = useStore((s) => s.clearCart);
  const toastMessage = useStore((s) => s.toastMessage);

  const subtotal = getCartTotal();
  const shipping = subtotal > 35 ? 0 : 4.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.header}>
          <SafeAreaView edges={['top']} style={styles.headerInner}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <MaterialIcons name="arrow-back" size={22} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Cart</Text>
            <View style={{ width: 36 }} />
          </SafeAreaView>
        </LinearGradient>
        <View style={styles.emptyContainer}>
          <MaterialIcons name="shopping-cart" size={80} color={Colors.lightGray} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Add some books to get started!</Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => navigation.navigate('Browse')}
          >
            <Text style={styles.shopBtnText}>Browse Books</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.headerInner}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart ({cart.length})</Text>
          <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onRemove={() => removeFromCart(item.id)}
            onUpdateQty={(qty) => updateQuantity(item.id, qty)}
          />
        )}
        ListFooterComponent={
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            {[
              { label: 'Subtotal', value: formatPrice(subtotal) },
              { label: `Shipping ${shipping === 0 ? '(Free over $35)' : ''}`, value: shipping === 0 ? 'FREE' : formatPrice(shipping) },
              { label: 'Tax (8%)', value: formatPrice(tax) },
            ].map(({ label, value }) => (
              <View key={label} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{label}</Text>
                <Text style={[styles.summaryValue, value === 'FREE' && { color: Colors.success }]}>
                  {value}
                </Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(total)}</Text>
            </View>
            {shipping > 0 && (
              <View style={styles.shippingHint}>
                <MaterialIcons name="local-shipping" size={14} color={Colors.primary} />
                <Text style={styles.shippingHintText}>
                  Add {formatPrice(35 - subtotal)} more for free shipping!
                </Text>
              </View>
            )}
          </View>
        }
      />

      {/* Checkout Button */}
      <SafeAreaView edges={['bottom']} style={styles.checkoutBar}>
        <View style={styles.checkoutContent}>
          <View>
            <Text style={styles.totalSmall}>Total</Text>
            <Text style={styles.totalBig}>{formatPrice(total)}</Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => navigation.navigate('Checkout')}
          >
            <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
            <MaterialIcons name="arrow-forward" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Toast message={toastMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingBottom: Spacing.sm },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  backBtn: { padding: Spacing.xs, width: 36 },
  headerTitle: {
    flex: 1,
    color: Colors.white,
    fontSize: Typography.fontSizeLG,
    fontWeight: Typography.fontWeightBold,
    textAlign: 'center',
  },
  clearBtn: { padding: Spacing.xs },
  clearText: {
    color: Colors.accentLight,
    fontSize: Typography.fontSizeSM,
    fontWeight: Typography.fontWeightSemiBold,
  },
  list: { padding: Spacing.md, paddingBottom: 120 },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
    ...Shadows.small,
  },
  itemInfo: { flex: 1, gap: 4 },
  itemTitle: {
    fontSize: Typography.fontSizeMD,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.dark,
    lineHeight: 20,
  },
  itemAuthor: { fontSize: Typography.fontSizeSM, color: Colors.darkGray },
  itemPrice: {
    fontSize: Typography.fontSizeMD,
    fontWeight: Typography.fontWeightBold,
    color: Colors.accent,
  },
  itemActions: { alignItems: 'flex-end', justifyContent: 'space-between' },
  removeBtn: { padding: 4 },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  qtyBtn: { padding: Spacing.xs, backgroundColor: Colors.lightGray },
  qtyText: {
    paddingHorizontal: Spacing.sm,
    fontSize: Typography.fontSizeMD,
    fontWeight: Typography.fontWeightBold,
    color: Colors.dark,
    minWidth: 28,
    textAlign: 'center',
  },
  lineTotal: {
    fontSize: Typography.fontSizeMD,
    fontWeight: Typography.fontWeightBold,
    color: Colors.dark,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.small,
  },
  summaryTitle: {
    fontSize: Typography.fontSizeLG,
    fontWeight: Typography.fontWeightBold,
    color: Colors.dark,
    marginBottom: Spacing.xs,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: Typography.fontSizeMD, color: Colors.darkGray },
  summaryValue: { fontSize: Typography.fontSizeMD, fontWeight: Typography.fontWeightSemiBold, color: Colors.dark },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.xs },
  totalLabel: { fontSize: Typography.fontSizeLG, fontWeight: Typography.fontWeightBold, color: Colors.dark },
  totalValue: { fontSize: Typography.fontSizeXL, fontWeight: Typography.fontWeightBold, color: Colors.accent },
  shippingHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.offWhite,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xs,
  },
  shippingHintText: { fontSize: Typography.fontSizeSM, color: Colors.primary, fontWeight: Typography.fontWeightMedium },
  checkoutBar: { backgroundColor: Colors.white, borderTopWidth: 1, borderColor: Colors.border, ...Shadows.medium },
  checkoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  totalSmall: { fontSize: Typography.fontSizeSM, color: Colors.darkGray },
  totalBig: { fontSize: Typography.fontSize2XL, fontWeight: Typography.fontWeightBold, color: Colors.dark },
  checkoutBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  checkoutBtnText: { color: Colors.white, fontWeight: Typography.fontWeightBold, fontSize: Typography.fontSizeMD },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md, padding: Spacing.xxxxl },
  emptyTitle: { fontSize: Typography.fontSize2XL, fontWeight: Typography.fontWeightBold, color: Colors.darkGray },
  emptySub: { fontSize: Typography.fontSizeMD, color: Colors.gray, textAlign: 'center' },
  shopBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
  },
  shopBtnText: { color: Colors.white, fontWeight: Typography.fontWeightBold, fontSize: Typography.fontSizeMD },
});

export default CartScreen;
