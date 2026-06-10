import React from 'react';
import { motion } from 'framer-motion';
import { Store, Heart, Package, Star, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const values = [
  { icon: Heart,    title: 'Curated with Love',   desc: 'Every item in our store is hand-picked for quality and value.' },
  { icon: Star,     title: 'Premium Quality',      desc: 'We source only the best toys, cosmetics, and gifts at fair prices.' },
  { icon: Users,    title: 'Community First',      desc: 'We serve our local community with pride and personal attention.' },
  { icon: Package,  title: 'Easy Pre-Purchase',    desc: 'Reserve your items online and pay only when you pick them up.' },
];

const categories = [
  { name: 'Toys & Games',         emoji: '🧸' },
  { name: 'Cosmetics & Beauty',   emoji: '💄' },
  { name: 'Gifts & Wrapping',     emoji: '🎁' },
  { name: 'Stationery',           emoji: '📚' },
  { name: 'Fancy Items',          emoji: '✨' },
  { name: 'Covering Jewellers',   emoji: '💎' },
];

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_bottom_right,_white_0%,_transparent_60%)]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm mb-8 shadow-xl"
          >
            <Store className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-4"
          >
            About MEHA Store
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-indigo-100 max-w-2xl mx-auto"
          >
            A neighbourhood treasure — bringing premium toys, cosmetics, gifts, and more to your doorstep through our unique pre-purchase system.
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-indigo-600 font-bold text-sm uppercase tracking-widest">Our Story</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-3 mb-5">Born from a love of curated collections</h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              MEHA Store started as a small local shop with a simple mission — to offer the community a carefully curated selection of everyday essentials at fair prices. From playful toys that spark imagination to elegant jewellery and beauty essentials, every shelf tells a story.
            </p>
            <p className="text-gray-500 leading-relaxed mb-4">
              As the city moved online, we moved with it. Our pre-purchase system was born from listening to our customers: they wanted to browse at home but preferred paying in person. So we built exactly that — reserve online, pay and pick up in store.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Today, MEHA Store combines the convenience of e-commerce with the warmth of a local shop — and we're just getting started.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl overflow-hidden shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="MEHA Store"
              className="w-full h-72 md:h-96 object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900">What We Stand For</h2>
            <p className="text-gray-500 mt-3">Our core values guide every product we pick and every customer we serve.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-gray-500 text-sm">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">What We Offer</h2>
          <p className="text-gray-500 mt-3">Six handpicked categories — something for everyone.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {categories.map(({ name, emoji }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
              className="flex items-center gap-3 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-4"
            >
              <span className="text-3xl">{emoji}</span>
              <span className="font-semibold text-gray-800 text-sm">{name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 p-10 text-center text-white shadow-xl shadow-indigo-200"
        >
          <h2 className="text-2xl font-extrabold mb-3">Ready to explore our collection?</h2>
          <p className="text-indigo-100 mb-8">Browse our full catalog and pre-purchase your favourites today.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-full hover:bg-indigo-50 transition-colors shadow-lg"
          >
            Shop Now <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
