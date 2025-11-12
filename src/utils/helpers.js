export const getStockStatus = (stock) => {
  if (stock === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
  if (stock < 20) return { text: 'Low Stock', color: 'bg-orange-100 text-orange-800' };
  return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
};