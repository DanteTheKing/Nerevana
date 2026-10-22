import React, { useState } from 'react';
import { ProcurementOrder } from '../data/seedData';
import { formatCurrency } from '../utils/procurement';
import { Package, Clock, CheckCircle2, Truck, ChevronDown, ChevronUp, MapPin, Building2, Calendar, BarChart3 } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

interface OrdersViewProps {
  orders: ProcurementOrder[];
  isSellerMode?: boolean;
  onAdvanceOrderStatus?: (orderId: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  isSellerMode = false,
  onAdvanceOrderStatus,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  // Prepare chart data: Monthly procurement spend by supplier category
  // Since our orders have createdAt (e.g. '2026-10-21T...'), let's group by Month and Category
  const categorySpendMap: { [monthCategory: string]: { month: string; category: string; spend: number } } = {};

  orders.forEach((o) => {
    const dateObj = new Date(o.createdAt || Date.now());
    const monthName = dateObj.toLocaleString('default', { month: 'short', year: 'numeric' });
    
    // Determine category based on supplier name or default category
    let category = 'General Supplies';
    if (o.supplierName.includes('Elizabeth') || o.supplierName.includes('Evergreen')) {
      category = 'Catering & Food';
    } else if (o.supplierName.includes('Apex')) {
      category = 'Stationery & Books';
    } else if (o.supplierName.includes('Quantum')) {
      category = 'STEM & Lab';
    } else if (o.supplierName.includes('Titan')) {
      category = 'Sports & Athletics';
    }

    const key = `${monthName}_${category}`;
    if (!categorySpendMap[key]) {
      categorySpendMap[key] = { month: monthName, category, spend: 0 };
    }
    categorySpendMap[key].spend += o.totalAmount;
  });

  // Reformat into recharts format: array of { month, [category]: spend }
  const monthlyDataMap: { [month: string]: { month: string; [cat: string]: any } } = {};
  const categoriesSet = new Set<string>();

  Object.values(categorySpendMap).forEach((item) => {
    categoriesSet.add(item.category);
    if (!monthlyDataMap[item.month]) {
      monthlyDataMap[item.month] = { month: item.month };
    }
    monthlyDataMap[item.month][item.category] = (monthlyDataMap[item.month][item.category] || 0) + item.spend;
  });

  const chartData = Object.values(monthlyDataMap);
  const categories = Array.from(categoriesSet);
  const colors = ['#0284c7', '#059669', '#d97706', '#7c3aed', '#db2777'];

  const getStatusBadge = (status: ProcurementOrder['status']) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-500" />
            Submitted
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3 h-3 text-blue-500" />
            Confirmed
          </span>
        );
      case 'in_transit':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <Truck className="w-3 h-3 text-sky-500 animate-bounce" />
            Out for Delivery
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Received & Fulfilled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const getNextActionLabel = (status: ProcurementOrder['status']) => {
    switch (status) {
      case 'submitted':
        return 'Confirm Order';
      case 'confirmed':
        return 'Dispatch / Out for Delivery';
      case 'in_transit':
        return 'Mark as Delivered';
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Monthly Procurement Spend Chart */}
      {!isSellerMode && chartData.length > 0 && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Monthly Procurement Spend by Category</h3>
                <p className="text-xs text-slate-500">Visualizing expenditures across supplier categories over time.</p>
              </div>
            </div>
          </div>

          <div className="w-full h-72 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(val: any) => formatCurrency(Number(val) || 0)}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                {categories.map((cat, idx) => (
                  <Bar key={cat} dataKey={cat} fill={colors[idx % colors.length]} radius={[6, 6, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'submitted', 'confirmed', 'in_transit', 'delivered'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilterStatus(st)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterStatus === st
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st === 'all'
              ? 'All POs'
              : st === 'in_transit'
              ? 'Out for Delivery'
              : st.charAt(0).toUpperCase() + st.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-slate-800 text-sm">No purchase orders found</h4>
          <p className="text-xs text-slate-500 mt-1">There are no orders matching the selected status.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const nextAction = isSellerMode ? getNextActionLabel(order.status) : null;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all overflow-hidden"
              >
                {/* Header Row */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                        {order.poNumber}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                      <span className="flex items-center gap-1 font-semibold text-slate-900">
                        <Building2 className="w-3.5 h-3.5 text-sky-500" />
                        {isSellerMode ? order.buyerName : order.supplierName}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Expected: {order.expectedDeliveryDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <div className="text-base font-extrabold text-slate-900">
                        {formatCurrency(order.totalAmount)}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {nextAction && onAdvanceOrderStatus && (
                        <button
                          type="button"
                          onClick={() => onAdvanceOrderStatus(order.id)}
                          className="px-3 py-1.5 bg-sky-600 text-white rounded-xl text-xs font-semibold hover:bg-sky-700 shadow-xs cursor-pointer transition-all"
                        >
                          {nextAction}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
                        title={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status Stepper Progress Bar */}
                <div className="px-4 sm:px-5 pb-3">
                  <div className="grid grid-cols-4 gap-1 text-[10px] font-semibold text-center mb-1 text-slate-500">
                    <span className={order.status !== 'cancelled' ? 'text-sky-700 font-bold' : ''}>1. Submitted</span>
                    <span className={['confirmed', 'in_transit', 'delivered'].includes(order.status) ? 'text-sky-700 font-bold' : ''}>2. Confirmed</span>
                    <span className={['in_transit', 'delivered'].includes(order.status) ? 'text-sky-700 font-bold' : ''}>3. In Transit</span>
                    <span className={order.status === 'delivered' ? 'text-emerald-700 font-bold' : ''}>4. Fulfilled</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full bg-sky-500 transition-all duration-300 ${
                        order.status === 'submitted'
                          ? 'w-1/4'
                          : order.status === 'confirmed'
                          ? 'w-2/4'
                          : order.status === 'in_transit'
                          ? 'w-3/4'
                          : order.status === 'delivered'
                          ? 'w-full bg-emerald-500'
                          : 'w-0'
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="bg-slate-50/70 p-4 border-t border-slate-100 space-y-3 text-xs">
                    <div>
                      <div className="font-semibold text-slate-700 mb-1.5">Ordered Products:</div>
                      <div className="space-y-1">
                        {order.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between py-1 border-b border-slate-200/60 last:border-0"
                          >
                            <span className="text-slate-800 font-medium">
                              {it.quantity}x {it.title} ({it.unit})
                            </span>
                            <span className="font-semibold text-slate-900">{formatCurrency(it.lineTotal)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                      <div>
                        <span className="font-semibold text-slate-700">Delivery Address:</span>{' '}
                        <div className="flex items-center gap-1 mt-0.5 text-slate-800">
                          <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                          <span>{order.deliveryAddress}</span>
                        </div>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Receiving Dock Instructions:</span>
                        <div className="text-slate-800 mt-0.5 italic">"{order.notes || 'None specified'}"</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
