import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axios';
import { Package, Clock, CheckCircle, XCircle, ShoppingBag, ChevronRight, X } from 'lucide-react';

const STATUS_CONFIG = {
  Pending:   { color: 'bg-yellow-100 text-yellow-800',  icon: Clock,         label: 'Pending'   },
  Allocated: { color: 'bg-blue-100 text-blue-800',      icon: Package,       label: 'Allocated' },
  Completed: { color: 'bg-green-100 text-green-800',    icon: CheckCircle,   label: 'Completed' },
  Cancelled: { color: 'bg-red-100 text-red-800',        icon: XCircle,       label: 'Cancelled' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
      <Icon className="h-3.5 w-3.5" />
      {cfg.label}
    </span>
  );
};

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/my-orders');
      return;
    }
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/prepurchase/my-reservations');
        // Newest first
        setOrders([...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    setCancellingId(orderId);
    try {
      await axios.delete(`/api/prepurchase/${orderId}`);
      setOrders((prev) =>
        prev.map((o) => o._id === orderId ? { ...o, status: 'Cancelled' } : o)
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel reservation');
    } finally {
      setCancellingId(null);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Reservations</h1>
        <p className="text-gray-500 mt-1">Track all your pre-purchase reservations and their status.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
        </div>
      ) : orders.length === 0 ? (
        /* Empty state */
        <div className="text-center py-24 bg-gray-50 rounded-3xl border border-gray-100">
          <ShoppingBag className="h-14 w-14 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No reservations yet</h2>
          <p className="text-gray-500 mb-6">Browse our shop and add items to your pre-purchase list.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-full transition-colors"
          >
            Go to Shop <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Order header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-gray-100 gap-3">
                <div className="flex items-center gap-4">
                  <StatusBadge status={order.status} />
                  <span className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Estimated total</p>
                  <p className="text-base font-bold text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Items list */}
              <ul className="divide-y divide-gray-50">
                {order.items.map((item) => (
                  <li key={item._id} className="flex items-center gap-4 px-6 py-4">
                    {item.product ? (
                      <>
                        <div className="h-16 w-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <Link
                            to={`/product/${item.product._id}`}
                            className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors text-sm line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Qty: {item.quantity} &nbsp;·&nbsp; ₹{item.priceAtSelection} each
                          </p>
                        </div>
                        <div className="text-sm font-bold text-gray-800 flex-shrink-0">
                          ₹{(item.quantity * item.priceAtSelection).toLocaleString('en-IN')}
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-400 italic">Product no longer available</p>
                    )}
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
                <div className="flex-1">
                  {order.finalAmount != null ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600">
                        Paid at store:{' '}
                        <span className="font-bold text-green-700">
                          ₹{order.finalAmount.toLocaleString('en-IN')}
                        </span>
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">
                      {order.status === 'Pending'
                        ? 'Waiting for store to allocate your items.'
                        : order.status === 'Allocated'
                        ? '✅ Items reserved — visit the store to complete your purchase.'
                        : order.status === 'Cancelled'
                        ? 'This reservation was cancelled.'
                        : ''}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-300 font-mono hidden sm:block">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                  {order.status === 'Pending' && (
                    <button
                      onClick={() => handleCancel(order._id)}
                      disabled={cancellingId === order._id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <X className="h-3.5 w-3.5" />
                      {cancellingId === order._id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
