/**
 * Core procurement and geographic utilities for EduSupply Connect
 */

export interface CartItem {
  productId: string;
  title: string;
  unitPrice: number;
  unit: string;
  quantity: number;
  bulkThreshold?: number;
  bulkDiscountPercent?: number;
}

export interface PricingSummary {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Calculates distance between two points in kilometers using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Determines whether a buyer location is within a supplier's delivery coverage radius
 */
export function isWithinDeliveryZone(
  supplierLoc: Coordinates,
  radiusKm: number,
  buyerLoc: Coordinates
): boolean {
  if (radiusKm <= 0) return false;
  const dist = calculateDistanceKm(
    supplierLoc.lat,
    supplierLoc.lng,
    buyerLoc.lat,
    buyerLoc.lng
  );
  return dist <= radiusKm;
}

/**
 * Calculates total order pricing, applying quantity-based institutional discounts
 */
export function calculateOrderPricing(
  items: CartItem[],
  freeDeliveryThreshold = 500,
  baseDeliveryFee = 35
): PricingSummary {
  let subtotal = 0;
  let discount = 0;

  for (const item of items) {
    const lineGross = item.unitPrice * item.quantity;
    subtotal += lineGross;

    if (
      item.bulkThreshold &&
      item.bulkDiscountPercent &&
      item.quantity >= item.bulkThreshold
    ) {
      const lineDiscount = lineGross * (item.bulkDiscountPercent / 100);
      discount += lineDiscount;
    }
  }

  const effectiveNet = subtotal - discount;
  const deliveryFee = effectiveNet >= freeDeliveryThreshold || items.length === 0 ? 0 : baseDeliveryFee;
  const total = Math.max(0, effectiveNet + deliveryFee);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    deliveryFee,
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Formats a numeric currency value cleanly
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Valid order status sequence transitions
 */
export type OrderStatus = 'submitted' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled';

export function getNextOrderStatus(status: OrderStatus): OrderStatus | null {
  switch (status) {
    case 'submitted':
      return 'confirmed';
    case 'confirmed':
      return 'in_transit';
    case 'in_transit':
      return 'delivered';
    default:
      return null;
  }
}
