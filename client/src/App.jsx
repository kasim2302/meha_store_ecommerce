import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrePurchaseProvider } from './context/PrePurchaseContext';
import { ToastProvider } from './context/ToastContext';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import PrePurchaseList from './pages/PrePurchaseList';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';


function App() {
  return (
    <>
    <Analytics/>
    <SpeedInsights/>
    <ToastProvider>
      <AuthProvider>
        <PrePurchaseProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/pre-purchase" element={<PrePurchaseList />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </PrePurchaseProvider>
      </AuthProvider>
    </ToastProvider>
    </>
  );
}

export default App;
