import { useWindowDimensions } from 'react-native';

const BREAKPOINTS = {
  sm: 375,
  md: 768,
  lg: 1024,
};

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();

  const isSmall = width < BREAKPOINTS.sm;
  const isMedium = width >= BREAKPOINTS.sm && width < BREAKPOINTS.md;
  const isTablet = width >= BREAKPOINTS.md;
  const isLarge = width >= BREAKPOINTS.lg;

  const numColumns = isTablet ? 4 : isMedium ? 3 : 2;
  const cardWidth = isTablet ? (width - 80) / 4 : isMedium ? (width - 60) / 3 : (width - 48) / 2;
  const heroHeight = isTablet ? 320 : 220;
  const fontSize = (base) => (isTablet ? base * 1.15 : base);

  return {
    width,
    height,
    isSmall,
    isMedium,
    isTablet,
    isLarge,
    numColumns,
    cardWidth,
    heroHeight,
    fontSize,
  };
};
