export const formatVnd = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};
// Sửa lại hàm format tiền
export const formatPriceToVnd = (price: number) => {
  return `${price.toLocaleString('vi-VN')} VND`;
};