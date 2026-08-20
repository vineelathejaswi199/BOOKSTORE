import { create } from 'zustand';

const useStore = create((set, get) => ({
  // Cart
  cart: [],
  addToCart: (book) => {
    const { cart } = get();
    const existing = cart.find(item => item.id === book.id);
    if (existing) {
      set({
        cart: cart.map(item =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      });
    } else {
      set({ cart: [...cart, { ...book, quantity: 1 }] });
    }
  },
  removeFromCart: (bookId) => {
    set({ cart: get().cart.filter(item => item.id !== bookId) });
  },
  updateQuantity: (bookId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(bookId);
      return;
    }
    set({
      cart: get().cart.map(item =>
        item.id === bookId ? { ...item, quantity } : item
      ),
    });
  },
  clearCart: () => set({ cart: [] }),
  getCartTotal: () => {
    return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  getCartCount: () => {
    return get().cart.reduce((total, item) => total + item.quantity, 0);
  },

  // Wishlist
  wishlist: [],
  toggleWishlist: (book) => {
    const { wishlist } = get();
    const exists = wishlist.find(item => item.id === book.id);
    if (exists) {
      set({ wishlist: wishlist.filter(item => item.id !== book.id) });
    } else {
      set({ wishlist: [...wishlist, book] });
    }
  },
  isInWishlist: (bookId) => {
    return get().wishlist.some(item => item.id === bookId);
  },

  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Filters
  selectedCategory: 'all',
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  priceRange: [0, 50],
  setPriceRange: (range) => set({ priceRange: range }),
  sortBy: 'featured',
  setSortBy: (sort) => set({ sortBy: sort }),

  // Orders
  orders: [],
  addOrder: (order) => {
    set({ orders: [...get().orders, { ...order, id: Date.now().toString(), date: new Date().toISOString() }] });
  },

  // User
  user: {
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    avatar: null,
    memberSince: '2022',
  },
  updateUser: (updates) => set({ user: { ...get().user, ...updates } }),

  // UI
  toastMessage: null,
  showToast: (message) => {
    set({ toastMessage: message });
    setTimeout(() => set({ toastMessage: null }), 2500);
  },
}));

export default useStore;
