import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import useStore from '../store/useStore';
import { formatPrice } from '../utils/helpers';

const MenuItem = ({ icon, label, value, onPress, color, chevron = true }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.menuIcon, { backgroundColor: color + '20' }]}>
      <MaterialIcons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.menuLabel}>{label}</Text>
    {value && <Text style={styles.menuValue}>{value}</Text>}
    {chevron && <MaterialIcons name="chevron-right" size={20} color={Colors.gray} />}
  </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
  const user = useStore((s) => s.user);
  const orders = useStore((s) => s.orders);
  const wishlist = useStore((s) => s.wishlist);
  const cart = useStore((s) => s.cart);
  const getCartCount = useStore((s) => s.getCartCount);

  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.headerGradient}>
        <SafeAreaView edges={['top']} style={styles.headerContent}>
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.name.split(' ').map((n) => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <View style={styles.memberBadge}>
                <MaterialIcons name="star" size={12} color={Colors.gold} />
                <Text style={styles.memberText}>Member since {user.memberSince}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <MaterialIcons name="edit" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              { label: 'Orders', value: orders.length.toString(), icon: 'receipt' },
              { label: 'Wishlist', value: wishlist.length.toString(), icon: 'favorite' },
              { label: 'In Cart', value: getCartCount().toString(), icon: 'shopping-cart' },
              { label: 'Spent', value: formatPrice(totalSpent), icon: 'payments' },
            ].map((stat) => (
              <View key={stat.label} style={styles.statItem}>
                <MaterialIcons name={stat.icon} size={18} color={Colors.accentLight} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Orders</Text>
          {orders.length === 0 ? (
            <View style={styles.noOrders}>
              <MaterialIcons name="receipt-long" size={40} color={Colors.lightGray} />
              <Text style={styles.noOrdersText}>No orders yet</Text>
            </View>
          ) : (
            orders.slice().reverse().slice(0, 3).map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <View style={styles.orderStatus}>
                    <MaterialIcons name="check-circle" size={12} color={Colors.success} />
                    <Text style={styles.orderStatusText}>Confirmed</Text>
                  </View>
                </View>
                <Text style={styles.orderDate}>
                  {new Date(order.date).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                  })}
                </Text>
                <View style={styles.orderFooter}>
                  <Text style={styles.orderItems}>
                    {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                  </Text>
                  <Text style={styles.orderTotal}>{formatPrice(order.total)}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <MenuItem icon="person-outline" label="Personal Information" color={Colors.primary} onPress={() => {}} />
          <MenuItem icon="location-on" label="Saved Addresses" color={Colors.accent} onPress={() => {}} />
          <MenuItem icon="credit-card" label="Payment Methods" color={Colors.success} onPress={() => {}} />
          <MenuItem icon="notifications-none" label="Notifications" color={Colors.gold} onPress={() => {}} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <MenuItem icon="language" label="Language" value="English" color={Colors.primary} onPress={() => {}} />
          <MenuItem icon="attach-money" label="Currency" value="USD" color={Colors.success} onPress={() => {}} />
          <MenuItem icon="dark-mode" label="Appearance" value="Light" color={Colors.darkGray} onPress={() => {}} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <MenuItem icon="help-outline" label="Help Center" color={Colors.primary} onPress={() => {}} />
          <MenuItem icon="chat-bubble-outline" label="Contact Us" color={Colors.accent} onPress={() => {}} />
          <MenuItem icon="star-outline" label="Rate the App" color={Colors.gold} onPress={() => {}} />
          <MenuItem icon="privacy-tip" label="Privacy Policy" color={Colors.darkGray} onPress={() => {}} />
        </View>

        <TouchableOpacity style={styles.signOutBtn}>
          <MaterialIcons name="logout" size={18} color={Colors.accent} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>PageTurn v1.0.0</Text>
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerGradient: { paddingBottom: Spacing.lg },
  headerContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm },
  avatarSection: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: { color: Colors.white, fontSize: Typography.fontSize2XL, fontWeight: Typography.fontWeightBold },
  userInfo: { flex: 1, gap: 3 },
  userName: { color: Colors.white, fontSize: Typography.fontSizeXL, fontWeight: Typography.fontWeightBold },
  userEmail: { color: 'rgba(255,255,255,0.7)', fontSize: Typography.fontSizeSM },
  memberBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  memberText: { color: Colors.gold, fontSize: Typography.fontSizeXS, fontWeight: Typography.fontWeightMedium },
  editBtn: {
    padding: Spacing.sm, backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: BorderRadius.full,
  },
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BorderRadius.lg, padding: Spacing.md, marginTop: Spacing.sm,
  },
  statItem: { alignItems: 'center', gap: 3 },
  statValue: { color: Colors.white, fontSize: Typography.fontSizeLG, fontWeight: Typography.fontWeightBold },
  statLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 10, fontWeight: Typography.fontWeightMedium },
  scroll: { flex: 1 },
  section: {
    backgroundColor: Colors.white, marginHorizontal: Spacing.lg,
    marginTop: Spacing.md, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, ...Shadows.small, gap: 2,
  },
  sectionTitle: { fontSize: Typography.fontSizeLG, fontWeight: Typography.fontWeightBold, color: Colors.dark, marginBottom: Spacing.sm },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.lightGray,
  },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: Typography.fontSizeMD, color: Colors.dark, fontWeight: Typography.fontWeightMedium },
  menuValue: { fontSize: Typography.fontSizeSM, color: Colors.darkGray },
  noOrders: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.lg },
  noOrdersText: { fontSize: Typography.fontSizeMD, color: Colors.gray },
  orderCard: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md,
    padding: Spacing.md, marginBottom: Spacing.sm, gap: 4,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: Typography.fontSizeMD, fontWeight: Typography.fontWeightBold, color: Colors.primary },
  orderStatus: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  orderStatusText: { fontSize: Typography.fontSizeXS, color: Colors.success, fontWeight: Typography.fontWeightSemiBold },
  orderDate: { fontSize: Typography.fontSizeSM, color: Colors.darkGray },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderItems: { fontSize: Typography.fontSizeSM, color: Colors.darkGray },
  orderTotal: { fontSize: Typography.fontSizeMD, fontWeight: Typography.fontWeightBold, color: Colors.accent },
  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    marginHorizontal: Spacing.lg, marginTop: Spacing.lg, paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg, borderWidth: 1.5, borderColor: Colors.accent,
  },
  signOutText: { color: Colors.accent, fontWeight: Typography.fontWeightBold, fontSize: Typography.fontSizeMD },
  version: { textAlign: 'center', color: Colors.gray, fontSize: Typography.fontSizeSM, marginTop: Spacing.md },
});

export default ProfileScreen;
