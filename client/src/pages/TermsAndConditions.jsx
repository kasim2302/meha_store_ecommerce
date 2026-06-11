import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, ShoppingBag, Ban, AlertTriangle, Scale,
  RefreshCw, Globe, Mail, Phone, MapPin, ChevronDown, ChevronUp, CheckCircle
} from 'lucide-react';

const lastUpdated = 'June 10, 2026';

const terms = [
  {
    id: 'acceptance',
    icon: CheckCircle,
    color: 'from-indigo-500 to-purple-600',
    title: '1. Acceptance of Terms',
    content: [
      {
        subtitle: 'Agreement to Terms',
        text: 'By accessing or using the MEHA Store website (mehastore.com or any associated domain), you confirm that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our website or services.',
      },
      {
        subtitle: 'Eligibility',
        text: 'You must be at least 13 years old to use this website. If you are under 18, you confirm that you have obtained consent from a parent or legal guardian. By registering an account, you represent that the information you provide is accurate and complete.',
      },
      {
        subtitle: 'Changes to Terms',
        text: 'We reserve the right to update these terms at any time. We will notify users of material changes by updating the "Last Updated" date. Continued use of the site after any changes constitutes your acceptance of the new terms.',
      },
    ],
  },
  {
    id: 'services',
    icon: ShoppingBag,
    color: 'from-purple-500 to-pink-500',
    title: '2. Our Services',
    content: [
      {
        subtitle: 'Pre-Purchase Reservations',
        text: 'MEHA Store offers an online pre-purchase service that allows you to browse our product catalog, add items to a pre-purchase list, and reserve them for in-store pickup. This service is provided free of charge.',
      },
      {
        subtitle: 'No Online Payment',
        text: 'MEHA Store does not process online payments. All transactions are completed in-store at the time of pickup. A pre-purchase reservation is not a confirmed sale and does not constitute a binding purchase agreement until in-store payment is made.',
      },
      {
        subtitle: 'Product Availability',
        text: 'We make every effort to display accurate stock levels. However, inventory can change rapidly. We do not guarantee that items added to your pre-purchase list will always be available. We will notify you as soon as possible if a reserved item is out of stock.',
      },
      {
        subtitle: 'Reservation Period',
        text: 'Pre-purchased items are held for a reasonable period as communicated at the time of reservation. If you do not collect your items within this period, the reservation may be cancelled without notice and the items returned to general stock.',
      },
    ],
  },
  {
    id: 'user-accounts',
    icon: FileText,
    color: 'from-teal-500 to-cyan-500',
    title: '3. User Accounts',
    content: [
      {
        subtitle: 'Account Security',
        text: 'You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You must notify us immediately at mehastorefancy@gmail.com if you suspect any unauthorised access.',
      },
      {
        subtitle: 'Accurate Information',
        text: 'You agree to provide accurate, current, and complete information when registering. Providing false information (including another person\'s phone number or email) is prohibited and may result in account suspension.',
      },
      {
        subtitle: 'Account Termination',
        text: 'We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or cause harm to other users or MEHA Store. You may also delete your own account at any time by contacting us.',
      },
    ],
  },
  {
    id: 'prohibited',
    icon: Ban,
    color: 'from-rose-500 to-red-500',
    title: '4. Prohibited Conduct',
    content: [
      {
        subtitle: 'You agree not to:',
        text: 'Use the website for any unlawful purpose or in violation of any applicable regulations. Attempt to gain unauthorised access to any part of the website, servers, or databases. Transmit any viruses, malware, or harmful code. Scrape, crawl, or automatically collect data from the website without prior written permission. Impersonate any person or entity, or falsely represent your affiliation with any person or entity. Place fraudulent or speculative pre-purchase orders with no intention to collect.',
      },
      {
        subtitle: 'Content Standards',
        text: 'If you submit reviews, comments, or any other user-generated content, it must be accurate, not defamatory, and must not infringe any third-party rights. We reserve the right to remove content that violates these standards.',
      },
    ],
  },
  {
    id: 'intellectual-property',
    icon: Globe,
    color: 'from-amber-500 to-orange-500',
    title: '5. Intellectual Property',
    content: [
      {
        subtitle: 'Ownership',
        text: 'All content on the MEHA Store website — including text, graphics, logos, product photographs, and software — is owned by or licensed to MEHA Store and is protected by applicable intellectual property laws.',
      },
      {
        subtitle: 'Limited License',
        text: 'You are granted a limited, non-exclusive, non-transferable license to access and use the website for personal, non-commercial purposes. You may not reproduce, distribute, modify, or create derivative works from any content without our express written permission.',
      },
      {
        subtitle: 'Feedback',
        text: 'Any suggestions, ideas, or feedback you submit to us may be used by MEHA Store without obligation of compensation, confidentiality, or attribution to you.',
      },
    ],
  },
  {
    id: 'liability',
    icon: AlertTriangle,
    color: 'from-sky-500 to-blue-600',
    title: '6. Limitation of Liability',
    content: [
      {
        subtitle: 'No Warranties',
        text: 'The MEHA Store website and its services are provided on an "as is" and "as available" basis. We make no warranties, express or implied, regarding the reliability, accuracy, or availability of the website.',
      },
      {
        subtitle: 'Limitation',
        text: 'To the maximum extent permitted by applicable law, MEHA Store shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of or inability to use the website, including loss of data or unrealised pre-purchase reservations.',
      },
      {
        subtitle: 'Third-Party Links',
        text: 'Our website may contain links to external websites. We are not responsible for the content, privacy practices, or accuracy of any third-party sites. Visiting external links is at your own risk.',
      },
    ],
  },
  {
    id: 'governing-law',
    icon: Scale,
    color: 'from-violet-500 to-indigo-600',
    title: '7. Governing Law & Disputes',
    content: [
      {
        subtitle: 'Governing Law',
        text: 'These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from or related to these terms shall be subject to the exclusive jurisdiction of the courts in India.',
      },
      {
        subtitle: 'Informal Resolution',
        text: 'Before pursuing formal legal action, we encourage you to contact us first at mehastorefancy@gmail.com. We are committed to resolving disputes informally and promptly.',
      },
    ],
  },
  {
    id: 'modifications',
    icon: RefreshCw,
    color: 'from-emerald-500 to-green-600',
    title: '8. Modifications to Services',
    content: [
      {
        subtitle: 'Service Changes',
        text: 'MEHA Store reserves the right to modify, suspend, or discontinue any part of the website or its services at any time without prior notice. We will endeavour to provide notice of significant changes where possible.',
      },
      {
        subtitle: 'Price Changes',
        text: 'Product prices displayed online are indicative and may differ from in-store prices. The final price payable is the price at the time of in-store pickup as displayed on the product tag.',
      },
    ],
  },
];

const AccordionItem = ({ term }) => {
  const [open, setOpen] = useState(false);
  const Icon = term.icon;

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
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${term.color} flex items-center justify-center shadow-sm flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="flex-1 text-lg font-bold text-gray-900">{term.title}</span>
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
            {term.content.map((item, i) => (
              <div key={i} className="flex gap-3">
                <span className={`mt-1 w-2 h-2 rounded-full bg-gradient-to-br ${term.color} flex-shrink-0`} />
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

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/60 to-white">
      {/* Hero Header */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#f3f0ff_0%,_#ffffff_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-xl shadow-violet-200 mb-8"
          >
            <Scale className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
          >
            Terms & Conditions
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto"
          >
            Please read these terms carefully before using MEHA Store. They govern your use of our website and pre-purchase services.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            Last updated: {lastUpdated}
          </motion.div>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: ShoppingBag, label: 'Free Reservations', desc: 'No charge to pre-purchase; pay at pickup', color: 'text-violet-600', bg: 'bg-violet-50 border-violet-100' },
            { icon: Ban, label: 'No Misuse', desc: 'Fair use policy applies to all users', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' },
            { icon: Scale, label: 'Indian Law Applies', desc: 'Governed by laws of India', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
          ].map(({ icon: Icon, label, desc, color, bg }) => (
            <div key={label} className={`rounded-2xl border p-5 ${bg} flex flex-col gap-2`}>
              <Icon className={`w-6 h-6 ${color}`} />
              <p className="font-bold text-gray-900 text-sm">{label}</p>
              <p className="text-gray-500 text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Accordion Sections */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-4">
          {terms.map((term) => (
            <AccordionItem key={term.id} term={term} />
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 p-8 text-white shadow-xl shadow-violet-200"
        >
          <h2 className="text-2xl font-extrabold mb-2">Have a question about these terms?</h2>
          <p className="text-violet-100 mb-8 text-sm">
            If any part of these terms is unclear, or if you have questions about how they apply to you, don't hesitate to contact us.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            <a
              href="mailto:mehastorefancy@gmail.com"
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-4 transition-colors group"
            >
              <Mail className="w-6 h-6 text-violet-200 group-hover:text-white transition-colors" />
              <div>
                <p className="text-xs text-violet-200 font-medium uppercase tracking-wider">Email</p>
                <p className="text-sm font-semibold mt-0.5">mehastorefancy@gmail.com</p>
              </div>
            </a>
            <a
              href="tel:+91XXXXXXXXXX"
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-4 transition-colors group"
            >
              <Phone className="w-6 h-6 text-violet-200 group-hover:text-white transition-colors" />
              <div>
                <p className="text-xs text-violet-200 font-medium uppercase tracking-wider">Phone</p>
                <p className="text-sm font-semibold mt-0.5">+91 XXXXX XXXXX</p>
              </div>
            </a>
            <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-4">
              <MapPin className="w-6 h-6 text-violet-200 flex-shrink-0" />
              <div>
                <p className="text-xs text-violet-200 font-medium uppercase tracking-wider">Store</p>
                <p className="text-sm font-semibold mt-0.5">MEHA Store, India</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default TermsAndConditions;
