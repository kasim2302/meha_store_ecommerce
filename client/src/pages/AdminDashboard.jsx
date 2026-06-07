import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Package, Tag, Users, ShoppingCart, Upload, Megaphone } from 'lucide-react';
import AnalyticsTab from '../components/admin/AnalyticsTab';
import ProductManagementTab from '../components/admin/ProductManagementTab';
import CategoryManagementTab from '../components/admin/CategoryManagementTab';
import UserManagementTab from '../components/admin/UserManagementTab';
import ReservationsTab from '../components/admin/ReservationsTab';
import BulkUploadTab from '../components/admin/BulkUploadTab';
import BannersTab from '../components/admin/BannersTab';

const tabs = [
  { id: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'products',     label: 'Products',     icon: Package },
  { id: 'categories',  label: 'Categories',   icon: Tag },
  { id: 'users',       label: 'Users',        icon: Users },
  { id: 'reservations',label: 'Reservations', icon: ShoppingCart },
  { id: 'bulkupload',   label: 'Bulk Upload',  icon: Upload },
  { id: 'banners',      label: 'Banners',      icon: Megaphone },
];

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':    return <AnalyticsTab />;
      case 'products':     return <ProductManagementTab />;
      case 'categories':  return <CategoryManagementTab />;
      case 'users':       return <UserManagementTab />;
      case 'reservations':return <ReservationsTab />;
      case 'bulkupload':   return <BulkUploadTab />;
      case 'banners':      return <BannersTab />;
      default:            return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your store from one place.</p>
      </div>

      {/* Sidebar + Content layout */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <nav className="flex md:flex-col gap-2 md:w-56 flex-shrink-0 overflow-x-auto pb-2 md:pb-0">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all whitespace-nowrap
                ${activeTab === id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {renderTab()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
