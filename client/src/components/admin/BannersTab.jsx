import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Plus, Trash2, Edit, Save, Power, PowerOff, Link2, Eye, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const BannersTab = () => {
  const toast = useToast();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [bgColor, setBgColor] = useState('#3b82f6');
  const [textColor, setTextColor] = useState('#ffffff');
  const [link, setLink] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchBanners = async () => {
    try {
      const { data } = await axios.get('/api/banners/admin');
      setBanners(data);
    } catch (error) {
      console.error('Failed to fetch banners', error);
      toast.error('Could not load banners.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSubtitle('');
    setBgColor('#3b82f6');
    setTextColor('#ffffff');
    setLink('');
    setIsActive(true);
  };

  const handleEdit = (banner) => {
    setEditingId(banner._id);
    setTitle(banner.title);
    setSubtitle(banner.subtitle || '');
    setBgColor(banner.bgColor || '#3b82f6');
    setTextColor(banner.textColor || '#ffffff');
    setLink(banner.link || '');
    setIsActive(banner.isActive);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Banner title is required.', 'Validation Error');
      return;
    }

    setSubmitting(true);
    const bannerData = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      bgColor,
      textColor,
      link: link.trim(),
      isActive
    };

    try {
      if (editingId) {
        await axios.put(`/api/banners/${editingId}`, bannerData);
        toast.success('Promotional banner updated successfully.', 'Banner Updated');
      } else {
        await axios.post('/api/banners', bannerData);
        toast.success('Promotional banner created successfully.', 'Banner Created');
      }
      resetForm();
      fetchBanners();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save promotional banner.', 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      const updated = !banner.isActive;
      await axios.put(`/api/banners/${banner._id}`, { isActive: updated });
      toast.success(
        `Banner "${banner.title}" is now ${updated ? 'Active' : 'Inactive'}.`, 
        'Status Toggled'
      );
      fetchBanners();
    } catch (error) {
      toast.error('Failed to toggle status.', 'Error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete banner "${name}"?`)) return;
    try {
      await axios.delete(`/api/banners/${id}`);
      toast.success('Banner removed.', 'Deleted');
      fetchBanners();
    } catch (error) {
      toast.error('Failed to delete banner.', 'Error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Banner Builder Form */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 lg:col-span-1 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">
              {editingId ? 'Edit Banner' : 'Create Banner'}
            </h2>
            {editingId && (
              <button 
                onClick={resetForm}
                className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 font-semibold"
              >
                <X className="h-3 w-3" /> Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-gray-700">
            <div>
              <label className="block text-gray-500 mb-1">Title *</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Clearance Sale — Up to 50% Off!" 
                className="w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-500 mb-1">Subtitle</label>
              <input 
                type="text" 
                value={subtitle} 
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Offer valid till Sunday. Use code MEHA50" 
                className="w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 mb-1">Background Color</label>
                <div className="flex gap-2 items-center">
                  <input 
                    type="color" 
                    value={bgColor} 
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                  />
                  <input 
                    type="text" 
                    value={bgColor} 
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full px-2 py-1.5 border rounded-lg text-center font-mono font-medium text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">Text Color</label>
                <div className="flex gap-2 items-center">
                  <input 
                    type="color" 
                    value={textColor} 
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                  />
                  <input 
                    type="text" 
                    value={textColor} 
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full px-2 py-1.5 border rounded-lg text-center font-mono font-medium text-[11px]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-500 mb-1">Link URL (optional)</label>
              <input 
                type="text" 
                value={link} 
                onChange={(e) => setLink(e.target.value)}
                placeholder="e.g. /shop or /product/60c72b2..." 
                className="w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="isActiveCheckbox" 
                checked={isActive} 
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <label htmlFor="isActiveCheckbox" className="text-gray-700 select-none">Active immediately on homepage</label>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {editingId ? 'Save Changes' : 'Create Banner'}
            </button>
          </form>

          {/* Live Preview Inside Editor */}
          <div className="border-t border-gray-100 pt-4 space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Eye className="h-3 w-3" /> Live Preview
            </p>
            <div 
              className="p-4 rounded-2xl shadow-sm text-center select-none"
              style={{ backgroundColor: bgColor, color: textColor }}
            >
              <p className="font-extrabold text-sm">{title || 'Your Promo Title Here'}</p>
              {subtitle && <p className="text-xs opacity-90 mt-0.5">{subtitle}</p>}
              {link && (
                <span className="inline-flex items-center gap-1 text-[10px] mt-1.5 opacity-80 underline hover:opacity-100 cursor-pointer font-bold">
                  <Link2 className="h-2.5 w-2.5" /> Shop Now
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Existing Banners Management List */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Promotional Banners List</h2>
          {loading ? (
            <p className="text-gray-500 text-xs font-semibold">Loading banners...</p>
          ) : banners.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">No banners created yet.</p>
              <p className="text-xs mt-1">Design one on the left to highlight store sales!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {banners.map((banner) => (
                <div key={banner._id} className="p-4 border rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-sm transition-all duration-200 bg-gray-50/50">
                  <div className="space-y-2 flex-1 w-full min-w-0">
                    {/* Live Preview Strip */}
                    <div 
                      className="p-3.5 rounded-xl text-center text-xs"
                      style={{ backgroundColor: banner.bgColor, color: banner.textColor }}
                    >
                      <p className="font-extrabold">{banner.title}</p>
                      {banner.subtitle && <p className="text-[10px] opacity-90 mt-0.5">{banner.subtitle}</p>}
                      {banner.link && (
                        <p className="text-[9px] opacity-75 mt-1 underline truncate">Link: {banner.link}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions Toolbar */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                        banner.isActive 
                          ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      title={banner.isActive ? 'Active — click to pause' : 'Inactive — click to publish'}
                    >
                      {banner.isActive ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                    </button>
                    
                    <button
                      onClick={() => handleEdit(banner)}
                      className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all"
                      title="Edit Banner"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(banner._id, banner.title)}
                      className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                      title="Delete Banner"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannersTab;
