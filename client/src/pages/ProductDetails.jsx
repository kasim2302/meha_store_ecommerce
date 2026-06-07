import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { PrePurchaseContext } from '../context/PrePurchaseContext';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Plus, Minus, CheckCircle } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToPrePurchase } = useContext(PrePurchaseContext);
  const { user } = useContext(AuthContext);
  const toast = useToast();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToPrePurchase = () => {
    if (!user) {
      toast.info('Please login first to pre-book this product.', 'Login Required');
      return;
    }
    addToPrePurchase(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-24 text-xl text-gray-500">Product not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Shop
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-gray-50 flex items-center justify-center p-8 md:p-16">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="max-w-full h-auto rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
          <div className="text-sm text-indigo-600 font-bold uppercase tracking-wider mb-2">{product.category}</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">{product.name}</h1>

          {/* Price with "Estimated" label */}
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-2xl font-bold text-gray-900">₹{product.price}</p>
            <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Estimated</span>
          </div>
          <p className="text-xs text-gray-400 mb-6">
            Final price confirmed at store — may vary based on discounts &amp; negotiation.
          </p>

          <div className="prose prose-sm text-gray-500 mb-8">
            <p>{product.description}</p>
          </div>

          <div className="mt-auto">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-medium text-gray-700">Quantity</span>
              <div className="flex items-center border border-gray-200 rounded-full bg-gray-50">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-medium text-gray-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-gray-500">
                {product.quantity > 0 ? `${product.quantity} available in store` : 'Out of stock'}
              </span>
            </div>

            <button 
              onClick={handleAddToPrePurchase}
              disabled={product.quantity <= 0}
              className={`w-full py-4 rounded-full font-bold text-lg flex items-center justify-center transition-all ${
                product.quantity <= 0 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : added 
                    ? 'bg-green-500 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 hover:-translate-y-1'
              }`}
            >
              {added ? (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" /> Added to Pre-Purchase
                </>
              ) : (
                'Add to Pre-Purchase List'
              )}
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Pre-selecting this item notifies us to reserve it for your in-store pickup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
