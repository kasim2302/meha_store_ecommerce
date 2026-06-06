import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, ShoppingBag, Package, ChevronLeft, ChevronRight } from 'lucide-react';

// ── Carousel slides ──────────────────────────────────────────
const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    badge: '🎁 New Arrivals',
    title: 'Gifts for Every Occasion',
    subtitle: 'Find the perfect present for your loved ones.',
    accent: 'from-pink-500 to-rose-500',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    badge: '✨ Trending',
    title: 'Premium Cosmetics',
    subtitle: 'Beauty essentials curated just for you.',
    accent: 'from-purple-500 to-indigo-500',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    badge: '🧸 Kids Love It',
    title: 'Fun Toys & Games',
    subtitle: 'Spark joy with our playful toy collection.',
    accent: 'from-yellow-400 to-orange-500',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    badge: '💎 Exclusive',
    title: 'Covering Jewellers',
    subtitle: 'Elegant imitation jewelry at unbeatable prices.',
    accent: 'from-amber-400 to-yellow-500',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    badge: '📚 Back to School',
    title: 'Stationery Essentials',
    subtitle: 'Everything you need to study and create.',
    accent: 'from-teal-400 to-cyan-500',
  },
];

// ── Category grid ────────────────────────────────────────────
const categories = [
  { name: 'Toys',               image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { name: 'Cosmetics',          image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { name: 'Stationaries',       image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { name: 'Gifts',              image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { name: 'Fancy',              image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { name: 'Covering Jewellers', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
];

// ── Image Carousel Component ─────────────────────────────────
const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev

  const goTo = useCallback((index, dir) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length, 1);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, -1);
  }, [current, goTo]);

  // Auto-play every 4 seconds
  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-indigo-200/50 select-none">
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          {/* Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Slide content */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3 bg-gradient-to-r ${slide.accent}`}
            >
              {slide.badge}
            </motion.span>
            <motion.h3
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-extrabold text-white mb-1 drop-shadow"
            >
              {slide.title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-sm"
            >
              {slide.subtitle}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center hover:bg-white/40 transition-all"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center hover:bg-white/40 transition-all"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 right-8 z-20 flex items-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-6 h-2 bg-white'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 z-20 bg-white/10">
        <motion.div
          key={current}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 4, ease: 'linear' }}
          className={`h-full bg-gradient-to-r ${slide.accent}`}
        />
      </div>
    </div>
  );
};

// ── Main Home Page ───────────────────────────────────────────
const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Hero Section: Text LEFT + Carousel RIGHT ── */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,_#eef2ff_0%,_#ffffff_60%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left — Text content */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                Now open · MEHA Store
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight mb-6"
              >
                Curated items for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  everyday moments.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg text-gray-500 mb-8 max-w-lg mx-auto lg:mx-0"
              >
                Discover our premium selection of toys, cosmetics, and accessories.
                Pre-select online, pick up in-store with ease.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-wrap gap-4 justify-center lg:justify-start"
              >
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5"
                >
                  Start Browsing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/pre-purchase"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-all hover:-translate-y-0.5"
                >
                  Pre-Purchase List
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="mt-10 flex flex-wrap items-center gap-6 justify-center lg:justify-start text-sm text-gray-400"
              >
                <span className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> Free in-store pickup</span>
                <span className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> No online payment</span>
                <span className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> Items reserved for you</span>
              </motion.div>
            </div>

            {/* Right — Carousel */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 w-full lg:w-auto"
              style={{ height: '520px', maxWidth: '560px', marginInline: 'auto' }}
            >
              <HeroCarousel />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Categories Section ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
            <p className="mt-3 text-gray-500">Explore our diverse collections tailored just for you.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Link
                  to={`/shop?category=${encodeURIComponent(category.name)}`}
                  className="group relative block rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-lg font-bold text-white mb-1">{category.name}</h3>
                    <p className="text-white/80 text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300">
                      Explore <ArrowRight className="h-4 w-4" />
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How Pre-Purchase Works</h2>
          <p className="text-gray-500 mb-16 max-w-xl mx-auto">Reserve your favourite items online and pick them up at MEHA Store — no payment needed upfront.</p>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Star,        step: '1', title: 'Browse & Select',     desc: 'Find the items you love from our online catalog and add them to your pre-purchase list.' },
              { icon: ShoppingBag, step: '2', title: 'Reserve Items',       desc: 'Submit your pre-purchase request. We will set aside the stock just for you.' },
              { icon: Package,     step: '3', title: 'Pick Up In-Store',    desc: 'Visit MEHA Store, pay for your reserved items, and take them home instantly.' },
            ].map(({ icon: Icon, step, title, desc }) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-6">
                  <Icon className="h-8 w-8" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white rounded-full text-xs font-bold flex items-center justify-center">{step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-gray-500 max-w-xs">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
