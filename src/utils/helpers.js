// Utility helpers

export const formatPrice = (price) => `$${price.toFixed(2)}`;

export const calcDiscount = (original, current) =>
  Math.round(((original - current) / original) * 100);

export const truncate = (str, maxLen) =>
  str.length > maxLen ? str.slice(0, maxLen) + '…' : str;

export const formatNumber = (num) => {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};
