import React, { useState } from 'react';
import { Product, ProcurementOrder, Supplier } from '../data/seedData';
import { formatCurrency } from '../utils/procurement';
import {
  Package,
  Plus,
  Truck,
  CheckCircle2,
  XCircle,
  Sliders,
  Calendar,
  Building2,
  MapPin,
  ChevronDown,
  ChevronUp,
  Trash2,
  Clock,
  Sparkles,
} from 'lucide-react';

interface SellerDashboardProps {
  supplier: Supplier;
  products: Product[];
  orders: ProcurementOrder[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onToggleStock: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onAdvanceOrderStatus: (orderId: string) => void;
  onUpdateDeliveryRadius: (radiusKm: number) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  supplier,
  products,
  orders,
  onAddProduct,
  onToggleStock,
  onDeleteProduct,
  onAdvanceOrderStatus,
  onUpdateDeliveryRadius,
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'history' | 'settings'>('catalog');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'successful' | 'unsuccessful'>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New food listing form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Pawpaw');
  const [newPrice, setNewPrice] = useState('20.00');
  const [newUnit, setNewUnit] = useState('crate (15/day)');
  const [newDescription, setNewDescription] = useState('');

  const [tempRadius, setTempRadius] = useState(supplier.deliveryRadiusKm);

  // Supplier's products & orders
  const supplierProducts = products.filter((p) => p.supplierId === supplier.id);
  const supplierOrders = orders.filter((o) => o.supplierId === supplier.id);

  // 4 Successful (delivered) and 1 Unsuccessful (cancelled)
  const successfulOrders = supplierOrders.filter((o) => o.status === 'delivered');
  const unsuccessfulOrders = supplierOrders.filter((o) => o.status === 'cancelled');

  const filteredHistoryOrders = supplierOrders.filter((o) => {
    if (historyFilter === 'successful') return o.status === 'delivered';
    if (historyFilter === 'unsuccessful') return o.status === 'cancelled';
    return true;
  });

  const totalSuccessfulRevenue = successfulOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const handleCreateFoodListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddProduct({
      supplierId: supplier.id,
      supplierName: supplier.name,
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim() || 'Daily supply of fresh harvest.',
      unitPrice: parseFloat(newPrice) || 20,
      unit: newUnit || '15/day',
      stock: 15,
      dailySupplyLimit: 15,
      moq: 1,
      leadTimeDays: 1,
      bulkDiscountPercent: 5,
      bulkThreshold: 15,
      inStock: true,
    });

    setNewTitle('');
    setNewDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Clean Supplier Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-100 uppercase tracking-wide">
              {supplier.category}
            </span>
            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md uppercase tracking-wide">
              Daily Quota: 15 / day
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1.5">
            {supplier.name} Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-sky-500" />
            <span>{supplier.address}</span>
          </p>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200 text-center">
            <div className="text-[10px] font-bold uppercase text-emerald-700">Successful Sales</div>
            <div className="text-base sm:text-lg font-black text-emerald-800">
              {successfulOrders.length} <span className="text-xs font-semibold">(Green)</span>
            </div>
          </div>

          <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-200 text-center">
            <div className="text-[10px] font-bold uppercase text-rose-700">Unsuccessful</div>
            <div className="text-base sm:text-lg font-black text-rose-800">
              {unsuccessfulOrders.length} <span className="text-xs font-semibold">(Red)</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
            <div className="text-[10px] font-bold uppercase text-slate-500">Fulfilled Total</div>
            <div className="text-base sm:text-lg font-black text-slate-900">
              {formatCurrency(totalSuccessfulRevenue)}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'catalog'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Food Produce Listings ({supplierProducts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Sales History Panel ({supplierOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Delivery Coverage</span>
        </button>
      </div>

      {/* TAB 1: FOOD LISTINGS (PAWPAW, TOMATOES, ONIONS, KALES, BANANAS - NO IMAGES) */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Fresh Produce Listings (No Images • 15 per day)
              </h3>
              <p className="text-xs text-slate-500">
                Categories sold: Pawpaw, Tomatoes, Onions, Kales, and Bananas.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Food Item</span>
            </button>
          </div>

          {/* Simple Clean Listings (No Images) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {supplierProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100 uppercase tracking-wide">
                      {p.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleStock(p.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border cursor-pointer transition-colors ${
                        p.inStock
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {p.inStock ? 'Available Today' : 'Out of Stock'}
                    </button>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-base">{p.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{p.description}</p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Daily Supply Limit:</span>
                    <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                      15 a day
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-black text-slate-900 text-lg">{formatCurrency(p.unitPrice)}</div>
                    <div className="text-[11px] text-slate-400">per {p.unit}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteProduct(p.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: HISTORY PANEL (4 SUCCESSFUL GREEN, 1 UNSUCCESSFUL RED, 15 A DAY) */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {/* Header & Filter Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Sales & Delivery History Panel
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                4 Successful sales highlighted in green, 1 unsuccessful sale highlighted in red (Quantity: 15/day).
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setHistoryFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  historyFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All (5)
              </button>
              <button
                type="button"
                onClick={() => setHistoryFilter('successful')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  historyFilter === 'successful'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Successful (4 Green)
              </button>
              <button
                type="button"
                onClick={() => setHistoryFilter('unsuccessful')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  historyFilter === 'unsuccessful'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Unsuccessful (1 Red)
              </button>
            </div>
          </div>

          {/* History Cards List */}
          <div className="space-y-3">
            {filteredHistoryOrders.map((order) => {
              const isDelivered = order.status === 'delivered';
              const isUnsuccessful = order.status === 'cancelled';
              const isExpanded = expandedOrderId === order.id;

              return (
                <div
                  key={order.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isDelivered
                      ? 'bg-emerald-50/50 border-emerald-300 shadow-xs hover:border-emerald-400'
                      : isUnsuccessful
                      ? 'bg-rose-50/50 border-rose-300 shadow-xs hover:border-rose-400'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold bg-white/90 border border-slate-200 px-2 py-0.5 rounded-md text-slate-800">
                          {order.poNumber}
                        </span>

                        {/* Explicit Green for Successful, Red for Unsuccessful */}
                        {isDelivered && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-600 text-white shadow-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Successful Sale (Fulfilled)
                          </span>
                        )}

                        {isUnsuccessful && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-600 text-white shadow-xs">
                            <XCircle className="w-3.5 h-3.5" />
                            Unsuccessful (Cancelled)
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          {order.buyerName}
                        </span>
                        <span className="text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {order.expectedDeliveryDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                      <div className="text-left sm:text-right">
                        <div
                          className={`text-base font-black ${
                            isDelivered ? 'text-emerald-800' : 'text-rose-700'
                          }`}
                        >
                          {isDelivered ? '+' : ''}{formatCurrency(order.totalAmount)}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-600">
                          {order.items.reduce((acc, i) => acc + i.quantity, 0)} units total (15 a day)
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="p-1.5 rounded-lg bg-white/80 border border-slate-200 hover:bg-white text-slate-600 cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Order Details & Delivery Notes */}
                  {isExpanded && (
                    <div className="p-4 bg-white/80 border-t border-slate-200/80 text-xs space-y-2">
                      <div className="font-bold text-slate-700">Food Items (15 / day):</div>
                      <div className="space-y-1">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-100 last:border-0">
                            <span className="font-medium text-slate-800">
                              {it.quantity}x {it.title} ({it.unit})
                            </span>
                            <span className="font-bold text-slate-900">{formatCurrency(it.lineTotal)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2">
                        <span className="font-bold text-slate-700">Delivery Log:</span>
                        <p className={`mt-0.5 p-2 rounded-xl text-xs ${
                          isDelivered
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                            : 'bg-rose-50 text-rose-900 border border-rose-200'
                        }`}>
                          {order.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DELIVERY SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 max-w-xl space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Delivery Coverage to Schools</h3>
          <p className="text-xs text-slate-500">
            Set your daily dispatch radius from your farm/depot. Nyang'ori Boys High School is located 2.4 km away and is within your active delivery circle.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Maximum Delivery Radius</span>
                <span className="text-sky-600 font-bold">{tempRadius} km</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={tempRadius}
                onChange={(e) => setTempRadius(parseInt(e.target.value, 10))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>5 km (Local)</span>
                <span>25 km (Nyang'ori Zone)</span>
                <span>60 km (Regional)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onUpdateDeliveryRadius(tempRadius)}
                className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold hover:bg-sky-700 transition-all cursor-pointer shadow-xs"
              >
                Save Delivery Radius
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Food Listing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Add Food Produce Listing</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFoodListing} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Food Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pawpaw, Tomatoes, Onions, Kales, Bananas"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-hidden focus:border-sky-500"
                  >
                    <option value="Pawpaw">Pawpaw</option>
                    <option value="Tomatoes">Tomatoes</option>
                    <option value="Onions">Onions</option>
                    <option value="Kales">Kales</option>
                    <option value="Bananas">Bananas</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-hidden focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Daily Quantity Capacity</label>
                <input
                  type="text"
                  readOnly
                  value="15 a day"
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Fresh morning harvest details..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-hidden focus:border-sky-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 cursor-pointer shadow-xs"
                >
                  Save Food Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
