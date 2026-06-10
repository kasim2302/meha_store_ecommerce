import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, ArrowRight, Star } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const StarDisplay = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
      />
    ))}
  </div>
);

const Wishlist = () => {
  const { user } = useContext(AuthContext);
  const { wishlist, removeFromWishlist } = useWishlist();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <Heart className="h-16 w-16 text-gray-200 mx-auto mb-6" />
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Your Wishlist</h1>
        <p className="text-gray-500 mb-8">Please log in to view and manage your wishlist.</p>
        <Link
          to="/login?redirect=/wishlist"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-full transition-colors"
        >
          Log In <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Wishlist</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {wishlist.length > 0
              ? `${wishlist.length} saved item${wishlist.length !== 1 ? 's' : ''}`
              : 'No items saved yet'}
          </p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-3xl border border-gray-100">
          <Heart className="h-14 w-14 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">
            Save items you love by clicking the ❤️ on any product.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-full transition-colors"
          >
            Browse Shop <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlist.map((product) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.25 } }}
                transition={{ duration: 0.3 }}
                className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <Link to={`/product/${product._id}`} className="relative block aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.salePrice && (
                    <div className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                      SALE
                    </div>
                  )}
                  {product.quantity <= 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-white text-gray-900 text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-1">{product.category}</div>
                  <Link
                    to={`/product/${product._id}`}
                    className="font-bold text-gray-900 hover:text-indigo-600 transition-colors text-sm line-clamp-2 mb-2"
                  >
                    {product.name}
                  </Link>

                  {product.numReviews > 0 && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <StarDisplay rating={product.averageRating} />
                      <span className="text-xs text-gray-400">({product.numReviews})</span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mt-auto mb-3">
                    {product.salePrice ? (
                      <>
                        <span className="text-lg font-bold text-rose-600">₹{product.salePrice}</span>
                        <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/product/${product._id}`}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Pre-Purchase
                    </Link>
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="flex items-center justify-center w-9 h-9 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 transition-colors flex-shrink-0"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
