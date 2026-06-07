import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, X, Star } from 'lucide-react';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';

const Shop = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { recentlyViewed } = useRecentlyViewed();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/categories');
        setCategories(['All', ...data.map(c => c.name)]);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch ALL products once (search/filter/sort done client-side)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/products');
        setAllProducts(res.data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Derive filtered + sorted list from allProducts
  const filteredProducts = allProducts
    .filter(p => activeCategory === 'All' || p.category === activeCategory)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 p.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(p => {
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);
      if (!isNaN(min) && p.price < min) return false;
      if (!isNaN(max) && p.price > max) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':  return a.price - b.price;
        case 'price_desc': return b.price - a.price;
        case 'name_asc':   return a.name.localeCompare(b.name);
        case 'newest':
        default:           return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('newest');
    setMinPrice('');
    setMaxPrice('');
    setActiveCategory('All');
  };

  const hasActiveFilters = searchQuery || sortBy !== 'newest' || minPrice || maxPrice || activeCategory !== 'All';

  const StarDisplay = ({ rating, size = 'sm' }) => {
    const s = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            className={`${s} ${i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Our Collection</h1>
          <p className="text-gray-500 mt-2">Find the perfect items and pre-purchase them today.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-full bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-400'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters{hasActiveFilters ? ' •' : ''}
          </button>
        </div>
      </div>

      {/* Expanded Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {/* Sort */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="name_asc">Name: A → Z</option>
            </select>
          </div>
          {/* Price Min */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Min Price (₹)</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {/* Price Max */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Max Price (₹)</label>
            <input
              type="number"
              min="0"
              placeholder="Any"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {/* Clear */}
          {hasActiveFilters && (
            <div className="sm:col-span-3 flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <X className="h-3.5 w-3.5" /> Clear all filters
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Category Pills */}
      <div className="flex overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar">
        <div className="flex items-center gap-2 px-2 border-r border-gray-200 mr-2 text-gray-400">
          <Filter className="h-4 w-4" />
        </div>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-gray-500 mb-6">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-2xl">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No products found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 text-indigo-600 text-sm font-medium hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              key={product._id}
              className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <Link to={`/product/${product._id}`} className="block relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.quantity <= 0 && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    Out of Stock
                  </div>
                )}
              </Link>
              <div className="p-5 flex flex-col flex-grow">
                <div className="text-xs text-indigo-600 font-semibold mb-1 uppercase tracking-wider">{product.category}</div>
                <Link to={`/product/${product._id}`} className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1 mb-1">
                  {product.name}
                </Link>
                {/* Star rating */}
                {product.numReviews > 0 && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <StarDisplay rating={product.averageRating} />
                    <span className="text-xs text-gray-400">({product.numReviews})</span>
                  </div>
                )}
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                    <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">est.</span>
                  </div>
                  <Link
                    to={`/product/${product._id}`}
                    className="text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Recently Viewed Strip */}
      {recentlyViewed.length > 0 && (
        <div className="mt-20">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recently Viewed</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {recentlyViewed.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group flex flex-col bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all"
              >
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-gray-800 line-clamp-1">{product.name}</p>
                  <p className="text-xs text-indigo-600 font-bold mt-0.5">₹{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
