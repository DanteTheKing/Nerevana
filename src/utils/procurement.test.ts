import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDistanceKm,
  isWithinDeliveryZone,
  calculateOrderPricing,
  getNextOrderStatus,
  CartItem,
} from './procurement';

test('calculateDistanceKm computes distance accurately', () => {
  // NYC to Philadelphia approx 130 km
  const dist = calculateDistanceKm(40.7128, -74.006, 39.9526, -75.1652);
  assert.ok(dist > 120 && dist < 145, `Distance was ${dist}`);
});

test('calculateDistanceKm returns 0 for same point', () => {
  const dist = calculateDistanceKm(37.7749, -122.4194, 37.7749, -122.4194);
  assert.equal(dist, 0);
});

test('isWithinDeliveryZone validates range boundaries correctly', () => {
  const supplier = { lat: 37.7749, lng: -122.4194 };
  const nearbySchool = { lat: 37.7833, lng: -122.4167 }; // ~1 km away
  const farSchool = { lat: 38.5816, lng: -121.4944 }; // Sacramento, ~120 km away

  assert.equal(isWithinDeliveryZone(supplier, 15, nearbySchool), true);
  assert.equal(isWithinDeliveryZone(supplier, 15, farSchool), false);
  assert.equal(isWithinDeliveryZone(supplier, 150, farSchool), true);
  assert.equal(isWithinDeliveryZone(supplier, 0, nearbySchool), false);
});

test('calculateOrderPricing applies volume discounts and handles delivery fee', () => {
  const items: CartItem[] = [
    {
      productId: 'p1',
      title: 'A4 Copier Paper (Case)',
      unitPrice: 40,
      unit: 'case',
      quantity: 10,
      bulkThreshold: 10,
      bulkDiscountPercent: 10, // 10% discount on 400 = 40 off
    },
    {
      productId: 'p2',
      title: 'Classroom Whiteboard Markers',
      unitPrice: 15,
      unit: 'pack',
      quantity: 2,
    },
  ];

  const pricing = calculateOrderPricing(items, 500, 35);
  // Subtotal = 10*40 + 2*15 = 430
  assert.equal(pricing.subtotal, 430);
  // Discount = 40 (from p1)
  assert.equal(pricing.discount, 40);
  // Net = 390 (< 500 threshold, so delivery fee 35 applies)
  assert.equal(pricing.deliveryFee, 35);
  // Total = 390 + 35 = 425
  assert.equal(pricing.total, 425);
});

test('calculateOrderPricing grants free delivery above threshold', () => {
  const items: CartItem[] = [
    {
      productId: 'p1',
      title: 'Microscope Set for STEM Lab',
      unitPrice: 200,
      unit: 'unit',
      quantity: 3, // 600
    },
  ];

  const pricing = calculateOrderPricing(items, 500, 35);
  assert.equal(pricing.subtotal, 600);
  assert.equal(pricing.discount, 0);
  assert.equal(pricing.deliveryFee, 0); // Free delivery
  assert.equal(pricing.total, 600);
});

test('getNextOrderStatus transitions correctly through procurement lifecycle', () => {
  assert.equal(getNextOrderStatus('submitted'), 'confirmed');
  assert.equal(getNextOrderStatus('confirmed'), 'in_transit');
  assert.equal(getNextOrderStatus('in_transit'), 'delivered');
  assert.equal(getNextOrderStatus('delivered'), null);
  assert.equal(getNextOrderStatus('cancelled'), null);
});
