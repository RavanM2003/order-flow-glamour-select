
export function generateOrderId(): string {
  const prefix = 'ORD';
  const letters = Array.from({ length: 3 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('');
  const numbers = Array.from({ length: 3 }, () =>
    Math.floor(Math.random() * 10)
  ).join('');
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  return `${prefix}-${letters}-${year}-${month}-${numbers}`;
}

export function calculateDiscountedPrice(price: number, discount?: number): number {
  if (!discount || discount <= 0) return price;
  return price * (1 - discount / 100);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return remainingMinutes > 0 ? `${hours}s ${remainingMinutes}d` : `${hours}s`;
  }
  return `${remainingMinutes}d`;
}
