import React, { useState, useEffect } from 'react';
import {
  INITIAL_SUPPLIERS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_INSTITUTIONS,
  Supplier,
  Product,
  ProcurementOrder,
  Institution,
} from './data/seedData';
import { CartItem } from './utils/procurement';
import { testConnection } from './firebase/config';
import { SignInScreen } from './components/SignInScreen';

import { BuyerCatalog } from './components/BuyerCatalog';
import { CartModal } from './components/CartModal';
import { OrdersView } from './components/OrdersView';
import { SellerDashboard } from './components/SellerDashboard';
import {
  School,
  Building2,
  ShoppingCart,
  MapPin,
  Package,
  FileText,
  LogOut,
  RefreshCw,
  Sparkles,
  Layers,
  Bot,
} from 'lucide-react';

export default function App() {
  // Check for ?autostart=1 in URL
  const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const autostart = queryParams?.get('autostart') === '1';

  // Current session user
  const [currentUser, setCurrentUser] = useState<{
    uid: string;
    email: string;
    displayName: string;
    role: 'buyer' | 'seller';
    entityId: string;
  } | null>(
    autostart
      ? {
          uid: 'user_oakridge',
          uid: 'user_elizabeth',
          email: 'elizasaloon6@gmail.com',
          displayName: 'Elizabeth',
          role: 'seller',
          entityId: 'sup_elizabeth',
        }
      : null
  );

  // Core application collections
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<ProcurementOrder[]>(INITIAL_ORDERS);
  const [institutions, setInstitutions] = useState<Institution[]>(INITIAL_INSTITUTIONS);

  // Active buyer institution & seller supplier
  const [currentInstitutionId, setCurrentInstitutionId] = useState<string>('inst_nyangori');
  const [currentSupplierId, setCurrentSupplierId] = useState<string>('sup_elizabeth');

  // UI Navigation states
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders'>('catalog');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [firebaseReady, setFirebaseReady] = useState(false);

  // Test Firebase connection on mount
  useEffect(() => {
    testConnection().then((connected) => {
      setFirebaseReady(connected);
    });
  }, []);

  const currentInstitution =
    institutions.find((i) => i.id === currentInstitutionId) || institutions[0];
  const currentSupplier =
    suppliers.find((s) => s.id === currentSupplierId) || suppliers[0];

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          title: product.title,
          unitPrice: product.unitPrice,
          unit: product.unit,
          quantity,
          bulkThreshold: product.bulkThreshold,
          bulkDiscountPercent: product.bulkDiscountPercent,
        },
      ];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCreateOrder = (newOrder: ProcurementOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  // Seller operations
  const handleAddProduct = (newProd: Omit<Product, 'id'>) => {
    const created: Product = {
      ...newProd,
      id: `prod_${Date.now()}`,
    };
    setProducts((prev) => [created, ...prev]);
  };

  const handleToggleStock = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleAdvanceOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        if (o.status === 'submitted') return { ...o, status: 'confirmed' };
        if (o.status === 'confirmed') return { ...o, status: 'in_transit' };
        if (o.status === 'in_transit') return { ...o, status: 'delivered' };
        return o;
      })
    );
  };

  const handleUpdateDeliveryRadius = (radiusKm: number) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === currentSupplier.id ? { ...s, deliveryRadiusKm: radiusKm } : s))
    );
  };

  // Switch between buyer and seller roles seamlessly
  const toggleRole = () => {
    if (!currentUser) return;
    const nextRole = currentUser.role === 'buyer' ? 'seller' : 'buyer';
    if (nextRole === 'seller' && (currentUser.email === 'elizasaloon6@gmail.com' || currentUser.displayName.includes('Elizabeth'))) {
      setCurrentSupplierId('sup_elizabeth');
    }
    if (nextRole === 'buyer' && (currentUser.email === 'procurement@nyangoriboys.ac.ke' || currentUser.email === 'elizasaloon6@gmail.com' || currentUser.displayName.includes('Nyang'))) {
      setCurrentInstitutionId('inst_nyangori');
    }
    setCurrentUser({
      ...currentUser,
      role: nextRole,
      entityId: nextRole === 'buyer' ? 'inst_nyangori' : 'sup_elizabeth',
    });
  };

  // If user is not logged in, show shiny fresh sign in screen
  if (!currentUser) {
    return (
      <SignInScreen
        onSignInSuccess={(usr) => {
          setCurrentUser({
            uid: usr.uid,
            email: usr.email,
            displayName: usr.displayName,
            role: usr.role,
            entityId: usr.entityId,
          });

          if (usr.role === 'buyer') {
            const existingInst = institutions.find((i) => i.id === usr.entityId || i.email === usr.email);
            if (existingInst) {
              setCurrentInstitutionId(existingInst.id);
            } else if (usr.customEntityName) {
              const newInst: Institution = {
                id: `inst_${usr.uid}`,
                ownerId: usr.uid,
                name: usr.customEntityName,
                type: 'Public School',
                address: usr.customAddress || 'Kisumu - Kakamega Highway, Kisumu, Kenya',
                lat: -0.0917,
                lng: 34.7680,
                contactPerson: usr.displayName,
                email: usr.email,
                phone: '+254 722 890 120',
                studentCount: 1450,
              };
              setInstitutions((prev) => [newInst, ...prev]);
              setCurrentInstitutionId(newInst.id);
            } else {
              setCurrentInstitutionId('inst_nyangori');
            }
          } else {
            const existingSup = suppliers.find((s) => s.id === usr.entityId || s.contactEmail === usr.email);
            if (existingSup) {
              setCurrentSupplierId(existingSup.id);
            } else if (usr.customEntityName) {
              const newSup: Supplier = {
                id: `sup_${usr.uid}`,
                ownerId: usr.uid,
                name: usr.customEntityName,
                category: usr.customCategory || 'Fresh Garden Food',
                description: 'Educational procurement supplies distributor.',
                address: usr.customAddress || 'Kisumu Central Market - Farm Depot, Kisumu, Kenya',
                lat: -0.1022,
                lng: 34.7617,
                deliveryRadiusKm: 35,
                contactEmail: usr.email,
                contactPhone: '+254 712 345 678',
                minOrderValue: 20,
                rating: 5.0,
                leadTimeDays: 1,
              };
              setSuppliers((prev) => [newSup, ...prev]);
              setCurrentSupplierId(newSup.id);
            } else {
              setCurrentSupplierId('sup_elizabeth');
            }
          }
        }}
      />
    );
  }

  const cartTotalCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-sky-50/20 to-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Logo & School/Supplier indicator */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex items-center py-0.5">
              <img
                src="/assets/aistudio/file_0000000040a4824395e1b68c717e7a9a_78bdb3ec.png"
                alt="Nerevana"
                className="h-12 sm:h-13 w-auto object-contain drop-shadow-2xs"
              />
            </div>

            <div className="border-l border-slate-200 pl-2.5 sm:pl-3">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                  currentUser.role === 'buyer'
                    ? 'bg-sky-50 text-sky-700 border-sky-100'
                    : 'bg-orange-50 text-orange-700 border-orange-200'
                }`}>
                  {currentUser.role === 'buyer' ? 'Institution Buyer' : 'Supplier'}
                </span>
              </div>
              <div className="text-xs text-slate-500 truncate max-w-[140px] sm:max-w-xs">
                {currentUser.role === 'buyer' ? currentInstitution.name : currentSupplier.name}
              </div>
            </div>
          </div>

          {/* Desktop Nav for Buyer */}
          {currentUser.role === 'buyer' && (
            <div className="hidden sm:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/70">
              <button
                type="button"
                onClick={() => setActiveTab('catalog')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'catalog'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Catalog
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'orders'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Orders</span>
                {orders.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-sky-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {orders.length}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Actions & Role Switcher */}
          <div className="flex items-center gap-2">
            {currentUser.role === 'buyer' && (
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl border border-sky-200/90 transition-all cursor-pointer flex items-center gap-1.5"
                title="View Purchase Order"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="text-xs font-bold hidden md:inline">PO Cart</span>
                {cartTotalCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-sky-600 text-white rounded-full text-[11px] font-black flex items-center justify-center shadow-xs">
                    {cartTotalCount}
                  </span>
                )}
              </button>
            )}

            {/* Quick Switch Role button */}
            <button
              type="button"
              onClick={toggleRole}
              className="px-2.5 sm:px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              title="Toggle between Buyer and Seller"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden sm:inline">Switch to {currentUser.role === 'buyer' ? 'Seller' : 'Buyer'}</span>
            </button>

            {/* Sign Out */}
            <button
              type="button"
              onClick={() => setCurrentUser(null)}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-6 flex-1 pb-24 sm:pb-8">
        {currentUser.role === 'buyer' ? (
          <div>
            {/* Tab: Catalog */}
            {activeTab === 'catalog' && (
              <div className="space-y-4">
                {/* School Profile Bar on Buyer side */}
                <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-slate-800">Campus Location:</span>
                    <span className="text-slate-600">{currentInstitution.address}</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-500">
                    <span>{currentInstitution.type}</span>
                    <span>•</span>
                    <span>{currentInstitution.studentCount} Students</span>
                  </div>
                </div>

                <BuyerCatalog
                  products={products}
                  suppliers={suppliers}
                  buyerInstitution={currentInstitution}
                  selectedSupplierId={selectedSupplierId}
                  onSelectSupplier={setSelectedSupplierId}
                  cartItems={cartItems}
                  onAddToCart={handleAddToCart}
                />
              </div>
            )}



            {/* Tab: Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Institutional Purchase Orders</h3>
                  <p className="text-xs text-slate-500">
                    Track active and fulfilled orders placed by {currentInstitution.name}
                  </p>
                </div>

                <OrdersView orders={orders} />
              </div>
            )}
          </div>
        ) : (
          /* Seller Dashboard View */
          <SellerDashboard
            supplier={currentSupplier}
            products={products}
            orders={orders}
            onAddProduct={handleAddProduct}
            onToggleStock={handleToggleStock}
            onDeleteProduct={handleDeleteProduct}
            onAdvanceOrderStatus={handleAdvanceOrderStatus}
            onUpdateDeliveryRadius={handleUpdateDeliveryRadius}
          />
        )}
      </main>

      {/* Cart Modal / PO Transmittal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        buyerInstitution={currentInstitution}
        suppliers={suppliers}
        onSubmitOrder={handleCreateOrder}
      />

      {/* Mobile Floating Bottom Bar for Buyer */}
      {currentUser.role === 'buyer' && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 py-2 px-6 flex items-center justify-around shadow-lg">
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`flex flex-col items-center gap-1 text-[11px] font-semibold cursor-pointer ${
              activeTab === 'catalog' ? 'text-sky-600' : 'text-slate-400'
            }`}
          >
            <Package className="w-5 h-5" />
            <span>Catalog</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`relative flex flex-col items-center gap-1 text-[11px] font-semibold cursor-pointer ${
              activeTab === 'orders' ? 'text-sky-600' : 'text-slate-400'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Orders</span>
            {orders.length > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-sky-600 text-white text-[9px] flex items-center justify-center font-bold">
                {orders.length}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
