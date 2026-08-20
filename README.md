# 📚 BOOKSTORE — eCommerce Bookstore App

A React Native eCommerce bookstore app built with Expo. Browse, search, and purchase books with a smooth mobile experience on iOS, Android, and Web.

---

## 🚀 Features

- 🏠 **Home Screen** — Featured books, categories, and trending picks
- 🔍 **Browse Screen** — Search and filter books by category
- 📖 **Book Detail Screen** — Full book info, ratings, and add to cart
- 🛒 **Cart Screen** — Manage items, quantities, and totals
- 💳 **Checkout Screen** — Complete your order
- ❤️ **Wishlist Screen** — Save books for later
- 👤 **Profile Screen** — User account management
- ⭐ **Star Ratings**, **Badges**, and **Toast notifications**

---

## 🛠️ Tech Stack

| Technology | Version |
|---|---|
| [Expo](https://expo.dev) | ~57.0.12 |
| [React Native](https://reactnative.dev) | 0.86.2 |
| [React](https://react.dev) | 19.2.3 |
| [React Navigation](https://reactnavigation.org) | v7 |
| [Zustand](https://zustand-demo.pmnd.rs) | ^5.0.15 |
| [React Native Paper](https://reactnativepaper.com) | ^5.15.3 |
| [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) | ~57.0.1 |
| [Async Storage](https://react-native-async-storage.github.io/async-storage/) | ^3.1.1 |

---

## 📁 Project Structure

```
eCommerce-bookstore/
├── App.js                  # Entry point
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Badge.js
│   │   ├── BookCard.js
│   │   ├── BookCover.js
│   │   ├── CategoryBar.js
│   │   ├── Header.js
│   │   ├── SectionHeader.js
│   │   ├── StarRating.js
│   │   └── Toast.js
│   ├── data/
│   │   └── books.js        # Book data
│   ├── hooks/
│   │   └── useResponsive.js
│   ├── navigation/
│   │   └── AppNavigator.js # Bottom tab + stack navigation
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── BrowseScreen.js
│   │   ├── BookDetailScreen.js
│   │   ├── CartScreen.js
│   │   ├── CheckoutScreen.js
│   │   ├── WishlistScreen.js
│   │   └── ProfileScreen.js
│   ├── store/
│   │   └── useStore.js     # Zustand global state
│   ├── theme/
│   │   └── index.js        # Colors, fonts, spacing
│   └── utils/
│       └── helpers.js      # Utility functions
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v18 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

```bash
npm install -g expo-cli
```

### Installation

```bash
# Clone the repository
git clone https://github.com/vineelathejaswi199/BOOKSTORE.git
cd BOOKSTORE

# Install dependencies
npm install
```

### Running the App

```bash
# Start Expo dev server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

Scan the QR code with the **Expo Go** app on your phone to preview it instantly.

---

## 📱 Screenshots

> Coming soon

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is for educational and personal use.

---

> Built with ❤️ using React Native & Expo
