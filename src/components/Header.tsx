import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Heart, Menu, X, ShieldAlert, Lock, Ruler } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    view,
    setView,
    cart,
    wishlist,
    isUnlocked,
    setIsUnlocked,
    isPasswordEnabled,
    setGlobalSizeGuideOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { key: 'home', af: 'Tuiste', en: 'Home' },
    { key: 'shop', af: 'Winkel', en: 'Shop' },
    { key: 'track-order', af: 'Volg Bestelling', en: 'Track Order' },
    { key: 'about', af: 'Ons Storie', en: 'Our Story' },
    { key: 'contact', af: 'Kontak', en: 'Contact' }
  ] as const;

  const handleNav = (targetView: typeof view) => {
    setView(targetView);
    setMobileMenuOpen(false);
  };

  const handleAdminClick = () => {
    if (view === 'admin' && isUnlocked && isPasswordEnabled) {
      setIsUnlocked(false);
      setView('home');
    } else {
      handleNav('admin');
    }
  };

  return (
    <header className="sticky top-0 flex items-center justify-between px-6 md:px-12 py-5 border-b border-[#E0DBCF] bg-[#F5F2ED] z-50 shadow-sm">
      {/* Brand Logo & Navigation */}
      <div className="flex items-center space-x-10">
        <div 
          onClick={() => handleNav('home')} 
          className="cursor-pointer select-none flex flex-col items-start"
          id="header-logo-container"
        >
          <span className="text-xl md:text-2xl font-black tracking-tighter uppercase text-[#1A1A1A]">
            VOLKSGROND
          </span>
          <span className="text-[8px] tracking-[0.25em] font-bold uppercase text-[#8B4513] -mt-1">
            {language === 'af' ? 'OORSPRONKLIKE DRAG' : 'ORIGINAL APPAREL'}
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 text-[11px] uppercase tracking-widest font-bold opacity-80">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNav(item.key as any)}
              className={`hover:text-[#8B4513] transition-colors cursor-pointer relative py-2 ${
                view === item.key ? 'text-[#8B4513]' : 'text-[#1A1A1A]'
              }`}
            >
              {language === 'af' ? item.af : item.en}
              {view === item.key && (
                <motion.div 
                  layoutId="activeNavLine" 
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8B4513]" 
                />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Header Actions */}
      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Interactive Size Guide Button for quick access */}
        <button
          onClick={() => setGlobalSizeGuideOpen(true)}
          className="flex items-center space-x-1.5 border border-[#8B4513]/20 hover:border-[#8B4513] hover:bg-[#8B4513]/5 rounded px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#8B4513] transition-all cursor-pointer bg-white"
          title={language === 'af' ? 'Interaktiewe Groottegids' : 'Interactive Size Guide'}
        >
          <Ruler size={11} />
          <span>{language === 'af' ? 'Groottegids' : 'Size Guide'}</span>
        </button>

        {/* Persistent Language Switcher */}
        <div className="flex items-center bg-[#E0DBCF] p-0.5 rounded-full text-[10px] font-bold px-1.5 shadow-inner">
          <button
            onClick={() => setLanguage('af')}
            className={`px-2 py-1 rounded-full transition-all cursor-pointer ${
              language === 'af' ? 'bg-[#1A1A1A] text-white shadow' : 'text-[#1A1A1A] opacity-50'
            }`}
          >
            AF
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 rounded-full transition-all cursor-pointer ${
              language === 'en' ? 'bg-[#1A1A1A] text-white shadow' : 'text-[#1A1A1A] opacity-50'
            }`}
          >
            EN
          </button>
        </div>

        {/* Wishlist Icon */}
        <button
          onClick={() => handleNav('shop')}
          className="relative text-[#1A1A1A] hover:text-[#8B4513] transition-colors cursor-pointer hidden sm:block"
          title={language === 'af' ? 'Gunstelinge' : 'Wishlist'}
        >
          <Heart size={18} fill={wishlist.length > 0 ? '#8B4513' : 'none'} stroke={wishlist.length > 0 ? '#8B4513' : 'currentColor'} />
          {wishlist.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#8B4513] text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
              {wishlist.length}
            </span>
          )}
        </button>

        {/* Cart Trigger */}
        <button
          onClick={() => handleNav('cart')}
          className="relative text-[#1A1A1A] hover:text-[#8B4513] transition-colors cursor-pointer"
          title={language === 'af' ? 'Winkelmandjie' : 'Cart'}
          id="cart-header-btn"
        >
          <ShoppingBag size={18} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#8B4513] text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold shadow animate-pulse">
              {cartCount}
            </span>
          )}
        </button>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#1A1A1A] hover:text-[#8B4513] transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-[#F5F2ED] border-b border-[#E0DBCF] px-6 py-6 flex flex-col space-y-4 md:hidden z-40 shadow-lg"
          >
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNav(item.key as any)}
                className={`text-left text-xs uppercase tracking-widest font-bold py-2 ${
                  view === item.key ? 'text-[#8B4513] pl-2 border-l-2 border-[#8B4513]' : 'text-[#1A1A1A]'
                }`}
              >
                {language === 'af' ? item.af : item.en}
              </button>
            ))}

          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
