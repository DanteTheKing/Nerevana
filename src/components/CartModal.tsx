import React, { useState } from 'react';
import { CartItem, calculateOrderPricing, formatCurrency } from '../utils/procurement';
import { Institution, ProcurementOrder, Supplier } from '../data/seedData';
import { X, Trash2, Plus, Minus, FileText, CheckCircle2, ShieldCheck, Calendar, MapPin } from 'lucide-react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  buyerInstitution: Institution;
  suppliers: Supplier[];
  onSubmitOrder: (order: ProcurementOrder) => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  buyerInstitution,
  suppliers,
  onSubmitOrder,
}) => {
  const [notes, setNotes] = useState('Standard delivery to loading dock. Require invoice for accounts payable.');
  const [poNumber, setPoNumber] = useState(`PO-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [expectedDate, setExpectedDate] = useState('Within 3 business days');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrders, setCreatedOrders] = useState<ProcurementOrder[]>([]);

  if (!isOpen) return null;

  const pricing = calculateOrderPricing(cartItems, 500, 35);

  const handleConfirmOrder = () => {
    if (cartItems.length === 0) return;
    setIsSubmitting(true);

    // Group items by supplierId
    const supplierGroups = new Map<string, CartItem[]>();
    for (const item of cartItems) {
      const sId =
        item.supplierId ||
        suppliers.find((s) => s.name.toLowerCase() === item.supplierName?.toLowerCase())?.id ||
        (item.title.toLowerCase().includes('pawpaw') ||
        item.title.toLowerCase().includes('tomato') ||
        item.title.toLowerCase().includes('onion') ||
        item.title.toLowerCase().includes('kale') ||
        item.title.toLowerCase().includes('banana')
          ? 'sup_elizabeth'
          : suppliers[0]?.id || 'sup_elizabeth');

      if (!supplierGroups.has(sId)) {
        supplierGroups.set(sId, []);
      }
      supplierGroups.get(sId)!.push(item);
    }

    const generatedOrders: ProcurementOrder[] = [];
    let groupIdx = 0;

    supplierGroups.forEach((groupItems, sId) => {
      groupIdx++;
      const matchedSupplier = suppliers.find((s) => s.id === sId);
      const supplierName =
        matchedSupplier?.name ||
        groupItems[0].supplierName ||
        (sId === 'sup_elizabeth' ? 'Elizabeth' : 'Supplier');

      const groupPricing = calculateOrderPricing(groupItems, 500, 35);
      const generatedPoNumber =
        supplierGroups.size > 1
          ? `${poNumber.trim()}-${groupIdx}`
          : (poNumber.trim() || `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`);

      const newOrder: ProcurementOrder = {
        id: `po_${Date.now()}_${sId}`,
        poNumber: generatedPoNumber,
        buyerId: buyerInstitution.id,
        buyerName: buyerInstitution.name,
        institutionType: buyerInstitution.type,
        supplierId: sId,
        supplierName: supplierName,
        items: groupItems.map((item) => ({
          productId: item.productId,
          title: item.title,
          unitPrice: item.unitPrice,
          unit: item.unit,
          quantity: item.quantity,
          lineTotal: Math.round(item.unitPrice * item.quantity * 100) / 100,
        })),
        subtotal: groupPricing.subtotal,
        discount: groupPricing.discount,
        deliveryFee: groupPricing.deliveryFee,
        totalAmount: groupPricing.total,
        status: 'submitted',
        deliveryAddress: buyerInstitution.address,
        deliveryLat: buyerInstitution.lat,
        deliveryLng: buyerInstitution.lng,
        notes: notes.trim(),
        expectedDeliveryDate: expectedDate,
        createdAt: new Date().toISOString(),
      };

      onSubmitOrder(newOrder);
      generatedOrders.push(newOrder);
    });

    setTimeout(() => {
      setCreatedOrders(generatedOrders);
      setIsSubmitting(false);
      onClearCart();
    }, 400);
  };

  const handleModalClose = () => {
    setCreatedOrders([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-white via-sky-50/30 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                {createdOrders.length > 0 ? 'Purchase Order Dispatched' : 'Institutional Purchase Order'}
              </h3>
              <p className="text-xs text-slate-500">
                {createdOrders.length > 0
                  ? createdOrders.map((o) => o.poNumber).join(', ')
                  : `${buyerInstitution.name}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleModalClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success confirmation screen */}
        {createdOrders.length > 0 ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-900">
                {createdOrders.length > 1 ? 'Purchase Orders Transmitted!' : 'Purchase Order Transmitted!'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                {createdOrders.length > 1 ? (
                  <>
                    Your items were split into <strong>{createdOrders.length} separate POs</strong> by supplier and routed to each vendor.
                  </>
                ) : (
                  <>
                    Your order <strong>{createdOrders[0].poNumber}</strong> has been routed to <strong>{createdOrders[0].supplierName}</strong>. You can monitor the real-time status in your Orders tracker.
                  </>
                )}
              </p>
            </div>

            <div className="space-y-2 text-left">
              {createdOrders.map((ord) => (
                <div key={ord.id} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-slate-800">{ord.poNumber}</span>
                    <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                      {ord.supplierName}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Items Ordered:</span>
                    <span className="font-semibold text-slate-900">{ord.items.length} products ({ord.items.reduce((s, i) => s + i.quantity, 0)} units)</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Order Value:</span>
                    <span className="font-bold text-slate-900 text-sm">{formatCurrency(ord.totalAmount)}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleModalClose}
              className="w-full py-3 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition-all cursor-pointer shadow-xs"
            >
              Back to Catalog
            </button>
          </div>
        ) : (
          <>
            {/* Scrollable Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              {cartItems.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-sm">Your procurement order is empty</p>
                  <p className="text-xs text-slate-400 mt-1">Select items from the catalog to build your purchase order.</p>
                </div>
              ) : (
                <>
                  {/* Items list */}
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Line Items ({cartItems.length})
                    </div>
                    {cartItems.map((item) => (
                      <div
                        key={item.productId}
                        className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">{item.title}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2">
                            <span>{formatCurrency(item.unitPrice)} / {item.unit}</span>
                            {item.supplierName && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="font-semibold text-sky-700">{item.supplierName}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Stepper */}
                          <div className="flex items-center border border-slate-200 rounded-xl bg-white p-0.5">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-slate-800">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right min-w-[70px]">
                            <div className="text-xs sm:text-sm font-bold text-slate-900">
                              {formatCurrency(item.unitPrice * item.quantity)}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.productId)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded-lg cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Institutional PO details form */}
                  <div className="pt-2 border-t border-slate-100 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Procurement Details
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Purchase Order (PO) #</label>
                        <input
                          type="text"
                          value={poNumber}
                          onChange={(e) => setPoNumber(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:bg-white focus:outline-hidden focus:border-sky-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Target Delivery Schedule</label>
                        <input
                          type="text"
                          value={expectedDate}
                          onChange={(e) => setExpectedDate(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-hidden focus:border-sky-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-600 font-semibold mb-1">
                        Campus Delivery Instructions & Receiving Dock
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-sky-500 resize-none"
                      />
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Gross Subtotal</span>
                      <span>{formatCurrency(pricing.subtotal)}</span>
                    </div>

                    {pricing.discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>Institutional Bulk Discount</span>
                        <span>-{formatCurrency(pricing.discount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-600">
                      <span>Consolidated Freight / Delivery</span>
                      <span>{pricing.deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : formatCurrency(pricing.deliveryFee)}</span>
                    </div>

                    <div className="pt-2 border-t border-sky-200 flex justify-between items-center text-slate-900">
                      <span className="font-bold text-sm">Total PO Amount</span>
                      <span className="font-extrabold text-base sm:text-lg text-sky-800">
                        {formatCurrency(pricing.total)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer actions */}
            {cartItems.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl text-xs font-semibold cursor-pointer transition-all"
                >
                  Continue Shopping
                </button>

                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white rounded-2xl text-xs sm:text-sm font-semibold shadow-md shadow-sky-500/20 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Transmitting PO...' : `Authorize & Send PO (${formatCurrency(pricing.total)})`}</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
