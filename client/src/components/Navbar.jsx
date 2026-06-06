import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShoppingBag, User, LogOut, Settings, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2.5">
              {/* Square icon mark — 40×40, always crisp */}
              <img
                src="/meha-icon.png"
                alt="MEHA"
                className="h-10 w-10 rounded-xl object-cover shadow-sm"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback gradient badge if image fails */}
              <span
                className="h-10 w-10 rounded-xl items-center justify-center text-white font-black text-lg shadow-sm"
                style={{ display: 'none', background: 'linear-gradient(135deg,#4F46E5,#7C3AED)' }}
              >
                M
              </span>
              {/* Brand text — always CSS, always sharp */}
              <span className="flex flex-col leading-none">
                <span className="font-black text-lg tracking-tight text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  MEHA
                </span>
                <span className="font-semibold text-xs tracking-widest uppercase text-indigo-600" style={{ fontFamily: 'Nunito Sans, sans-serif', letterSpacing: '0.15em' }}>
                  Store
                </span>
              </span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link to="/" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Home
              </Link>
              <Link to="/shop" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Shop
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role !== 'admin' && (
                  <Link to="/pre-purchase" className="text-gray-500 hover:text-indigo-600 transition-colors p-2 rounded-full relative" title="Pre-Purchase List">
                    <ShoppingBag className="h-5 w-5" />
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors px-2">
                    Admin
                  </Link>
                )}
                
                <div className="relative border-l border-gray-200 pl-4 ml-2" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 overflow-hidden border border-indigo-200">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                      {user.name?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <Link 
                        to="/profile" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                      >
                        <Settings className="mr-2 h-4 w-4" /> Profile Settings
                      </Link>
                      <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-full transition-colors">
                <User className="h-4 w-4" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
