import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Users, Package, ShoppingCart, DollarSign, AlertCircle, TrendingUp, TrendingDown, Edit, Check, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const AnalyticsTab = () => {
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inline stock editing states
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState(0);
  const [saving, setSaving] = useState(false);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/admin/stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const startEdit = (product) => {
    setEditingProductId(product._id);
    setEditingQuantity(product.quantity);
  };

  const cancelEdit = () => {
    setEditingProductId(null);
  };

  const handleSaveStock = async (product) => {
    if (saving) return;
    const qty = parseInt(editingQuantity, 10);
    if (isNaN(qty) || qty < 0) {
      toast.error('Stock must be a non-negative number.', 'Invalid Quantity');
      return;
    }

    setSaving(true);
    try {
      const updatedProductData = {
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: qty,
        category: product.category,
        imageUrl: product.imageUrl
      };
      await axios.put(`/api/products/${product._id}`, updatedProductData, {
        headers: { 'Content-Type': 'application/json' }
      });
      toast.success(`"${product.name}" stock updated to ${qty}.`, 'Stock Updated');
      setEditingProductId(null);
      fetchStats();
    } catch (err) {
      toast.error('Failed to update stock. Please try again.', 'Update Failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gray-500">Loading analytics...</div>;
  if (!stats) return <div className="text-red-500">Failed to load analytics</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Reservations</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalReservations}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden">
          <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Weekly Revenue</p>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <p className="text-2xl font-bold text-gray-900">₹{stats.weeklyRevenue}</p>
              {stats.revenueTrend !== 0 && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                  stats.revenueTrend > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {stats.revenueTrend > 0 ? (
                    <>
                      <TrendingUp className="h-2.5 w-2.5" />
                      +{stats.revenueTrend}%
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-2.5 w-2.5" />
                      {stats.revenueTrend}%
                    </>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products Section */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 lg:col-span-1">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
            <Package className="h-5 w-5 text-indigo-600" /> Top 5 Products
          </h2>
          {(!stats.topProducts || stats.topProducts.length === 0) ? (
            <p className="text-gray-500 text-sm">No reservations data yet.</p>
          ) : (
            <div className="space-y-4">
              {stats.topProducts.map((item, idx) => (
                <div key={item._id} className="p-3 bg-gray-50 rounded-2xl flex flex-col gap-2 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400">#{idx + 1}</span>
                    <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">₹{item.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="font-medium text-gray-700">{item.totalQty} reserved</span>
                    <span className="text-gray-500 font-bold">₹{item.totalQty * item.price}</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(100, (item.totalQty / stats.topProducts[0].totalQty) * 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts Section */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-red-100 lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
            <AlertCircle className="h-5 w-5 text-red-500" /> Low Stock Alerts
          </h2>
          {stats.lowStockProducts.length === 0 ? (
            <p className="text-gray-500 text-sm">All products have sufficient stock.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2.5 px-4 text-xs font-medium text-gray-500">Product</th>
                    <th className="py-2.5 px-4 text-xs font-medium text-gray-500">Category</th>
                    <th className="py-2.5 px-4 text-xs font-medium text-gray-500">Stock Qty</th>
                    <th className="py-2.5 px-4 text-xs font-medium text-gray-500 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.lowStockProducts.map(product => {
                    const isEditing = editingProductId === product._id;
                    
                    // Style by stock level: red for 0, orange for 1-3, yellow for 4-5
                    let tierClass = "bg-amber-50/50 text-amber-800 border border-amber-200";
                    if (product.quantity === 0) {
                      tierClass = "bg-red-50/70 text-red-800 border border-red-200";
                    } else if (product.quantity <= 3) {
                      tierClass = "bg-orange-50/60 text-orange-800 border border-orange-200";
                    }

                    return (
                      <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-900 font-medium flex items-center gap-3">
                          <img src={product.imageUrl} alt={product.name} className="w-9 h-9 rounded-lg object-cover" />
                          <span className="truncate max-w-[150px]">{product.name}</span>
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-600">{product.category}</td>
                        <td className="py-3 px-4 text-sm font-semibold">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editingQuantity}
                                onChange={(e) => setEditingQuantity(e.target.value)}
                                className="w-16 px-2 py-1 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                min="0"
                                disabled={saving}
                              />
                            </div>
                          ) : (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tierClass}`}>
                              {product.quantity === 0 ? 'Out of Stock' : `${product.quantity} left`}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-right">
                          {isEditing ? (
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => handleSaveStock(product)}
                                disabled={saving}
                                className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                                title="Save"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                disabled={saving}
                                className="p-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                                title="Cancel"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEdit(product)}
                              className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-900 font-semibold transition-colors"
                            >
                              <Edit className="h-3 w-3" /> Quick Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
