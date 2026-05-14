import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IndianRupee, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const ReservationsTab = ({ userToken }) => {
  const toast = useToast();
  const [prePurchases, setPrePurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  // "Complete" modal state
  const [completeModal, setCompleteModal] = useState(false);
  const [completingOrder, setCompletingOrder] = useState(null);
  const [finalAmount, setFinalAmount] = useState('');
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchPrePurchases();
  }, [userToken]);

  const fetchPrePurchases = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/prepurchase', {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setPrePurchases(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/prepurchase/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      toast.success(`Reservation marked as ${status}.`);
      fetchPrePurchases();
    } catch (error) {
      toast.error('Failed to update reservation status.');
    }
  };

  // Open the "Complete" modal for a specific order
  const openCompleteModal = (order) => {
    setCompletingOrder(order);
    setFinalAmount(String(order.totalAmount)); // prefill with estimated amount
    setCompleteModal(true);
  };

  const handleComplete = async () => {
    if (!finalAmount || isNaN(finalAmount) || Number(finalAmount) < 0) {
      toast.error('Please enter a valid amount paid.');
      return;
    }
    setCompleting(true);
    try {
      await axios.put(`/api/prepurchase/${completingOrder._id}/status`, {
        status: 'Completed',
        finalAmount: Number(finalAmount)
      }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      toast.success(
        `Order completed. Final amount: ₹${Number(finalAmount).toLocaleString('en-IN')}`,
        'Order Completed'
      );
      setCompleteModal(false);
      setCompletingOrder(null);
      fetchPrePurchases();
    } catch (error) {
      toast.error('Failed to complete reservation.');
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Reservations</h2>

      {loading ? (
        <p className="text-gray-500">Loading reservations...</p>
      ) : prePurchases.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <p className="text-gray-500">No reservations found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Items</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Est. Total</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Paid at Store</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {prePurchases.map(order => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    <div className="font-medium">{order.user?.name}</div>
                    <div className="text-gray-500 text-xs">{order.user?.email}</div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {order.items.map(item => (
                      <div key={item.product?._id} className="text-xs mb-1">
                        {item.quantity}x {item.product?.name}
                      </div>
                    ))}
                  </td>
                  {/* Estimated (website) total */}
                  <td className="py-4 px-4 text-sm text-gray-400 line-through">
                    ₹{order.totalAmount}
                  </td>
                  {/* Actual paid amount */}
                  <td className="py-4 px-4 text-sm font-bold">
                    {order.finalAmount != null ? (
                      <span className="text-green-600">₹{order.finalAmount.toLocaleString('en-IN')}</span>
                    ) : (
                      <span className="text-gray-300 text-xs">Not yet paid</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Pending'   ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'Allocated' ? 'bg-blue-100 text-blue-800'    :
                      order.status === 'Completed' ? 'bg-green-100 text-green-800'  :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    {order.status === 'Pending' && (
                      <button
                        onClick={() => updateStatus(order._id, 'Allocated')}
                        className="text-indigo-600 hover:text-indigo-900 font-medium mr-3"
                      >
                        Allocate
                      </button>
                    )}
                    {order.status === 'Allocated' && (
                      <button
                        onClick={() => openCompleteModal(order)}
                        className="text-green-600 hover:text-green-900 font-medium"
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Complete Order Modal ── */}
      {completeModal && completingOrder && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[200]"
          onClick={() => setCompleteModal(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-dialog-pop"
            onClick={e => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="flex items-center justify-center mb-5">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <IndianRupee className="h-8 w-8 text-green-500" />
              </div>
            </div>

            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-gray-900">Enter Final Amount Paid</h3>
              <button onClick={() => setCompleteModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Customer info */}
            <p className="text-gray-500 text-sm mb-6">
              Customer: <span className="font-semibold text-gray-800">{completingOrder.user?.name}</span>
              <br />
              Items: {completingOrder.items.map(i => `${i.quantity}x ${i.product?.name}`).join(', ')}
            </p>

            {/* Reference row */}
            <div className="flex justify-between items-center bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 mb-4 text-sm">
              <span className="text-amber-700 font-medium">Website Estimate</span>
              <span className="text-amber-800 font-bold">₹{completingOrder.totalAmount}</span>
            </div>

            {/* Input */}
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actual Amount Collected (₹)
            </label>
            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
              <input
                type="number"
                min="0"
                value={finalAmount}
                onChange={e => setFinalAmount(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl pl-8 pr-4 py-3 text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white"
                placeholder="0"
                autoFocus
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setCompleteModal(false)}
                className="flex-1 px-6 py-3 rounded-2xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleComplete}
                disabled={completing}
                className="flex-1 px-6 py-3 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-colors shadow-lg shadow-green-100 disabled:opacity-60"
              >
                {completing ? 'Saving...' : 'Mark as Completed'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationsTab;
