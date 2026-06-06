import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../ui/ConfirmDialog';

const ProductManagementTab = () => {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [pendingDeleteName, setPendingDeleteName] = useState('');

  // Form state
  const [formData, setFormData] = useState({ name: '', description: '', price: '', quantity: '', category: '' });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/categories');
      setCategories(data);
      if (data.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: data[0].name }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', quantity: '', category: categories.length > 0 ? categories[0].name : '' });
    setImageFile(null);
    setPreviewUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
    });
    setImageFile(null);
    setPreviewUrl(product.imageUrl);
    setIsModalOpen(true);
  };

  // Step 1: open confirm dialog
  const promptDelete = (product) => {
    setPendingDeleteId(product._id);
    setPendingDeleteName(product.name);
    setConfirmOpen(true);
  };

  // Step 2: actually delete after confirmation
  const handleDelete = async () => {
    setConfirmOpen(false);
    try {
      await axios.delete(`/api/products/${pendingDeleteId}`);
      toast.success(`"${pendingDeleteName}" has been removed.`, 'Product Deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Could not delete the product. Please try again.', 'Delete Failed');
    } finally {
      setPendingDeleteId(null);
      setPendingDeleteName('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!editingId && !imageFile) {
      toast.error('Please select an image for the new product.', 'Image Required');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('quantity', formData.quantity);
      data.append('category', formData.category);
      if (imageFile) data.append('image', imageFile);

      if (editingId) {
        await axios.put(`/api/products/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success(`"${formData.name}" has been updated.`, 'Product Updated');
      } else {
        await axios.post('/api/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success(`"${formData.name}" has been added to the store.`, 'Product Added');
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error('Could not save the product. Please try again.', 'Save Failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Manage Products</h2>
        <button onClick={openAddModal} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Product</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Category</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Price</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Stock</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(product => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 flex items-center gap-3">
                    <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{product.category}</td>
                  <td className="py-4 px-4 text-sm font-bold text-gray-900">₹{product.price}</td>
                  <td className="py-4 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.quantity < 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {product.quantity}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button onClick={() => openEditModal(product)} className="text-indigo-600 hover:text-indigo-900 p-2"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => promptDelete(product)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400" rows="3"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity in Stock</label>
                  <input type="number" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    <option value="" disabled>Select a category</option>
                    {categories.map(c => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    id="product-image-upload"
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) { setImageFile(file); setPreviewUrl(URL.createObjectURL(file)); }
                    }}
                    className={`w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:bg-white ${previewUrl ? 'hidden' : ''}`}
                  />
                  {previewUrl && (
                    <div className="relative mt-2 inline-block">
                      <img src={previewUrl} alt="Preview" className="h-24 w-24 object-cover rounded-xl border border-gray-200 shadow-sm" />
                      <button
                        type="button"
                        onClick={() => { setImageFile(null); setPreviewUrl(''); const input = document.getElementById('product-image-upload'); if (input) input.value = ''; }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <button type="submit" disabled={submitting} className={`w-full py-4 mt-6 text-white rounded-xl font-bold transition-colors ${submitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                {submitting ? 'Saving...' : editingId ? 'Update Product' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Product?"
        message={`"${pendingDeleteName}" will be permanently removed from the store. This cannot be undone.`}
        confirmText="Yes, Delete"
        onConfirm={handleDelete}
        onCancel={() => { setConfirmOpen(false); setPendingDeleteId(null); }}
      />
    </div>
  );
};

export default ProductManagementTab;
