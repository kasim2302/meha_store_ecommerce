import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { PrePurchaseContext } from '../context/PrePurchaseContext';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { ArrowLeft, Plus, Minus, CheckCircle, Star, User } from 'lucide-react';

// ── Star display (read-only) ──────────────────────────────────
const StarDisplay = ({ rating, size = 'md' }) => {
  const s = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`${s} ${i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
        />
      ))}
    </div>
  );
};

// ── Interactive star picker (for review form) ─────────────────
const StarPicker = ({ value, onChange }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map(i => (
      <button
        key={i}
        type="button"
        onClick={() => onChange(i)}
        className="focus:outline-none transition-transform hover:scale-110"
      >
        <Star
          className={`h-7 w-7 ${i <= value ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-gray-100'}`}
        />
      </button>
    ))}
  </div>
);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToPrePurchase } = useContext(PrePurchaseContext);
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const { recentlyViewed, addToRecentlyViewed } = useRecentlyViewed();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.error('Failed to fetch product', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Track this product as recently viewed once loaded
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product?._id]);

  const handleAddToPrePurchase = () => {
    if (!user) {
      toast.info('Please login first to pre-book this product.', 'Login Required');
      return;
    }
    addToPrePurchase(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError('');

    if (reviewRating === 0) {
      setReviewError('Please select a star rating');
      return;
    }
    if (reviewComment.trim().length === 0) {
      setReviewError('Please write a comment');
      return;
    }

    setReviewLoading(true);
    try {
      await axios.post(`/api/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      toast.success('Review submitted! Thank you.', 'Review Posted');
      setReviewRating(0);
      setReviewComment('');
      // Refresh product to show new review
      await fetchProduct();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to submit review';
      setReviewError(msg);
    } finally {
      setReviewLoading(false);
    }
  };

  // Check if current user already reviewed
  const userHasReviewed = product?.reviews?.some(
    r => r.user === user?._id || r.user?.toString() === user?._id?.toString()
  );

  // Filter recently viewed to exclude the current product
  const otherRecentlyViewed = recentlyViewed.filter(p => p._id !== id);

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

      {/* Product Card */}
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
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">{product.name}</h1>

          {/* Rating summary */}
          <div className="flex items-center gap-3 mb-4">
            {product.numReviews > 0 ? (
              <>
                <StarDisplay rating={product.averageRating} />
                <span className="text-sm font-semibold text-gray-700">
                  {product.averageRating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-400">
                  ({product.numReviews} review{product.numReviews !== 1 ? 's' : ''})
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-400 italic">No reviews yet — be the first!</span>
            )}
          </div>

          {/* Price */}
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
                {product.quantity > 0 ? (
                  <>
                    {product.quantity <= 3 && (
                      <span className="inline-flex items-center mr-2 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600">
                        Only {product.quantity} left!
                      </span>
                    )}
                    {product.quantity > 3 && product.quantity <= 5 && (
                      <span className="inline-flex items-center mr-2 px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-600">
                        Almost gone!
                      </span>
                    )}
                    {product.quantity} available in store
                  </>
                ) : 'Out of stock'}
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

      {/* ── Reviews Section ─────────────────────────────────────── */}
      <div className="mt-16">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Customer Reviews
          {product.numReviews > 0 && (
            <span className="ml-3 text-base font-normal text-gray-400">({product.numReviews})</span>
          )}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Review list */}
          <div className="lg:col-span-2 space-y-6">
            {product.reviews?.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
                <Star className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No reviews yet</p>
                <p className="text-gray-400 text-sm mt-1">Be the first to share your experience!</p>
              </div>
            ) : (
              product.reviews.map((review) => (
                <div key={review._id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <StarDisplay rating={review.rating} size="sm" />
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Review form */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Write a Review</h3>
              <p className="text-sm text-gray-500 mb-5">Share your experience with this product</p>

              {!user ? (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500 mb-3">Please log in to write a review</p>
                  <Link
                    to={`/login?redirect=/product/${id}`}
                    className="inline-block px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    Log In
                  </Link>
                </div>
              ) : userHasReviewed ? (
                <div className="text-center py-6">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 font-medium">You've already reviewed this product</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                    <StarPicker value={reviewRating} onChange={setReviewRating} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                    <textarea
                      rows={4}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="What did you think about this product?"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-colors"
                    />
                  </div>
                  {reviewError && (
                    <p className="text-sm text-red-500 font-medium">{reviewError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-70"
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Recently Viewed Strip ────────────────────────────────── */}
      {otherRecentlyViewed.length > 0 && (
        <div className="mt-20">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recently Viewed</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {otherRecentlyViewed.map((p) => (
              <Link
                key={p._id}
                to={`/product/${p._id}`}
                className="group flex flex-col bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all"
              >
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-gray-800 line-clamp-1">{p.name}</p>
                  <p className="text-xs text-indigo-600 font-bold mt-0.5">₹{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
