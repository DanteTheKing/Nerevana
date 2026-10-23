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
    id: 'inst_oakridge',
    ownerId: 'user_oakridge',
    name: 'Oakridge Preparatory High School',
    type: 'Public High School (9-12)',
    address: '2150 Hayes St, San Francisco, CA',
    lat: 37.7734,
    lng: -122.4475,
    contactPerson: 'Sarah Chen (Procurement)',
    email: 'schen@oakridgeschools.org',
    phone: '+1 (415) 322-9011',
    studentCount: 1250,
  },
  {
    id: 'inst_lincoln',
    ownerId: 'user_lincoln',
    name: 'Lincoln Unified District Elementary',
    type: 'Public Elementary (K-5)',
    address: '750 14th St, San Francisco, CA',
    lat: 37.7679,
    lng: -122.4312,
    contactPerson: 'Marcus Vance (Facilities & Supply)',
    email: 'm.vance@lincolnk5.edu',
    phone: '+1 (415) 441-7890',
    studentCount: 780,
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
    minOrderValue: 20,
    rating: 4.9,
    leadTimeDays: 1,
  },
  {
    id: 'sup_apex',
    ownerId: 'user_apex',
    name: 'Apex Academic Supplies',
    category: 'Stationery & Books',
    description: 'Direct manufacturer distributor of recycled paper, notebooks, pens, and curriculum workbooks.',
    address: '450 Mission St, San Francisco, CA',
    lat: 37.7901,
    lng: -122.3995,
    deliveryRadiusKm: 30,
    contactEmail: 'orders@apexacademic.com',
    contactPhone: '+1 (415) 890-2100',
    minOrderValue: 150,
    rating: 4.9,
    leadTimeDays: 2,
  },
  {
    id: 'sup_quantum',
    ownerId: 'user_quantum',
    name: 'Quantum STEM & Lab Systems',
    category: 'STEM & Lab Equipment',
    description: 'Laboratory microscopes, glassware, chemical safety gear, and programmable robotics kits for secondary schools.',
    address: '100 Hooper St, San Francisco, CA',
    lat: 37.7685,
    lng: -122.3989,
    deliveryRadiusKm: 45,
    contactEmail: 'procure@quantumstem.edu',
    contactPhone: '+1 (415) 772-9110',
    minOrderValue: 250,
    rating: 4.8,
    leadTimeDays: 3,
  },
  {
    id: 'sup_evergreen',
    ownerId: 'user_evergreen',
    name: 'Evergreen Cafeteria Solutions',
    category: 'Catering & Cafeteria',
    description: 'Food service items, compostable meal trays, milk crates, and school dining supplies.',
    address: '1600 Folsom St, San Francisco, CA',
    lat: 37.7699,
    lng: -122.4158,
    deliveryRadiusKm: 25,
    contactEmail: 'sales@evergreennutrition.com',
    contactPhone: '+1 (415) 641-3320',
    minOrderValue: 300,
    rating: 4.7,
    leadTimeDays: 1,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  // Elizabeth's Food Listings (No images, clean listings, 15 daily quantity)
  {
    id: 'prod_elizabeth_pawpaw',
    supplierId: 'sup_elizabeth',
    supplierName: 'Elizabeth',
    title: 'Pawpaw (Papaya)',
    category: 'Pawpaw',
    description: 'Fresh naturally ripened pawpaw harvested daily for school dining hall breakfast and fruit rations.',
    unitPrice: 800.0,
    unit: 'pawpaw',
    stock: 15,
    dailySupplyLimit: 15,
    moq: 1,
    leadTimeDays: 1,
    bulkDiscountPercent: 5,
    bulkThreshold: 10,
    inStock: true,
  },
  {
    id: 'prod_elizabeth_tomatoes',
    supplierId: 'sup_elizabeth',
    supplierName: 'Elizabeth',
    title: 'Tomatoes',
    category: 'Tomatoes',
    description: 'Farm-fresh ripe cooking tomatoes for institutional kitchen stews and dining hall meals.',
    unitPrice: 10.0,
    unit: 'tomato (per fruit)',
    stock: 500,
    dailySupplyLimit: 500,
    moq: 50,
    leadTimeDays: 1,
    bulkDiscountPercent: 8,
    bulkThreshold: 100,
    inStock: true,
  },
  {
    id: 'prod_elizabeth_onions',
    supplierId: 'sup_elizabeth',
    supplierName: 'Elizabeth',
    title: 'Onions',
    category: 'Onions',
    description: 'Dry cured red onions packed for institutional food preparation and long shelf life.',
    unitPrice: 5.0,
    unit: 'onion (per piece)',
    stock: 500,
    dailySupplyLimit: 500,
    moq: 50,
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
    description: 'Fresh crisp green sukuma wiki harvested every morning for school lunch meals.',
    unitPrice: 50.0,
    unit: 'bundle (20/day)',
    stock: 20,
    dailySupplyLimit: 20,
    moq: 1,
    leadTimeDays: 1,
    bulkDiscountPercent: 10,
    bulkThreshold: 5,
    inStock: true,
  },
  {
    id: 'prod_elizabeth_bananas',
    supplierId: 'sup_elizabeth',
    supplierName: 'Elizabeth',
    title: 'Bananas',
    category: 'Bananas',
    description: 'Freshly ripened sweet bananas packed in bulk bunches for student cafeteria dining.',
    unitPrice: 25.0,
    unit: 'banana (one-time)',
    stock: 200,
    dailySupplyLimit: 200,
    moq: 1,
    leadTimeDays: 1,
    bulkDiscountPercent: 5,
    bulkThreshold: 50,
    inStock: true,
  },

  // Other standard school supplies
  {
    id: 'prod_1',
    supplierId: 'sup_apex',
    supplierName: 'Apex Academic Supplies',
    title: 'Recycled Copy Paper 20lb (Carton of 5,000 Sheets)',
    category: 'Stationery & Books',
    description: 'Acid-free bright white 92 GE multipurpose copy paper designed for jam-free high-speed institutional printing.',
    unitPrice: 44.5,
    unit: 'carton (10 reams)',
    stock: 480,
    moq: 5,
    leadTimeDays: 2,
    bulkDiscountPercent: 12,
    bulkThreshold: 20,
    inStock: true,
  },
  {
    id: 'prod_2',
    supplierId: 'sup_apex',
    supplierName: 'Apex Academic Supplies',
    title: 'College Ruled Spiral Notebooks (Pack of 48)',
    category: 'Stationery & Books',
    description: 'Heavy duty poly front covers with three-hole punch and micro-perforated sheets. Color assorted.',
    unitPrice: 58.0,
    unit: 'pack of 48',
    stock: 220,
    moq: 2,
    leadTimeDays: 2,
    bulkDiscountPercent: 10,
    bulkThreshold: 10,
    inStock: true,
  },
  {
    id: 'prod_4',
    supplierId: 'sup_quantum',
    supplierName: 'Quantum STEM & Lab Systems',
    title: 'Dual-Light Monocular Student Microscope 1000x',
    category: 'STEM & Lab Equipment',
    description: 'All-metal optical glass body, coaxial coarse/fine focus, LED incident and transmitted illumination with rechargeable base.',
    unitPrice: 165.0,
    unit: 'unit',
    stock: 85,
    moq: 2,
    leadTimeDays: 3,
    bulkDiscountPercent: 10,
    bulkThreshold: 10,
    inStock: true,
  },
];

export const INITIAL_ORDERS: ProcurementOrder[] = [
  // 4 SUCCESSFUL SALES (GREEN) FOR ELIZABETH TO NYANG'ORI BOYS HIGH SCHOOL
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
        unitPrice: 15.0,
        unit: 'bundle (15/day)',
        quantity: 15,
        lineTotal: 225.0,
      },
    ],
    subtotal: 225.0,
    discount: 22.5,
    deliveryFee: 0,
    totalAmount: 202.5,
    status: 'delivered',
    deliveryAddress: 'Kisumu - Kakamega Highway, Kisumu, Kenya',
    deliveryLat: 0.0572,
    deliveryLng: 34.7291,
    notes: 'Kitchen receiving dock: 15 bundles of Sukuma wiki inspected and accepted in good order. Payment cleared.',
    expectedDeliveryDate: 'Yesterday 8:00 AM',
    createdAt: '2026-10-21T07:30:00Z',
  },
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
        unitPrice: 30.0,
        unit: 'crate (15/day)',
        quantity: 15,
        lineTotal: 450.0,
      },
    ],
    subtotal: 450.0,
    discount: 36.0,
    deliveryFee: 0,
    totalAmount: 414.0,
    status: 'delivered',
    deliveryAddress: 'Kisumu - Kakamega Highway, Kisumu, Kenya',
    deliveryLat: 0.0572,
    deliveryLng: 34.7291,
    notes: 'Dining hall lunch supply: 15 crates of cooking tomatoes delivered on time and verified by kitchen staff.',
    expectedDeliveryDate: 'Tuesday 7:30 AM',
    createdAt: '2026-10-20T08:00:00Z',
  },
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
        unitPrice: 18.0,
        unit: 'bunch (15/day)',
        quantity: 15,
        lineTotal: 270.0,
      },
    ],
    subtotal: 270.0,
    discount: 13.5,
    deliveryFee: 0,
    totalAmount: 256.5,
    status: 'delivered',
    deliveryAddress: 'Kisumu - Kakamega Highway, Kisumu, Kenya',
    deliveryLat: 0.0572,
    deliveryLng: 34.7291,
    notes: 'Student breakfast fruit batch: 15 bunches of sweet bananas received and distributed.',
    expectedDeliveryDate: 'Monday 7:00 AM',
    createdAt: '2026-10-19T07:15:00Z',
  },
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
        productId: 'prod_elizabeth_onions',
        title: 'Onions',
        unitPrice: 25.0,
        unit: 'net bag (15/day)',
        quantity: 15,
        lineTotal: 375.0,
      },
    ],
    subtotal: 375.0,
    discount: 22.5,
    deliveryFee: 0,
    totalAmount: 352.5,
    status: 'delivered',
    deliveryAddress: 'Kisumu - Kakamega Highway, Kisumu, Kenya',
    deliveryLat: 0.0572,
    deliveryLng: 34.7291,
    notes: 'Kitchen storeroom intake: 15 bags dry red onions stored for dining operations. Bursar confirmed voucher.',
    expectedDeliveryDate: 'Sunday 9:00 AM',
    createdAt: '2026-10-18T09:00:00Z',
  },

  // 1 UNSUCCESSFUL SALE (RED) FOR ELIZABETH
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
        unitPrice: 22.0,
        unit: 'crate (15/day)',
        quantity: 15,
        lineTotal: 330.0,
      },
    ],
    subtotal: 330.0,
    discount: 0,
    deliveryFee: 0,
    totalAmount: 330.0,
    status: 'cancelled',
    deliveryAddress: 'Kisumu - Kakamega Highway, Kisumu, Kenya',
    deliveryLat: 0.0572,
    deliveryLng: 34.7291,
    notes: 'Unsuccessful delivery: Road was blocked due to fallen tree during heavy storm. Delivery cancelled by mutual agreement.',
    expectedDeliveryDate: 'Saturday 8:00 AM',
    createdAt: '2026-10-17T06:45:00Z',
  },
];
