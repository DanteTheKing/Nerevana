# Seller Order Management & Multi-Supplier Fulfillment Flow

Fix order attribution so school orders are correctly linked to suppliers (such as Elizabeth for fresh produce), and introduce an active Incoming Orders management workflow with multi-stage fulfillment (Accept, Dispatch, Deliver).

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and flow decisions were confirmed during the interactive review:

- **Confirmed Decision 1 (Order Placement & Attribution)**: When a school checks out with items in their cart, items are automatically split by seller into discrete Purchase Orders (`ProcurementOrder`). Cart items will now carry explicit `supplierId` and `supplierName`, preventing orders from defaulting to the wrong supplier.
- **Confirmed Decision 2 (Seller Navigation & Visibility)**: The seller dashboard will feature a dedicated **Incoming & Active Orders** tab (with a real-time badge count of pending actions) placed ahead of the historical completed sales view.
- **Confirmed Decision 3 (Order Fulfillment Lifecycle)**: Order processing adheres to a structured three-stage lifecycle:
  1. `submitted` (Pending Review): Elizabeth reviews incoming school POs with an **Accept & Confirm** button (or Decline option).
  2. `confirmed` (Preparing): Elizabeth packages produce with a **Dispatch & Send Delivery** button.
  3. `in_transit` (On the Way): Delivery driver/courier is en route with a **Confirm Delivery to School** button that finalizes the order into `delivered`.
  4. Final state triggers automatic update to **Sells Totals** and moves the record into completed sales.

---

### 1. Overview & Core Concept

- **What It Does**: Bridges the school buyer and institutional food supplier workflows. When Nyang'ori Boys High School (or any school) submits a purchase order for Elizabeth's fresh garden produce (Tomatoes, Pawpaw, Onions, Kales, Bananas), the order immediately appears in Elizabeth's dashboard under **Incoming Orders** with full school details, delivery location in Kenya, line items, and fulfillment controls.
- **Target Audience / Persona**: Elizabeth (local garden food supplier in Kisumu, Kenya) managing daily institutional deliveries, and School Procurement Officers (e.g., Nyang'ori Boys High School) tracking live PO fulfillment.
- **Key Value**: Eliminates the disconnect where school orders stayed stuck as pending on the buyer side without the supplier having visibility or the controls to accept, dispatch, and fulfill them.

---

### 2. User Experience & Visual Design

#### Key User Flows

1. **School Buyer Checkout Flow**:
   - School procurement officer adds fresh garden produce to cart (e.g., 10 bunches of Kales @ 50 KES, 100 Tomatoes @ 10 KES, 1 Pawpaw @ 800 KES).
   - In the PO checkout modal, the order summary highlights the supplier: **Elizabeth (Kisumu Central Market - Farm Depot)**.
   - When confirmed, the system creates a purchase order attributed directly to `sup_elizabeth` (`supplierId: 'sup_elizabeth'`, `supplierName: 'Elizabeth'`).
   - Buyer's Orders screen reflects `submitted` (Waiting for Elizabeth to Confirm).

2. **Elizabeth Seller Processing Flow**:
   - Elizabeth opens her dashboard; the top **Incoming Orders** tab highlights with an active count badge `(1 Pending)`.
   - The card shows school name (`Nyang'ori Boys High School`), delivery address (`Kisumu - Kakamega Highway, Kisumu, Kenya`), expected date, item breakdown in KES, and notes.
   - Stage 1: Elizabeth clicks **Accept Order** $\rightarrow$ Status changes to `confirmed` (Preparing for delivery).
   - Stage 2: Elizabeth clicks **Dispatch Order** $\rightarrow$ Status changes to `in_transit` (Out for delivery).
   - Stage 3: Elizabeth clicks **Mark Delivered** $\rightarrow$ Status changes to `delivered`. Order seamlessly transitions into her **Sells Totals** metric and **Sales History Panel**.

3. **Multi-Supplier Cart Checkout**:
   - If a school cart contains produce from Elizabeth and textbooks from another supplier, the checkout automatically creates two distinct POs with their respective supplier IDs, ensuring each seller sees only their designated items.

#### Visual Identity & Clean Layout (Zero-Pill Discipline)

- **Tabs & Navigation**:
  - `Incoming & Active Orders (N)`: Primary action hub for active business.
  - `Food Produce Listings (5)`: Daily inventory management (15/day quota).
  - `Sales History Panel`: Completed and historical sales archives.
  - `Delivery Coverage`: 25 km Kisumu operational radius setting.
- **Order Card Styling**: Clean, unboxed text hierarchy (`Nyang'ori Boys High School · Kisumu - Kakamega Highway · PO-2026-XXXX`). Action buttons follow distinct, intentional colors (Sky for review, Amber for in-transit, Emerald for delivery confirmation).
- **Metric Sync**: Top "Sells Totals" and "Successful Sales" reflect live completed orders in KES without color labels in the metric box names.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Explicit Supplier Attribution on Cart Items**
  - *Chosen Approach*: Store `supplierId` and `supplierName` on every `CartItem` at the moment of `handleAddToCart`.
  - *Why*: Prevents fallback heuristics where checkout guessed the supplier using `suppliers[0]` (which was assigning orders to Apex Academic Supplies).
  - *Alternatives Considered*: Re-querying products during checkout; discarded because cart items should be self-contained snapshots.

- **Decision 2: Automated Multi-Supplier Cart Splitting**
  - *Chosen Approach*: `CartModal` groups items by `supplierId` and emits an order per unique supplier.
  - *Why*: Allows institutional buyers to order everything in one session while maintaining clean accounting and separate POs per supplier.

- **Decision 3: Dedicated Incoming Orders Tab vs. Single Mixed History List**
  - *Chosen Approach*: Separate active actionable orders (`submitted`, `confirmed`, `in_transit`) from closed history (`delivered`, `cancelled`).
  - *Why*: Suppliers need immediate, uncluttered visibility of tasks requiring physical fulfillment today without sifting through archive logs.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                       School Buyer                          │
│   Selects Elizabeth Produce (Tomatoes, Kales, Pawpaw...)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 handleAddToCart(product, qty)                │
│    Appends: supplierId: 'sup_elizabeth', supplierName: '...' │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   CartModal Checkout Flow                   │
│   Groups items by supplierId -> Generates PO per supplier   │
│   Dispatches: { supplierId: 'sup_elizabeth', status: '...' }│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Shared Orders State                      │
│   (Firestore / React State with real-time sync)             │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐
│       Buyer Orders View      │ │      Seller Dashboard        │
│   Tracks live status changes │ │   Incoming Orders Tab:       │
│   - Pending -> Confirmed     │ │   - [Accept & Confirm]       │
│   - In Transit -> Delivered  │ │   - [Dispatch Delivery]      │
│                              │ │   - [Confirm Delivered]      │
└──────────────────────────────┘ └──────────────────────────────┘
```

#### State & Component Changes

1. **`src/utils/procurement.ts`**:
   - Add `supplierId: string` and `supplierName: string` to `CartItem`.
2. **`src/App.tsx`**:
   - Update `handleAddToCart` to pass `product.supplierId` and `product.supplierName`.
   - Update `handleCreateOrder` to accept array of orders (or single/multi POs).
   - Ensure `handleAdvanceOrderStatus` supports `submitted` $\rightarrow$ `confirmed` $\rightarrow$ `in_transit` $\rightarrow$ `delivered`.
   - Provide `handleCancelOrder` if the seller declines.
3. **`src/components/CartModal.tsx`**:
   - Group cart items by `supplierId`.
   - Generate distinct POs with accurate supplier IDs and totals.
4. **`src/components/SellerDashboard.tsx`**:
   - Add `Incoming & Active Orders` tab with count badge.
   - Display actionable cards with status steppers and clear fulfillment buttons.
   - Synchronize with `Sells Totals` upon delivery completion.
