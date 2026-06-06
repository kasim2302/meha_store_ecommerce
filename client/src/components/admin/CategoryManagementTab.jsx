import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Plus, Trash2, Tag } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../ui/ConfirmDialog';

const CategoryManagementTab = () => {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Confirm dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [pendingDeleteName, setPendingDeleteName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/categories');
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSubmitting(true);
    try {
      await axios.post('/api/categories', { name: newName.trim(), description: newDesc.trim() });
      toast.success(`"${newName.trim()}" has been added.`, 'Category Created');
      setNewName('');
      setNewDesc('');
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add category.', 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  const promptDelete = (cat) => {
    setPendingDeleteId(cat._id);
    setPendingDeleteName(cat.name);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    setConfirmOpen(false);
    try {
      await axios.delete(`/api/categories/${pendingDeleteId}`);
      toast.success(`"${pendingDeleteName}" has been removed.`, 'Category Deleted');
      fetchCategories();
    } catch (error) {
      toast.error('Could not delete the category. Please try again.', 'Delete Failed');
    } finally {
      setPendingDeleteId(null);
      setPendingDeleteName('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Add new category */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
            <Plus className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Add New Category</h2>
        </div>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            required
            placeholder="Category name (e.g. Accessories)"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
          />
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-60 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            {submitting ? 'Adding...' : 'Add Category'}
          </button>
        </form>
      </div>

      {/* Category list */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">All Categories</h2>
        {loading ? (
          <p className="text-gray-500">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-500">No categories yet. Add one above.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <div key={cat._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50 hover:bg-purple-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                    <Tag className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{cat.name}</p>
                    {cat.description && <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>}
                  </div>
                </div>
                <button
                  onClick={() => promptDelete(cat)}
                  className="text-gray-300 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Category?"
        message={`"${pendingDeleteName}" will be permanently deleted. Products in this category will remain but will appear under "All" until reassigned.`}
        confirmText="Yes, Delete"
        onConfirm={handleDelete}
        onCancel={() => { setConfirmOpen(false); setPendingDeleteId(null); }}
      />
    </div>
  );
};

export default CategoryManagementTab;
