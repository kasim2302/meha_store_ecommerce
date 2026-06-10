import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Scale, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Main footer body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <span className="font-extrabold text-2xl tracking-tight text-white">MEHA Store</span>
            <p className="text-sm text-gray-400 mt-3 leading-relaxed max-w-xs">
              Your one-stop shop for toys, cosmetics, gifts, stationery, and jewellery. Browse online, reserve, and pick up in-store.
            </p>
            <div className="mt-5 flex flex-col gap-2 text-sm">
              <a href="mailto:mehastore@gmail.com" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4" /> mehastore@gmail.com
              </a>
              <a href="tel:+91XXXXXXXXXX" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Phone className="w-4 h-4" /> +91 XXXXX XXXXX
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</p>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Home', to: '/' },
                { label: 'Shop', to: '/shop' },
                { label: 'Pre-Purchase List', to: '/pre-purchase' },
                { label: 'My Orders', to: '/my-orders' },
                { label: 'Profile', to: '/profile' },
                { label: 'About Us', to: '/about' },
                { label: 'Contact', to: '/contact' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-gray-400 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/privacy-policy"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                  <Shield className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                  <Scale className="w-4 h-4 text-violet-400 group-hover:text-violet-300 transition-colors" />
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
            <div className="mt-6 p-4 rounded-xl bg-gray-800 border border-gray-700 text-xs text-gray-500 leading-relaxed">
              By using our website, you agree to our{' '}
              <Link to="/terms" className="text-violet-400 hover:underline">Terms</Link>{' '}and{' '}
              <Link to="/privacy-policy" className="text-indigo-400 hover:underline">Privacy Policy</Link>.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} MEHA Store. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
