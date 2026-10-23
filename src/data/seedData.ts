export interface Supplier {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  deliveryRadiusKm: number;
  contactEmail: string;
  contactPhone: string;
  minOrderValue: number;
  rating: number;
  leadTimeDays: number;
}

export interface Product {
  id: string;
  supplierId: string;
  supplierName: string;
  title: string;
  category: string;
  description: string;
  unitPrice: number;
  unit: string;
  stock: number;
  dailySupplyLimit?: number;
  moq: number;
  leadTimeDays: number;
  bulkDiscountPercent: number;
  bulkThreshold: number;
  inStock: boolean;
}

export interface OrderItem {
  productId: string;
  title: string;
  unitPrice: number;
  unit: string;
  quantity: number;
  lineTotal: number;
}

export interface ProcurementOrder {
  id: string;
  poNumber: string;
  buyerId: string;
  buyerName: string;
  institutionType: string;
  supplierId: string;
  supplierName: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  status: 'submitted' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  deliveryLat: number;
  deliveryLng: number;
  notes: string;
  expectedDeliveryDate: string;
  createdAt: string;
}

export interface Institution {
  id: string;
  ownerId: string;
  name: string;
  type: string;
  address: string;
  lat: number;
  lng: number;
  contactPerson: string;
  email: string;
  phone: string;
  studentCount: number;
}

export const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: 'inst_nyangori',
    ownerId: 'user_nyangori',
    name: "Nyang'ori Boys High School",
    type: 'National Boys High School',
    address: 'Kisumu - Kakamega Highway, Kisumu, Kenya',
    lat: -0.0917,
    lng: 34.7680,
    contactPerson: 'Procurement Board & Senior Bursar',
    email: 'procurement@nyangoriboys.ac.ke',
    phone: '+254 722 890 120',
    studentCount: 1450,
  },
  {
    id: 'inst_maseno',
    ownerId: 'user_maseno',
    name: 'Maseno School',
    type: 'National High School',
    address: 'Maseno - Kisumu Busia Highway, Maseno, Kenya',
    lat: -0.0033,
    lng: 34.6044,
    contactPerson: 'Bursar & Stores Officer',
    email: 'procurement@masenoschool.ac.ke',
    phone: '+254 711 234 567',
    studentCount: 1600,
  },
  {
    id: 'inst_kisumugirls',
    ownerId: 'user_kisumugirls',
    name: 'Kisumu Girls High School',
    type: 'National Girls High School',
    address: 'Kenyatta Highway, Kisumu, Kenya',
    lat: -0.0982,
    lng: 34.7556,
    contactPerson: 'Catering & Supplies Head',
    email: 'procurement@kisumugirls.ac.ke',
    phone: '+254 722 345 678',
    studentCount: 1350,
  },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup_elizabeth',
    ownerId: 'user_elizabeth',
    name: 'Elizabeth',
    category: 'Fresh Garden Food',
    description: 'Supplier of fresh garden food: pawpaw, tomatoes, onions, kales, and bananas directly supplied to institutions.',
    address: 'Kisumu Central Market - Farm Depot, Kisumu, Kenya',
    lat: -0.1022,
    lng: 34.7617,
    deliveryRadiusKm: 25,
    contactEmail: 'elizasaloon6@gmail.com',
    contactPhone: '+254 712 345 678',
    minOrderValue: 50,
    rating: 4.9,
    leadTimeDays: 1,
  },
  {
    id: 'sup_apex',
    ownerId: 'user_apex',
    name: 'Apex Academic Supplies Kenya',
    category: 'Stationery & Books',
    description: 'Direct manufacturer distributor of exercise books, copy paper, pens, and curriculum workbooks.',
    address: 'Oginga Odinga Street, Kisumu Central, Kenya',
    lat: -0.0910,
    lng: 34.7600,
    deliveryRadiusKm: 30,
    contactEmail: 'orders@apexsupplies.co.ke',
    contactPhone: '+254 720 123 456',
    minOrderValue: 1000,
    rating: 4.9,
    leadTimeDays: 2,
  },
  {
    id: 'sup_quantum',
    ownerId: 'user_quantum',
    name: 'Quantum STEM & Lab Systems East Africa',
    category: 'STEM & Lab Equipment',
    description: 'Laboratory glassware, chemical safety gear, biology specimens, and physics kits for schools.',
    address: 'Mega City Complex, Nairobi Road, Kisumu, Kenya',
    lat: -0.1050,
    lng: 34.7700,
    deliveryRadiusKm: 45,
    contactEmail: 'procure@quantumstem.co.ke',
    contactPhone: '+254 733 987 654',
    minOrderValue: 2500,
    rating: 4.8,
    leadTimeDays: 3,
  },
  {
    id: 'sup_evergreen',
    ownerId: 'user_evergreen',
    name: 'Evergreen Cafeteria & Dining Solutions',
    category: 'Catering & Cafeteria',
    description: 'Food grade dining utensils, bulk food storage containers, and kitchen sanitization supplies.',
    address: 'Obote Road Industrial Area, Kisumu, Kenya',
    lat: -0.0890,
    lng: 34.7500,
    deliveryRadiusKm: 25,
    contactEmail: 'sales@evergreenkenya.co.ke',
    contactPhone: '+254 710 456 789',
    minOrderValue: 1500,
    rating: 4.7,
    leadTimeDays: 1,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  // Elizabeth's Food Listings (Accurate KES pricing requested by user)
  {
    id: 'prod_elizabeth_tomatoes',
    supplierId: 'sup_elizabeth',
    supplierName: 'Elizabeth',
    title: 'Tomatoes',
    category: 'Tomatoes',
    description: 'Fresh ripe cooking tomatoes harvested for school dining hall meals and kitchen stews.',
    unitPrice: 10.0, // 10 KES per fruit
    unit: 'tomato (per fruit)',
    stock: 500,
    dailySupplyLimit: 500,
    moq: 20,
    leadTimeDays: 1,
    bulkDiscountPercent: 8,
    bulkThreshold: 100,
    inStock: true,
  },
  {
    id: 'prod_elizabeth_pawpaw',
    supplierId: 'sup_elizabeth',
    supplierName: 'Elizabeth',
    title: 'Pawpaw (Papaya)',
    category: 'Pawpaw',
    description: 'Large naturally ripened sweet pawpaws for school dining hall breakfast and fruit rations.',
    unitPrice: 800.0, // 800 KES per fruit
    unit: 'pawpaw (per fruit)',
    stock: 15,
    dailySupplyLimit: 15,
    moq: 1,
    leadTimeDays: 1,
    bulkDiscountPercent: 5,
    bulkThreshold: 5,
    inStock: true,
  },
  {
    id: 'prod_elizabeth_onions',
    supplierId: 'sup_elizabeth',
    supplierName: 'Elizabeth',
    title: 'Onions',
    category: 'Onions',
    description: 'Dry cured red onions packed for institutional food preparation (Ksh 10 for 2 onions).',
    unitPrice: 5.0, // Ksh 10 for 2 = Ksh 5 each
    unit: 'onion (Ksh 10 for 2)',
    stock: 500,
    dailySupplyLimit: 500,
    moq: 20,
    leadTimeDays: 1,
    bulkDiscountPercent: 6,
    bulkThreshold: 100,
    inStock: true,
  },
  {
    id: 'prod_elizabeth_kales',
    supplierId: 'sup_elizabeth',
    supplierName: 'Elizabeth',
    title: 'Kales (Sukuma Wiki)',
    category: 'Kales',
    description: 'Fresh crisp green sukuma wiki harvested daily (up to 20 bunches per school order).',
    unitPrice: 50.0, // 50 KES per bunch
    unit: 'bunch (up to 20 bunches)',
    stock: 20,
    dailySupplyLimit: 20,
    moq: 1,
    leadTimeDays: 1,
    bulkDiscountPercent: 10,
    bulkThreshold: 10,
    inStock: true,
  },
  {
    id: 'prod_elizabeth_bananas',
    supplierId: 'sup_elizabeth',
    supplierName: 'Elizabeth',
    title: 'Bananas',
    category: 'Bananas',
    description: 'Freshly ripened sweet bananas. Available one-time order up to 200 bananas due to strict harvest supply.',
    unitPrice: 25.0, // 25 KES per banana
    unit: 'banana (one-time supply up to 200)',
    stock: 200,
    dailySupplyLimit: 200,
    moq: 10,
    leadTimeDays: 1,
    bulkDiscountPercent: 5,
    bulkThreshold: 50,
    inStock: true,
  },

  // Other standard school supplies (All in KES)
  {
    id: 'prod_1',
    supplierId: 'sup_apex',
    supplierName: 'Apex Academic Supplies Kenya',
    title: 'A4 Photocopy Paper 80gsm (Box of 5 Reams / 2,500 Sheets)',
    category: 'Stationery & Books',
    description: 'High speed institutional printing and examination copy paper with moisture proof packaging.',
    unitPrice: 3200.0,
    unit: 'box (5 reams)',
    stock: 350,
    moq: 2,
    leadTimeDays: 2,
    bulkDiscountPercent: 10,
    bulkThreshold: 10,
    inStock: true,
  },
  {
    id: 'prod_2',
    supplierId: 'sup_apex',
    supplierName: 'Apex Academic Supplies Kenya',
    title: 'Ruled A4 Exercise Books 200 Pages (Pack of 50)',
    category: 'Stationery & Books',
    description: 'Heavy duty cover exercise books with margin lines approved for secondary and primary schools.',
    unitPrice: 3500.0,
    unit: 'pack of 50',
    stock: 220,
    moq: 2,
    leadTimeDays: 2,
    bulkDiscountPercent: 8,
    bulkThreshold: 10,
    inStock: true,
  },
  {
    id: 'prod_4',
    supplierId: 'sup_quantum',
    supplierName: 'Quantum STEM & Lab Systems East Africa',
    title: 'Monocular Student Compound Microscope 1000x',
    category: 'STEM & Lab Equipment',
    description: 'All-metal optical body, LED battery-backed illumination, approved for high school biology labs.',
    unitPrice: 18500.0,
    unit: 'unit',
    stock: 45,
    moq: 1,
    leadTimeDays: 3,
    bulkDiscountPercent: 5,
    bulkThreshold: 5,
    inStock: true,
  },
];

export const INITIAL_ORDERS: ProcurementOrder[] = [
  // 4 SUCCESSFUL SALES FOR ELIZABETH TO NYANG'ORI BOYS HIGH SCHOOL IN REALISTIC KES
  // Delivered Order 1: 20 bunches Kales @ 50 = 1,000 KES (10% bulk discount = 100 KES off, Net = 900 KES)
  {
    id: 'po_elizabeth_001',
    poNumber: 'PO-2026-0941',
    buyerId: 'inst_nyangori',
    buyerName: "Nyang'ori Boys High School",
    institutionType: 'National Boys High School',
    supplierId: 'sup_elizabeth',
    supplierName: 'Elizabeth',
    items: [
      {
        productId: 'prod_elizabeth_kales',
        title: 'Kales (Sukuma Wiki)',
        unitPrice: 50.0,
        unit: 'bunch (up to 20 bunches)',
        quantity: 20,
        lineTotal: 1000.0,
      },
    ],
    subtotal: 1000.0,
    discount: 100.0,
    deliveryFee: 0,
    totalAmount: 900.0,
    status: 'delivered',
    deliveryAddress: 'Kisumu - Kakamega Highway, Kisumu, Kenya',
    deliveryLat: -0.0917,
    deliveryLng: 34.7680,
    notes: 'Kitchen receiving dock: 20 bunches of fresh Sukuma wiki inspected and accepted in good order. Payment cleared.',
    expectedDeliveryDate: 'Yesterday 8:00 AM',
    createdAt: '2026-10-21T07:30:00Z',
  },

  // Delivered Order 2: 200 Tomatoes @ 10 = 2,000 KES (8% bulk discount = 160 KES off, Net = 1,840 KES)
  {
    id: 'po_elizabeth_002',
    poNumber: 'PO-2026-0938',
    buyerId: 'inst_nyangori',
    buyerName: "Nyang'ori Boys High School",
    institutionType: 'National Boys High School',
    supplierId: 'sup_elizabeth',
    supplierName: 'Elizabeth',
    items: [
      {
        productId: 'prod_elizabeth_tomatoes',
        title: 'Tomatoes',
        unitPrice: 10.0,
        unit: 'tomato (per fruit)',
        quantity: 200,
        lineTotal: 2000.0,
      },
    ],
    subtotal: 2000.0,
    discount: 160.0,
    deliveryFee: 0,
    totalAmount: 1840.0,
    status: 'delivered',
    deliveryAddress: 'Kisumu - Kakamega Highway, Kisumu, Kenya',
    deliveryLat: -0.0917,
    deliveryLng: 34.7680,
    notes: 'Dining hall lunch supply: 200 cooking tomatoes delivered on time and verified by kitchen staff.',
    expectedDeliveryDate: 'Tuesday 7:30 AM',
    createdAt: '2026-10-20T08:00:00Z',
  },

  // Delivered Order 3: 120 Bananas @ 25 = 3,000 KES (5% bulk discount = 150 KES off, Net = 2,850 KES)
  {
    id: 'po_elizabeth_003',
    poNumber: 'PO-2026-0925',
    buyerId: 'inst_nyangori',
    buyerName: "Nyang'ori Boys High School",
    institutionType: 'National Boys High School',
    supplierId: 'sup_elizabeth',
    supplierName: 'Elizabeth',
    items: [
      {
        productId: 'prod_elizabeth_bananas',
        title: 'Bananas',
        unitPrice: 25.0,
        unit: 'banana (one-time supply up to 200)',
        quantity: 120,
        lineTotal: 3000.0,
      },
    ],
    subtotal: 3000.0,
    discount: 150.0,
    deliveryFee: 0,
    totalAmount: 2850.0,
    status: 'delivered',
    deliveryAddress: 'Kisumu - Kakamega Highway, Kisumu, Kenya',
    deliveryLat: -0.0917,
    deliveryLng: 34.7680,
    notes: 'Student breakfast fruit batch: 120 sweet bananas received and distributed.',
    expectedDeliveryDate: 'Monday 7:00 AM',
    createdAt: '2026-10-19T07:15:00Z',
  },

  // Delivered Order 4: 4 Pawpaws @ 800 = 3,200 KES + 100 Onions @ 5 = 500 KES -> Subtotal 3,700 KES (5% discount = 185 KES off, Net = 3,515 KES)
  // Sells Totals = 900 + 1,840 + 2,850 + 3,515 = 9,105 KES
  {
    id: 'po_elizabeth_004',
    poNumber: 'PO-2026-0912',
    buyerId: 'inst_nyangori',
    buyerName: "Nyang'ori Boys High School",
    institutionType: 'National Boys High School',
    supplierId: 'sup_elizabeth',
    supplierName: 'Elizabeth',
    items: [
      {
        productId: 'prod_elizabeth_pawpaw',
        title: 'Pawpaw (Papaya)',
        unitPrice: 800.0,
        unit: 'pawpaw (per fruit)',
        quantity: 4,
        lineTotal: 3200.0,
      },
      {
        productId: 'prod_elizabeth_onions',
        title: 'Onions',
        unitPrice: 5.0,
        unit: 'onion (Ksh 10 for 2)',
        quantity: 100,
        lineTotal: 500.0,
      },
    ],
    subtotal: 3700.0,
    discount: 185.0,
    deliveryFee: 0,
    totalAmount: 3515.0,
    status: 'delivered',
    deliveryAddress: 'Kisumu - Kakamega Highway, Kisumu, Kenya',
    deliveryLat: -0.0917,
    deliveryLng: 34.7680,
    notes: 'Kitchen storeroom intake: 4 large pawpaws and 100 red onions received in fresh condition. Bursar confirmed payment voucher.',
    expectedDeliveryDate: 'Sunday 9:00 AM',
    createdAt: '2026-10-18T09:00:00Z',
  },

  // 1 UNSUCCESSFUL SALE FOR ELIZABETH
  {
    id: 'po_elizabeth_005',
    poNumber: 'PO-2026-0899',
    buyerId: 'inst_nyangori',
    buyerName: "Nyang'ori Boys High School",
    institutionType: 'National Boys High School',
    supplierId: 'sup_elizabeth',
    supplierName: 'Elizabeth',
    items: [
      {
        productId: 'prod_elizabeth_pawpaw',
        title: 'Pawpaw (Papaya)',
        unitPrice: 800.0,
        unit: 'pawpaw (per fruit)',
        quantity: 5,
        lineTotal: 4000.0,
      },
    ],
    subtotal: 4000.0,
    discount: 0,
    deliveryFee: 0,
    totalAmount: 4000.0,
    status: 'cancelled',
    deliveryAddress: 'Kisumu - Kakamega Highway, Kisumu, Kenya',
    deliveryLat: -0.0917,
    deliveryLng: 34.7680,
    notes: 'Unsuccessful delivery: Road was blocked due to fallen tree during heavy storm along Kakamega Road. Delivery cancelled by mutual agreement.',
    expectedDeliveryDate: 'Saturday 8:00 AM',
    createdAt: '2026-10-17T06:45:00Z',
  },
];
