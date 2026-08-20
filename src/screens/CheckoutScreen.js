import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import useStore from '../store/useStore';
import { formatPrice } from '../utils/helpers';

const STEPS = ['Shipping', 'Payment', 'Confirm'];

const InputField = ({ label, value, onChangeText, placeholder, keyboardType, icon }) => (
  <View style={styles.inputWrap}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputRow}>
      {icon && <MaterialIcons name={icon} size={18} color={Colors.gray} style={styles.inputIcon} />}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray}
        keyboardType={keyboardType || 'default'}
      />
    </View>
  </View>
);

const CheckoutScreen = ({ navigation }) => {
  const cart = useStore((s) => s.cart);
  const getCartTotal = useStore((s) => s.getCartTotal);
  const clearCart = useStore((s) => s.clearCart);
  const addOrder = useStore((s) => s.addOrder);

  const subtotal = getCartTotal();
  const shipping = subtotal > 35 ? 0 : 4.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [payMethod, setPayMethod] = useState('card');
  const [ordered, setOrdered] = useState(false);
  const [orderId, setOrderId] = useState('');

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
  };
  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else navigation.goBack();
  };

  const handlePlaceOrder = () => {
    const id = 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setOrderId(id);
    addOrder({ id, items: cart, total, address: form });
    clearCart();
    setOrdered(true);
  };

  if (ordered) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.header}>
          <SafeAreaView edges={['top']} style={styles.headerInner}>
            <Text style={styles.headerTitle}>Order Confirmed</Text>
          </SafeAreaView>
        </LinearGradient>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <MaterialIcons name="check-circle" size={72} color={Colors.success} />
          </View>
          <Text style={styles.successTitle}>Order Placed!</Text>
          <Text style={styles.successSub}>
            Thank you for your purchase. Your books are on their way!
          </Text>
          <View style={styles.orderIdBox}>
            <Text style={styles.orderIdLabel}>Order ID</Text>
            <Text style={styles.orderIdValue}>{orderId}</Text>
          </View>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.continueBtnText}>Continue Shopping</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileBtnText}>View My Orders</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.headerInner}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 36 }} />
        </SafeAreaView>
        {/* Step indicator */}
        <View style={styles.stepBar}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <View style={styles.stepItem}>
                <View style={[styles.stepCircle, i <= step && styles.stepCircleActive]}>
                  {i < step ? (
                    <MaterialIcons name="check" size={14} color={Colors.white} />
                  ) : (
                    <Text style={[styles.stepNum, i <= step && styles.stepNumActive]}>
                      {i + 1}
                    </Text>
                  )}
                </View>
                <Text style={[styles.stepLabel, i <= step && styles.stepLabelActive]}>{s}</Text>
              </View>
              {i < STEPS.length - 1 && (
                <View style={[styles.stepLine, i < step && styles.stepLineActive]} />
              )}
            </React.Fragment>
          ))}
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Step 0: Shipping */}
        {step === 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipping Address</Text>
            <View style={styles.row2}>
              <View style={{ flex: 1 }}>
                <InputField label="First Name" value={form.firstName} onChangeText={set('firstName')} placeholder="John" icon="person" />
              </View>
              <View style={{ flex: 1 }}>
                <InputField label="Last Name" value={form.lastName} onChangeText={set('lastName')} placeholder="Doe" />
              </View>
            </View>
            <InputField label="Email" value={form.email} onChangeText={set('email')} placeholder="john@example.com" keyboardType="email-address" icon="email" />
            <InputField label="Street Address" value={form.address} onChangeText={set('address')} placeholder="123 Main St" icon="home" />
            <View style={styles.row2}>
              <View style={{ flex: 1 }}>
                <InputField label="City" value={form.city} onChangeText={set('city')} placeholder="New York" />
              </View>
              <View style={{ flex: 1 }}>
                <InputField label="State" value={form.state} onChangeText={set('state')} placeholder="NY" />
              </View>
            </View>
            <View style={styles.row2}>
              <View style={{ flex: 1 }}>
                <InputField label="ZIP Code" value={form.zip} onChangeText={set('zip')} placeholder="10001" keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <InputField label="Country" value={form.country} onChangeText={set('country')} placeholder="United States" />
              </View>
            </View>
          </View>
        )}

        {/* Step 1: Payment */}
        {step === 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.payMethods}>
              {[
                { key: 'card', label: 'Credit / Debit Card', icon: 'credit-card' },
                { key: 'paypal', label: 'PayPal', icon: 'account-balance-wallet' },
                { key: 'apple', label: 'Apple Pay', icon: 'phone-iphone' },
              ].map((m) => (
                <TouchableOpacity
                  key={m.key}
                  style={[styles.payOption, payMethod === m.key && styles.payOptionSelected]}
                  onPress={() => setPayMethod(m.key)}
                >
                  <MaterialIcons
                    name={m.icon}
                    size={22}
                    color={payMethod === m.key ? Colors.primary : Colors.gray}
                  />
                  <Text style={[styles.payLabel, payMethod === m.key && styles.payLabelSelected]}>
                    {m.label}
                  </Text>
                  {payMethod === m.key && (
                    <MaterialIcons name="radio-button-checked" size={18} color={Colors.accent} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            {payMethod === 'card' && (
              <>
                <InputField label="Name on Card" value={form.cardName} onChangeText={set('cardName')} placeholder="John Doe" icon="person" />
                <InputField label="Card Number" value={form.cardNumber} onChangeText={set('cardNumber')} placeholder="•••• •••• •••• ••••" keyboardType="numeric" icon="credit-card" />
                <View style={styles.row2}>
                  <View style={{ flex: 1 }}>
                    <InputField label="Expiry" value={form.expiry} onChangeText={set('expiry')} placeholder="MM/YY" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <InputField label="CVV" value={form.cvv} onChangeText={set('cvv')} placeholder="•••" keyboardType="numeric" />
                  </View>
                </View>
              </>
            )}
            {payMethod !== 'card' && (
              <View style={styles.altPayNotice}>
                <MaterialIcons name="info-outline" size={20} color={Colors.primary} />
                <Text style={styles.altPayText}>
                  You will be redirected to {payMethod === 'paypal' ? 'PayPal' : 'Apple Pay'} to complete payment.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Review Order</Text>
            {cart.map((item) => (
              <View key={item.id} style={styles.reviewItem}>
                <Text style={styles.reviewItemTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.reviewItemQty}>×{item.quantity}</Text>
                <Text style={styles.reviewItemPrice}>{formatPrice(item.price * item.quantity)}</Text>
              </View>
            ))}
            <View style={styles.divider} />
            {[
              { label: 'Subtotal', val: formatPrice(subtotal) },
              { label: 'Shipping', val: shipping === 0 ? 'FREE' : formatPrice(shipping) },
              { label: 'Tax', val: formatPrice(tax) },
            ].map(({ label, val }) => (
              <View key={label} style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>{label}</Text>
                <Text style={[styles.reviewVal, val === 'FREE' && { color: Colors.success }]}>{val}</Text>
              </View>
            ))}
            <View style={[styles.reviewRow, styles.reviewTotalRow]}>
              <Text style={styles.reviewTotalLabel}>Total</Text>
              <Text style={styles.reviewTotalVal}>{formatPrice(total)}</Text>
            </View>
            <View style={styles.addressPreview}>
              <MaterialIcons name="location-on" size={16} color={Colors.accent} />
              <Text style={styles.addressText}>
                {form.address}, {form.city}, {form.state} {form.zip}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <SafeAreaView edges={['bottom']} style={styles.cta}>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={step < STEPS.length - 1 ? handleNext : handlePlaceOrder}
        >
          <Text style={styles.ctaBtnText}>
            {step < STEPS.length - 1 ? 'Continue' : `Place Order · ${formatPrice(total)}`}
          </Text>
          <MaterialIcons name="arrow-forward" size={18} color={Colors.white} />
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingBottom: Spacing.md },
  headerInner: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm,
  },
  backBtn: { padding: Spacing.xs, width: 36 },
  headerTitle: {
    flex: 1, color: Colors.white,
    fontSize: Typography.fontSizeLG, fontWeight: Typography.fontWeightBold, textAlign: 'center',
  },
  stepBar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md, gap: 0,
  },
  stepItem: { alignItems: 'center', gap: 4 },
  stepCircle: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  stepCircleActive: { backgroundColor: Colors.accent },
  stepNum: { color: 'rgba(255,255,255,0.6)', fontSize: Typography.fontSizeSM, fontWeight: Typography.fontWeightBold },
  stepNumActive: { color: Colors.white },
  stepLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: Typography.fontWeightMedium },
  stepLabelActive: { color: Colors.white },
  stepLine: { flex: 1, height: 2, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 18, marginHorizontal: 4 },
  stepLineActive: { backgroundColor: Colors.accent },
  scrollContent: { padding: Spacing.lg, paddingBottom: 100 },
  section: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, gap: Spacing.md, ...Shadows.small,
  },
  sectionTitle: { fontSize: Typography.fontSizeXL, fontWeight: Typography.fontWeightBold, color: Colors.dark },
  row2: { flexDirection: 'row', gap: Spacing.sm },
  inputWrap: { gap: 4 },
  inputLabel: { fontSize: Typography.fontSizeSM, fontWeight: Typography.fontWeightSemiBold, color: Colors.darkGray },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: BorderRadius.md, paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.offWhite,
  },
  inputIcon: { marginRight: 6 },
  input: { flex: 1, color: Colors.dark, fontSize: Typography.fontSizeMD, paddingVertical: Spacing.sm },
  payMethods: { gap: Spacing.sm },
  payOption: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: BorderRadius.md, padding: Spacing.md,
  },
  payOptionSelected: { borderColor: Colors.primary, backgroundColor: Colors.offWhite },
  payLabel: { flex: 1, fontSize: Typography.fontSizeMD, color: Colors.darkGray },
  payLabelSelected: { color: Colors.primary, fontWeight: Typography.fontWeightSemiBold },
  altPayNotice: {
    flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start',
    backgroundColor: Colors.offWhite, borderRadius: BorderRadius.md, padding: Spacing.md,
  },
  altPayText: { flex: 1, fontSize: Typography.fontSizeSM, color: Colors.darkGray, lineHeight: 20 },
  reviewItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  reviewItemTitle: { flex: 1, fontSize: Typography.fontSizeMD, color: Colors.dark },
  reviewItemQty: { fontSize: Typography.fontSizeSM, color: Colors.darkGray },
  reviewItemPrice: { fontSize: Typography.fontSizeMD, fontWeight: Typography.fontWeightSemiBold, color: Colors.dark },
  divider: { height: 1, backgroundColor: Colors.border },
  reviewRow: { flexDirection: 'row', justifyContent: 'space-between' },
  reviewLabel: { fontSize: Typography.fontSizeMD, color: Colors.darkGray },
  reviewVal: { fontSize: Typography.fontSizeMD, fontWeight: Typography.fontWeightSemiBold, color: Colors.dark },
  reviewTotalRow: { paddingTop: Spacing.sm },
  reviewTotalLabel: { fontSize: Typography.fontSizeLG, fontWeight: Typography.fontWeightBold, color: Colors.dark },
  reviewTotalVal: { fontSize: Typography.fontSizeXL, fontWeight: Typography.fontWeightBold, color: Colors.accent },
  addressPreview: {
    flexDirection: 'row', gap: Spacing.xs, alignItems: 'flex-start',
    backgroundColor: Colors.offWhite, borderRadius: BorderRadius.md, padding: Spacing.md,
  },
  addressText: { flex: 1, fontSize: Typography.fontSizeSM, color: Colors.darkGray },
  cta: { backgroundColor: Colors.white, borderTopWidth: 1, borderColor: Colors.border, ...Shadows.medium },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, backgroundColor: Colors.accent,
    marginHorizontal: Spacing.lg, marginVertical: Spacing.md,
    paddingVertical: Spacing.md, borderRadius: BorderRadius.lg,
  },
  ctaBtnText: { color: Colors.white, fontWeight: Typography.fontWeightBold, fontSize: Typography.fontSizeLG },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xxl, gap: Spacing.lg },
  successIcon: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: Colors.offWhite, alignItems: 'center', justifyContent: 'center',
    ...Shadows.medium,
  },
  successTitle: { fontSize: Typography.fontSize3XL, fontWeight: Typography.fontWeightExtraBold, color: Colors.dark },
  successSub: { fontSize: Typography.fontSizeMD, color: Colors.darkGray, textAlign: 'center', lineHeight: 22 },
  orderIdBox: {
    backgroundColor: Colors.offWhite, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, alignItems: 'center', gap: 4, width: '100%',
    borderWidth: 1, borderColor: Colors.border,
  },
  orderIdLabel: { fontSize: Typography.fontSizeSM, color: Colors.darkGray },
  orderIdValue: { fontSize: Typography.fontSizeXL, fontWeight: Typography.fontWeightBold, color: Colors.primary },
  continueBtn: {
    backgroundColor: Colors.accent, paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md, borderRadius: BorderRadius.full, width: '100%', alignItems: 'center',
  },
  continueBtnText: { color: Colors.white, fontWeight: Typography.fontWeightBold, fontSize: Typography.fontSizeMD },
  profileBtn: {
    borderWidth: 1.5, borderColor: Colors.primary, paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md, borderRadius: BorderRadius.full, width: '100%', alignItems: 'center',
  },
  profileBtnText: { color: Colors.primary, fontWeight: Typography.fontWeightBold, fontSize: Typography.fontSizeMD },
});

export default CheckoutScreen;
