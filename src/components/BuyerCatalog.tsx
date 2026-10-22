import React, { useState, useMemo } from 'react';
import { Product, Supplier, Institution } from '../data/seedData';
import { CartItem, calculateDistanceKm, formatCurrency } from '../utils/procurement';
import { Search, SlidersHorizontal, Plus, Minus, Check, MapPin, Truck, Sparkles, Building2 } from 'lucide-react';

interface BuyerCatalogProps {
  products: Product[];
  suppliers: Supplier[];
  buyerInstitution: Institution;
  selectedSupplierId: string | null;
  onSelectSupplier: (id: string | null) => void;
  cartItems: CartItem[];
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenMap: () => void;
}

const CATEGORIES = [
  'All Items',
  'Stationery & Books',
  'STEM & Lab Equipment',
  'Catering & Cafeteria',
  'Sports & Athletics',
  'Furniture & Facilities',
];

export const BuyerCatalog: React.FC<BuyerCatalogProps> = ({
  products,
  suppliers,
  buyerInstitution,
  selectedSupplierId,
  onSelectSupplier,
  cartItems,
  onAddToCart,
  onOpenMap,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Supplier lookup map
  const supplierMap = useMemo(() => {
    const map = new Map<string, Supplier>();
    suppliers.forEach((s) => map.set(s.id, s));
    return map;
  }, [suppliers]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All Items' && p.category !== selectedCategory) {
        return false;
      }
      // Supplier filter
      if (selectedSupplierId && p.supplierId !== selectedSupplierId) {
        return false;
      }
      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.supplierName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, selectedCategory, selectedSupplierId, searchQuery]);

  const handleQtyChange = (productId: string, val: number, moq = 1) => {
    const nextVal = Math.max(moq, val);
    setQuantities((prev) => ({ ...prev, [productId]: nextVal }));
  };

  const getQty = (product: Product) => {
    return quantities[product.id] || product.moq || 1;
  };

  const getInCartQty = (productId: string) => {
    const item = cartItems.find((i) => i.productId === productId);
    return item ? item.quantity : 0;
  };

  const activeSupplier = selectedSupplierId ? supplierMap.get(selectedSupplierId) : null;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Search & Top Action Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search school supplies, lab gear, furniture..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-sky-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Supplier filter reset button if selected */}
          {activeSupplier && (
            <div className="flex items-center gap-1.5 bg-sky-50 text-sky-800 border border-sky-200 px-3 py-1.5 rounded-xl text-xs font-medium">
              <Building2 className="w-3.5 h-3.5 text-sky-600" />
              <span className="truncate max-w-[140px]">{activeSupplier.name}</span>
              <button
                type="button"
                onClick={() => onSelectSupplier(null)}
                className="ml-1 hover:text-sky-950 font-bold cursor-pointer"
                title="Clear filter"
              >
                ✕
              </button>
            </div>
          )}

          {/* Quick open map button on mobile */}
          <button
            type="button"
            onClick={onOpenMap}
            className="sm:hidden px-3 py-2 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-sky-200 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Map</span>
          </button>

          {/* View mode toggle on tablet/desktop */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Catalog Table
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills (horizontal scroll on mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-sky-600 text-white shadow-xs shadow-sky-500/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Count & active filter hint */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing {filteredProducts.length} procurement items</span>
        {activeSupplier && (
          <span>
            Supplier: <strong className="text-slate-700">{activeSupplier.name}</strong> ({activeSupplier.category})
          </span>
        )}
      </div>

      {/* Product List */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No items match your filter</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or select another category or supplier.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Items');
              onSelectSupplier(null);
            }}
            className="mt-4 px-4 py-2 bg-sky-50 text-sky-700 border border-sky-200 rounded-xl text-xs font-semibold hover:bg-sky-100 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* Tablet & Laptop Procurement Table View */
        <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Item & Specifications</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">Unit Price</th>
                  <th className="py-3 px-4">MOQ & Bulk Savings</th>
                  <th className="py-3 px-4">Lead Time</th>
                  <th className="py-3 px-4 text-right">Order Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredProducts.map((p) => {
                  const sup = supplierMap.get(p.supplierId);
                  const dist = sup
                    ? calculateDistanceKm(buyerInstitution.lat, buyerInstitution.lng, sup.lat, sup.lng)
                    : null;
                  const inCartQty = getInCartQty(p.id);
                  const currentQty = getQty(p);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-4 max-w-xs">
                        <div className="font-semibold text-slate-900">{p.title}</div>
                        <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{p.description}</div>
                        <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-800">{p.supplierName}</div>
                        {dist !== null && (
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-sky-500" />
                            <span>{dist} km away</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 text-base">{formatCurrency(p.unitPrice)}</div>
                        <div className="text-xs text-slate-500">per {p.unit}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-xs font-medium text-slate-700">Min: {p.moq} {p.unit}</div>
                        {p.bulkDiscountPercent > 0 && (
                          <div className="text-xs text-emerald-600 font-semibold mt-0.5">
                            Save {p.bulkDiscountPercent}% at {p.bulkThreshold}+
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-slate-400" />
                          <span>{p.leadTimeDays} days</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="flex items-center border border-slate-200 rounded-xl bg-white p-0.5">
                            <button
                              type="button"
                              onClick={() => handleQtyChange(p.id, currentQty - 1, p.moq)}
                              className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-slate-800">{currentQty}</span>
                            <button
                              type="button"
                              onClick={() => handleQtyChange(p.id, currentQty + 1, p.moq)}
                              className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => onAddToCart(p, currentQty)}
                            className="px-3 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold hover:bg-sky-700 shadow-xs cursor-pointer flex items-center gap-1.5"
                          >
                            {inCartQty > 0 ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            <span>{inCartQty > 0 ? `In PO (${inCartQty})` : 'Add to PO'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Mobile-First Cards View (Responsive 1-col on phone, 2-3 col on tablet/laptop) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredProducts.map((p) => {
            const sup = supplierMap.get(p.supplierId);
            const dist = sup
              ? calculateDistanceKm(buyerInstitution.lat, buyerInstitution.lng, sup.lat, sup.lng)
              : null;
            const inCartQty = getInCartQty(p.id);
            const currentQty = getQty(p);

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-sky-300 transition-all p-4 flex flex-col justify-between relative group"
              >
                <div>
                  {/* Category & distance badges */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-100 uppercase tracking-wide">
                      {p.category}
                    </span>
                    {dist !== null && (
                      <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-sky-500" />
                        {dist} km
                      </span>
                    )}
                  </div>

                  {/* Title & description */}
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2">
                    {p.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  {/* Supplier info */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span className="font-medium truncate max-w-[170px] text-slate-700">{p.supplierName}</span>
                    <span className="text-slate-400">Lead: {p.leadTimeDays}d</span>
                  </div>

                  {/* Bulk discount callout if available */}
                  {p.bulkDiscountPercent > 0 && (
                    <div className="mt-2 text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200/70 rounded-lg px-2 py-1 flex items-center gap-1 font-medium">
                      <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{p.bulkDiscountPercent}% bulk discount on {p.bulkThreshold}+ units</span>
                    </div>
                  )}
                </div>

                {/* Price and Cart controls */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-base sm:text-lg font-extrabold text-slate-900">
                      {formatCurrency(p.unitPrice)}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[100px]">
                      per {p.unit}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50/80 p-0.5">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(p.id, currentQty - 1, p.moq)}
                        className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-all cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-slate-800">{currentQty}</span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(p.id, currentQty + 1, p.moq)}
                        className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Add Button */}
                    <button
                      type="button"
                      onClick={() => onAddToCart(p, currentQty)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer shadow-xs ${
                        inCartQty > 0
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-sky-600 text-white hover:bg-sky-700'
                      }`}
                    >
                      {inCartQty > 0 ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>({inCartQty})</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
