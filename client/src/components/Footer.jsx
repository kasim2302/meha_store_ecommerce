import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start">
          <span className="font-bold text-xl tracking-tight text-gray-900">MEHA Store</span>
          <p className="text-sm text-gray-500 mt-2">Premium collections for everyone.</p>
        </div>
        <div className="flex gap-8 text-sm text-gray-500">
          <a href="#" className="hover:text-gray-900 transition-colors">About Us</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
        </div>
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} MEHA Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
