import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PrePurchaseContext } from '../context/PrePurchaseContext';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from '../api/axios';
import { Trash2, ArrowRight, Package } from 'lucide-react';

const PrePurchaseList = () => {
  const { prePurchaseItems, removeFromPrePurchase, getPrePurchaseTotal, clearPrePurchase } = useContext(PrePurchaseContext);
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmitPrePurchase = async () => {
    if (!user) {
      navigate('/login?redirect=/pre-purchase');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        items: prePurchaseItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          priceAtSelection: item.priceAtSelection
        })),
        totalAmount: getPrePurchaseTotal()
      };

      await axios.post('/api/prepurchase', payload);
      setSuccess(true);
      clearPrePurchase();
    } catch (error) {
      console.error("Submission failed", error);
      toast.error('Failed to submit pre-purchase request. Please try again.', 'Submission Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Request Received!</h1>
        <p className="text-xl text-gray-500 mb-8">
          Your pre-purchase list has been successfully submitted to MEHA Store. We will allocate these items for you.
        </p>
        <Link 
          to="/shop" 
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Your Pre-Purchase List</h1>

      {prePurchaseItems.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">Your list is empty</h2>
          <p className="text-gray-500 mb-6">Browse our products and add items to reserve them.</p>
          <Link 
            to="/shop" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            Go to Shop
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-grow">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {prePurchaseItems.map((item) => (
                  <li key={item.product._id} className="p-6 flex items-center gap-6">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name} 
                      className="w-24 h-24 object-cover rounded-xl bg-gray-50"
                    />
                    <div className="flex-grow">
                      <Link to={`/product/${item.product._id}`} className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors">
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">{item.product.category}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-medium text-gray-900">₹{item.priceAtSelection} x {item.quantity}</span>
                        <span className="font-bold text-indigo-600">₹{item.priceAtSelection * item.quantity}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromPrePurchase(item.product._id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                      title="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:w-[400px]">
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Reservation Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-500">
                  <span>Total Items</span>
                  <span>{prePurchaseItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between text-gray-900 font-bold text-xl pt-4 border-t border-gray-200">
                  <span>Estimated Total</span>
                  <span>₹{getPrePurchaseTotal()}</span>
                </div>
              </div>

              <div className="bg-indigo-50 p-4 rounded-xl mb-8">
                <p className="text-sm text-indigo-800">
                  <strong>Note:</strong> This total is estimated. You will pay directly at the store when picking up your items. No online payment is required.
                </p>
              </div>

              <button
                onClick={handleSubmitPrePurchase}
                disabled={isSubmitting}
                className="w-full py-4 px-6 border border-transparent text-lg font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-all hover:shadow-lg hover:-translate-y-1 flex items-center justify-center disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSubmitting ? 'Submitting...' : (
                  <>
                    Confirm Pre-Purchase <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
              
              {!user && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  You will be prompted to login first.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrePurchaseList;
