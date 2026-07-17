import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const Hero: React.FC = () => {
  const {
    language,
    setView,
    setSelectedProductId,
    products,
    addToCart,
    homeGalleryBtnTextAf,
    homeGalleryBtnTextEn,
    isHomeGalleryBtnEnabled
  } = useApp();

  const featuredProduct = products.find(p => p.id === 'die-erfenis-themp') || products[0];
  const [selectedSize, setSelectedSize] = useState('M');
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!featuredProduct) return;
    addToCart(featuredProduct, 1, selectedSize, featuredProduct.colors[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleViewDetails = () => {
    if (!featuredProduct) return;
    setSelectedProductId(featuredProduct.id);
    setView('product-details');
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[calc(100vh-80px)]">
      {/* Left Pane - Brand Identity */}
      <div 
        className="w-full md:w-1/2 relative bg-[#1A1A1A] flex flex-col justify-between p-8 md:p-16 overflow-hidden"
        style={{
          backgroundImage: 'url(/src/assets/images/volksgrond_heritage_bg_1783548402167.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Decorative dark overlay to maintain superb readability of brand text and gold accents */}
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[0.5px] pointer-events-none" />
        
        {/* Decorative radial lighting effect */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none" 
          style={{
            background: 'radial-gradient(circle at center, #8B4513 0%, transparent 80%)',
          }}
        />
        
        {/* Subtle grid pattern texture on top of the image background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#C5A059 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="hidden md:block">
          <span className="text-[9px] uppercase tracking-[0.35em] text-[#C5A059] font-black">
            EST. 2019 • SOUTH AFRICA
          </span>
        </div>

        {/* Dynamic Display Typography */}
        <div className="z-10 my-auto text-center md:text-left py-12 md:py-0">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-[90px] font-black text-white leading-none tracking-tighter uppercase mb-6"
          >
            {language === 'af' ? (
              <>
                KWALITEIT<br />
                <span className="text-[#C5A059]">ERFENIS</span>
              </>
            ) : (
              <>
                QUALITY<br />
                <span className="text-[#C5A059]">HERITAGE</span>
              </>
            )}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-[#F5F2ED] uppercase tracking-[0.25em] text-xs max-w-md mx-auto md:mx-0 font-medium"
          >
            {language === 'af' 
              ? 'Geïnspireer deur die Suid-Afrikaanse bodem' 
              : 'Inspired by South African soil'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start"
          >
            <button
              onClick={() => setView('shop')}
              className="bg-[#C5A059] hover:bg-[#b08b47] text-[#1A1A1A] font-bold text-[10px] uppercase tracking-widest px-8 py-3.5 rounded shadow-lg transition-all cursor-pointer"
            >
              {language === 'af' ? 'Ontdek Winkel' : 'Explore Shop'}
            </button>
            <button
              onClick={() => setView('about')}
              className="border border-[#E0DBCF] hover:bg-white/10 text-white font-bold text-[10px] uppercase tracking-widest px-8 py-3.5 rounded transition-all cursor-pointer"
            >
              {language === 'af' ? 'Ons Storie' : 'Our Story'}
            </button>
          </motion.div>

          {/* Dynamic Gallery Announcement / Gateway Box */}
          {isHomeGalleryBtnEnabled && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mt-8 z-10 max-w-md w-full"
            >
              <button
                onClick={() => setView('gallery-links')}
                className="w-full text-left bg-black/40 hover:bg-[#8B4513]/20 border border-[#C5A059]/40 hover:border-[#C5A059] p-4 rounded shadow-xl transition-all duration-300 group/ann cursor-pointer flex items-center justify-between space-x-4 text-white"
                id="btn-home-gallery-announcement"
              >
                <div className="flex-1 space-y-1">
                  <span className="text-[8px] tracking-[0.25em] font-black text-[#C5A059] uppercase block animate-pulse">
                    ★ {language === 'af' ? 'GELEENTHEID & SKAKELS' : 'OCCASIONS & LINKS'}
                  </span>
                  <p className="text-xs font-black uppercase tracking-wider group-hover/ann:text-[#C5A059] transition-colors leading-relaxed">
                    {language === 'af' ? homeGalleryBtnTextAf : homeGalleryBtnTextEn}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full border border-[#C5A059]/20 group-hover/ann:border-[#C5A059] flex items-center justify-center text-[#C5A059] transition-colors shrink-0">
                  <ArrowRight size={14} className="group-hover/ann:translate-x-0.5 transition-transform" />
                </div>
              </button>
            </motion.div>
          )}
        </div>

        {/* Footer info in left pane */}
        <div className="z-10 flex items-center justify-between border-t border-white/10 pt-4 opacity-55">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-[1px] bg-white"></div>
            <span className="text-white text-[9px] tracking-widest uppercase italic">
              {language === 'af' ? 'Volkspore Kinderslyn beskikbaar' : 'Volkspore Kids line available'}
            </span>
          </div>
        </div>
      </div>

      {/* Right Pane - Highlighted Product Card */}
      <div className="w-full md:w-1/2 flex flex-col p-8 lg:p-16 justify-center bg-white border-t md:border-t-0 md:border-l border-[#E0DBCF]">
        {featuredProduct ? (
          <div className="max-w-md mx-auto w-full">
            <span className="text-[9px] uppercase tracking-[0.2em] font-black text-[#8B4513] mb-2 block">
              {language === 'af' ? 'Gewilde Topverkoper' : 'Trending Bestseller'}
            </span>
            
            <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight mb-4 text-[#1A1A1A]">
              {language === 'af' ? featuredProduct.name.af : featuredProduct.name.en}
            </h2>

            {/* Product image with quick hover preview */}
            <div 
              onClick={handleViewDetails}
              className="relative aspect-square w-full bg-[#F5F2ED] border border-[#E0DBCF] overflow-hidden rounded mb-6 cursor-pointer group"
            >
              <img
                src={featuredProduct.images[0]}
                alt={featuredProduct.name.af}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-white/90 text-[#1A1A1A] font-bold text-[10px] uppercase tracking-widest px-4 py-2 shadow-md">
                  {language === 'af' ? 'Sien Volle Besonderhede' : 'View Full Details'}
                </span>
              </div>
            </div>

            <div className="flex items-baseline space-x-3 mb-6">
              <span className="text-2xl lg:text-3xl font-light text-[#1A1A1A]">
                R{featuredProduct.price.toFixed(2)}
              </span>
              {featuredProduct.originalPrice && (
                <span className="text-sm line-through text-gray-400">
                  R{featuredProduct.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-[10px] bg-[#E0DBCF]/60 text-[#8B4513] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                {language === 'af' ? 'BTW INGESLUIT' : 'VAT INCLUDED'}
              </span>
            </div>

            <p className="text-xs leading-relaxed text-gray-500 mb-6 italic">
              {language === 'af' ? featuredProduct.description.af : featuredProduct.description.en}
            </p>

            {/* Size Selector */}
            <div className="mb-6">
              <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2.5 block">
                {language === 'af' ? 'Kies Grootte' : 'Select Size'}
              </label>
              <div className="flex flex-wrap gap-2">
                {featuredProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-11 h-11 border text-xs font-black transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                        : 'border-[#E0DBCF] hover:border-[#1A1A1A] hover:bg-gray-50 text-[#1A1A1A]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Add To Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 uppercase text-xs font-black tracking-[0.2em] shadow-lg transition-all cursor-pointer ${
                added 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-[#1A1A1A] hover:bg-[#333] text-white'
              }`}
            >
              {added ? (
                <span className="flex items-center justify-center space-x-2">
                  <Check size={14} />
                  <span>{language === 'af' ? 'Bygevoeg tot Mandjie' : 'Added to Cart'}</span>
                </span>
              ) : (
                <span>{language === 'af' ? 'Voeg by Mandjie' : 'Add to Cart'}</span>
              )}
            </button>

            {/* Social Trust Badges */}
            <div className="flex items-center justify-between text-[9px] text-gray-400 uppercase tracking-widest font-black px-2 mt-4">
              <div className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                {language === 'af' ? 'Beperkte Voorraad' : 'Limited Stock'}
              </div>
              <div className="flex items-center space-x-1">
                <ShieldCheck size={12} className="text-[#8B4513]" />
                <span>{language === 'af' ? 'Veilige Suid-Afrikaanse Betalings' : 'Secure South African Payments'}</span>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">Loading featured product...</div>
        )}
      </div>
    </div>
  );
};
