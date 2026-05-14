import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Users, Package, ShoppingCart, DollarSign, AlertCircle } from 'lucide-react';

const AnalyticsTab = ({ userToken }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/admin/stats', {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [userToken]);

  if (loading) return <div className="text-gray-500">Loading analytics...</div>;
  if (!stats) return <div className="text-red-500">Failed to load analytics</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
          <AlertCircle className="h-6 w-6 text-red-500" /> Low Stock Alerts
        </h2>
        {stats.lowStockProducts.length === 0 ? (
          <p className="text-gray-500">All products have sufficient stock.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-sm font-medium text-gray-500">Product</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-500">Category</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-500">Quantity Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.lowStockProducts.map(product => (
                  <tr key={product._id} className="bg-red-50 hover:bg-red-100 transition-colors">
                    <td className="py-4 px-4 text-sm text-gray-900 font-medium flex items-center gap-3">
                      <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                      {product.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{product.category}</td>
                    <td className="py-4 px-4 text-sm font-bold text-red-600">{product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsTab;
