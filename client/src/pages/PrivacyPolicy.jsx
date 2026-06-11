import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, Mail, Phone, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

const lastUpdated = 'June 10, 2026';

const sections = [
  {
    id: 'information-we-collect',
    icon: Database,
    color: 'from-indigo-500 to-purple-600',
    lightBg: 'bg-indigo-50',
    lightText: 'text-indigo-600',
    title: '1. Information We Collect',
    content: [
      {
        subtitle: 'Account Information',
        text: 'When you create an account with MEHA Store, we collect your full name, email address, phone number, and password (stored in encrypted form). This information is necessary to identify you, process your pre-purchase requests, and communicate order updates.',
      },
      {
        subtitle: 'Pre-Purchase & Order Data',
        text: 'We collect details about the items you add to your pre-purchase list, quantities, preferred pickup times, and any notes you provide. This helps us reserve stock and prepare your order before you visit the store.',
      },
      {
        subtitle: 'Usage & Device Data',
        text: 'We automatically collect data about how you interact with our website, including pages visited, products viewed, session duration, browser type, operating system, and IP address. This data is used only for analytics and improving the website experience.',
      },
      {
        subtitle: 'Communication Data',
        text: 'If you contact us via email or phone, we retain the content of that communication to help resolve your queries and improve our service.',
      },
    ],
  },
  {
    id: 'how-we-use',
    icon: Eye,
    color: 'from-purple-500 to-pink-500',
    lightBg: 'bg-purple-50',
    lightText: 'text-purple-600',
    title: '2. How We Use Your Information',
    content: [
      {
        subtitle: 'Order Fulfillment',
        text: 'Your personal information is primarily used to process pre-purchase requests, reserve items, and notify you when your order is ready for in-store pickup. Without this data, we cannot provide our core service.',
      },
      {
        subtitle: 'Account Management',
        text: 'We use your credentials to authenticate your identity, maintain your account security, and allow you to view your order history and profile settings.',
      },
      {
        subtitle: 'Customer Support',
        text: 'When you reach out to us, we use your information to identify your account, understand your issue, and provide accurate assistance.',
      },
      {
        subtitle: 'Site Improvement & Analytics',
        text: 'Aggregated and anonymised usage data helps us understand which features are most popular, identify bugs, and guide product decisions. Individual user activity is never sold or shared with third-party advertisers.',
      },
      {
        subtitle: 'Legal Compliance',
        text: 'We may process your data where required by applicable law, court orders, or government authorities in India.',
      },
    ],
  },
  {
    id: 'data-storage',
    icon: Lock,
    color: 'from-teal-500 to-cyan-500',
    lightBg: 'bg-teal-50',
    lightText: 'text-teal-600',
    title: '3. Data Storage & Security',
    content: [
      {
        subtitle: 'Where Your Data Is Stored',
        text: 'Your data is stored on secure cloud servers. We take reasonable technical and organisational measures to protect your personal information from unauthorised access, loss, or disclosure.',
      },
      {
        subtitle: 'Password Security',
        text: 'Passwords are hashed using industry-standard bcrypt encryption and are never stored in plain text. Even our administrators cannot read your password.',
      },
      {
        subtitle: 'Data Retention',
        text: 'We retain your account data for as long as your account is active. If you request account deletion, we will erase your personal data within 30 days, except where retention is required by law.',
      },
      {
        subtitle: 'No Online Payment Data',
        text: 'MEHA Store does not collect, store, or process any payment card information. All purchases are completed in-store with cash or UPI at the point of pickup.',
      },
    ],
  },
  {
    id: 'sharing',
    icon: Shield,
    color: 'from-rose-500 to-orange-500',
    lightBg: 'bg-rose-50',
    lightText: 'text-rose-600',
    title: '4. Sharing Your Information',
    content: [
      {
        subtitle: 'We Do Not Sell Your Data',
        text: 'MEHA Store will never sell, rent, or trade your personal information to third parties for their marketing purposes.',
      },
      {
        subtitle: 'Service Providers',
        text: 'We may share limited data with trusted service providers (e.g., email/SMS notification services, web hosting providers) who assist us in operating our platform. These providers are contractually bound to use your data only for the services they provide to us.',
      },
      {
        subtitle: 'Legal Requirements',
        text: 'We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).',
      },
    ],
  },
  {
    id: 'your-rights',
    icon: Mail,
    color: 'from-amber-500 to-yellow-500',
    lightBg: 'bg-amber-50',
    lightText: 'text-amber-600',
    title: '5. Your Rights',
    content: [
      {
        subtitle: 'Access & Correction',
        text: 'You have the right to access the personal information we hold about you and to request corrections if any data is inaccurate or incomplete. You can update most information directly in your Profile page.',
      },
      {
        subtitle: 'Account Deletion',
        text: 'You may request the deletion of your account and all associated personal data by contacting us at the email below. We will process your request within 30 days.',
      },
      {
        subtitle: 'Opt-Out of Communications',
        text: 'You can opt out of promotional communications at any time by contacting us. Note that transactional messages (e.g., order confirmations) are necessary for the service and cannot be disabled.',
      },
      {
        subtitle: 'Data Portability',
        text: 'You may request a copy of your personal data in a commonly used, machine-readable format.',
      },
    ],
  },
  {
    id: 'cookies',
    icon: Database,
    color: 'from-sky-500 to-blue-600',
    lightBg: 'bg-sky-50',
    lightText: 'text-sky-600',
    title: '6. Cookies & Tracking',
    content: [
      {
        subtitle: 'Essential Cookies',
        text: 'We use strictly necessary cookies to keep you logged in and maintain your session. These cannot be disabled without affecting the functionality of the site.',
      },
      {
        subtitle: 'Analytics',
        text: 'We use Vercel Analytics and Speed Insights to understand how users navigate our site. These tools collect anonymised, aggregated data and do not track you personally across other websites.',
      },
      {
        subtitle: 'No Third-Party Ad Cookies',
        text: 'We do not use advertising cookies or allow third-party ad networks to track your activity on MEHA Store.',
      },
    ],
  },
];

const AccordionItem = ({ section }) => {
  const [open, setOpen] = useState(false);
  const Icon = section.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-6 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-sm flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="flex-1 text-lg font-bold text-gray-900">{section.title}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 bg-white border-t border-gray-50">
          <div className="space-y-5 pt-5">
            {section.content.map((item, i) => (
              <div key={i} className="flex gap-3">
                <span className={`mt-1 w-2 h-2 rounded-full bg-gradient-to-br ${section.color} flex-shrink-0`} />
                <div>
                  <p className="font-semibold text-gray-800 mb-1">{item.subtitle}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 to-white">
      {/* Hero Header */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#eef2ff_0%,_#ffffff_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-200 mb-8"
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
          >
            Privacy Policy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto"
          >
            At MEHA Store, your privacy matters deeply to us. This policy explains clearly what data we collect, why we collect it, and how we protect it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Last updated: {lastUpdated}
          </motion.div>
        </div>
      </section>

      {/* Intro Summary Cards */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Lock, label: 'No Payment Data', desc: 'We never store card or UPI details', color: 'text-teal-600', bg: 'bg-teal-50 border-teal-100' },
            { icon: Shield, label: 'Never Sold', desc: 'Your data is never sold to advertisers', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
            { icon: Eye, label: 'Full Control', desc: 'Access, correct, or delete your data anytime', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
          ].map(({ icon: Icon, label, desc, color, bg }) => (
            <div key={label} className={`rounded-2xl border p-5 ${bg} flex flex-col gap-2`}>
              <Icon className={`w-6 h-6 ${color}`} />
              <p className={`font-bold text-gray-900 text-sm`}>{label}</p>
              <p className="text-gray-500 text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Accordion Sections */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-4">
          {sections.map((section) => (
            <AccordionItem key={section.id} section={section} />
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-white shadow-xl shadow-indigo-200"
        >
          <h2 className="text-2xl font-extrabold mb-2">Questions about your privacy?</h2>
          <p className="text-indigo-100 mb-8 text-sm">
            If you have any concerns about how we handle your personal data, please reach out to us. We are committed to resolving any issues promptly.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            <a
              href="mailto:mehastorefancy@gmail.com"
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-4 transition-colors group"
            >
              <Mail className="w-6 h-6 text-indigo-200 group-hover:text-white transition-colors" />
              <div>
                <p className="text-xs text-indigo-200 font-medium uppercase tracking-wider">Email</p>
                <p className="text-sm font-semibold mt-0.5">mehastorefancy@gmail.com</p>
              </div>
            </a>
            <a
              href="tel:+91XXXXXXXXXX"
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-4 transition-colors group"
            >
              <Phone className="w-6 h-6 text-indigo-200 group-hover:text-white transition-colors" />
              <div>
                <p className="text-xs text-indigo-200 font-medium uppercase tracking-wider">Phone</p>
                <p className="text-sm font-semibold mt-0.5">+91 XXXXX XXXXX</p>
              </div>
            </a>
            <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-4">
              <MapPin className="w-6 h-6 text-indigo-200 flex-shrink-0" />
              <div>
                <p className="text-xs text-indigo-200 font-medium uppercase tracking-wider">Store</p>
                <p className="text-sm font-semibold mt-0.5">MEHA Store, India</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
