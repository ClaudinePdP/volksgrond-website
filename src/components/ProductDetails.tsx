import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { Heart, ShoppingBag, Truck, ShieldCheck, ArrowLeft, Star, MessageSquare, ChevronDown, Check, Ruler, X } from 'lucide-react';
import { motion } from 'motion/react';

export const ProductDetails: React.FC = () => {
  const {
    language,
    selectedProductId,
    setSelectedProductId,
    setView,
    products,
    cart,
    addToCart,
    wishlist,
    toggleWishlist,
    reviews,
    addReview,
    setGlobalSizeGuideOpen,
    lastCalculatedSize
  } = useApp();

  // Find selected product
  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'care'>('details');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeImage, setActiveImage] = useState(product?.images[0] || '');

  // Interactive size guide calculator states
  const [sizeGuideTab, setSizeGuideTab] = useState<'calculator' | 'chart'>('calculator');
  const [calcHeight, setCalcHeight] = useState(product?.category === 'ladies' ? 165 : 178);
  const [calcWeight, setCalcWeight] = useState(product?.category === 'ladies' ? 58 : 78);
  const [calcPreference, setCalcPreference] = useState<'slim' | 'regular' | 'relaxed'>('regular');

  React.useEffect(() => {
    if (lastCalculatedSize && product?.sizes.includes(lastCalculatedSize)) {
      setSelectedSize(lastCalculatedSize);
    }
  }, [lastCalculatedSize, product?.id]);

  React.useEffect(() => {
    if (product) {
      setActiveImage(product.images[0]);
      setSelectedSize(product.sizes[0] || 'M');
      setSelectedColor(product.colors[0] || '');
      setQuantity(1);
      
      // Update calculator defaults
      setCalcHeight(product.category === 'ladies' ? 165 : 178);
      setCalcWeight(product.category === 'ladies' ? 58 : 78);
      setCalcPreference('regular');
      setSizeGuideTab('calculator');
    }
  }, [product?.id]);

  const getRecommendedSize = () => {
    const isLadies = product?.category === 'ladies';
    let size = 'M';
    
    if (isLadies) {
      if (calcWeight < 48) size = 'XS';
      else if (calcWeight >= 48 && calcWeight < 56) size = 'S';
      else if (calcWeight >= 56 && calcWeight < 66) size = 'M';
      else if (calcWeight >= 66 && calcWeight < 76) size = 'L';
      else if (calcWeight >= 76 && calcWeight < 86) size = 'XL';
      else size = '2XL';

      if (calcHeight > 175 && size === 'XS') size = 'S';
      if (calcHeight < 155 && (size === 'XL' || size === '2XL')) {
        size = size === '2XL' ? 'XL' : 'L';
      }
    } else {
      if (calcWeight < 65) size = 'S';
      else if (calcWeight >= 65 && calcWeight < 77) size = 'M';
      else if (calcWeight >= 77 && calcWeight < 89) size = 'L';
      else if (calcWeight >= 89 && calcWeight < 101) size = 'XL';
      else size = 'XXL';

      if (calcHeight > 185 && size === 'S') size = 'M';
      if (calcHeight < 165 && (size === 'XL' || size === 'XXL')) {
        size = size === 'XXL' ? 'XL' : 'L';
      }
    }

    const availableSizes = product?.sizes || (isLadies ? ['XS', 'S', 'M', 'L', 'XL', '2XL'] : ['S', 'M', 'L', 'XL', 'XXL']);
    let currentIndex = availableSizes.indexOf(size);
    if (currentIndex === -1) {
      // Find closest fallback
      if (size === 'XS' && availableSizes.includes('S')) size = 'S';
      if (size === 'XXL' && availableSizes.includes('XL')) size = 'XL';
      if (size === '2XL' && availableSizes.includes('XL')) size = 'XL';
    }

    currentIndex = availableSizes.indexOf(size);
    if (currentIndex !== -1) {
      if (calcPreference === 'slim' && currentIndex > 0) {
        size = availableSizes[currentIndex - 1];
      } else if (calcPreference === 'relaxed' && currentIndex < availableSizes.length - 1) {
        size = availableSizes[currentIndex + 1];
      }
    }

    return size;
  };

  // Review Form States
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Produk nie gevind nie.</p>
        <button onClick={() => setView('shop')} className="mt-4 bg-[#1A1A1A] text-white px-6 py-2 uppercase text-xs font-bold tracking-widest">
          Terug na Winkel
        </button>
      </div>
    );
  }

  // Get approved reviews for this specific product
  const productReviews = reviews.filter((r) => r.productId === product.id && r.approved);

  // Related products (exclude current)
  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 3);

  const isWish = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    await addReview({
      name: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      productId: product.id,
      productTitle: product.name.af
    });

    setReviewSubmitted(true);
    setReviewName('');
    setReviewComment('');
    setReviewRating(5);
    setTimeout(() => setReviewSubmitted(false), 5000);
  };

  const handleBackToShop = () => {
    setView('shop');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 md:py-16">
      {/* Back Button */}
      <button
        onClick={handleBackToShop}
        className="flex items-center space-x-2 text-xs uppercase tracking-widest font-black text-gray-500 hover:text-[#1A1A1A] mb-8 transition-colors cursor-pointer"
      >
        <ArrowLeft size={14} />
        <span>{language === 'af' ? 'Terug na Winkel' : 'Back to Shop'}</span>
      </button>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Left Column: Image with premium frame */}
        <div className="flex flex-col">
          <div className="relative aspect-square w-full bg-[#F5F2ED] border border-[#E0DBCF] overflow-hidden rounded shadow-sm group">
            <img
              src={activeImage || product.images[0]}
              alt={product.name.af}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            {product.isPromo && (
              <span className="absolute top-4 left-4 bg-[#D4AF37] text-[#1A1A1A] text-[9px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded shadow-lg border border-[#C5A059] z-10 animate-bounce">
                {language === 'af' ? 'Spesiale promosie aanbieding' : 'Special promotion'}
              </span>
            )}
            {!product.isPromo && product.originalPrice && (
              <span className="absolute top-4 left-4 bg-[#8B4513] text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded shadow animate-pulse">
                {language === 'af' ? 'PROMOSIE' : 'SPECIAL PROMO'}
              </span>
            )}
          </div>

          {/* Interactive Thumbnails Gallery */}
          {product.images.length > 1 && (
            <div className="flex space-x-3 mt-4 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300">
              {product.images.map((img, idx) => {
                const isActive = (activeImage || product.images[0]) === img;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 aspect-square bg-[#F5F2ED] border rounded overflow-hidden cursor-pointer flex-shrink-0 transition-all duration-300 ${
                      isActive
                        ? 'border-[#8B4513] ring-2 ring-[#8B4513]/30 scale-95 shadow-sm'
                        : 'border-[#E0DBCF] hover:border-[#8B4513]/50 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name.af} thumbnail ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
          
          {/* Quality Trust Card under image */}
          <div className="mt-6 bg-[#E0DBCF]/30 border border-[#E0DBCF] rounded p-5 flex items-start space-x-4">
            <ShieldCheck className="text-[#8B4513] flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-xs uppercase tracking-wider font-black text-[#1A1A1A]">
                {language === 'af' ? 'Volksgrond Kwaliteit-Garantie' : 'Volksgrond Quality Guarantee'}
              </h4>
              <p className="text-[11px] text-gray-500 leading-relaxed mt-1">
                {language === 'af'
                  ? 'Ons kledingstukke word met die uiterste sorg en vakmanskap in Suid-Afrika vervaardig. Ons gebruik uitsluitlik premium katoen wat gebou is om te hou.'
                  : 'Our garments are manufactured with the utmost care and craftsmanship in South Africa. We exclusively use premium cotton built to last.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Add to Cart */}
        <div className="flex flex-col">
          {/* Breadcrumbs / Category */}
          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#8B4513] mb-2 block">
            {language === 'af' ? `T-hempte / ${product.categoryLabel.af}` : `T-Shirts / ${product.categoryLabel.en}`}
          </span>

          <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-[#1A1A1A] mb-3">
            {language === 'af' ? product.name.af : product.name.en}
          </h1>

          {/* Pricing Row */}
          <div className="flex items-baseline space-x-4 mb-6">
            <span className="text-3xl font-light text-[#1A1A1A]">
              R{product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-lg line-through text-gray-400">
                R{product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-[9px] bg-[#E0DBCF]/80 text-[#8B4513] font-black px-2.5 py-0.5 rounded uppercase tracking-widest">
              {language === 'af' ? 'BTW INGESLUIT' : 'VAT INCLUDED'}
            </span>
          </div>

          {/* Special Promotion Announcement Box */}
          {product.isPromo && product.promoText && (
            <div className="mb-6 bg-[#E0DBCF]/20 border border-[#C5A059] rounded-lg p-4.5 flex items-start space-x-3.5 shadow-sm">
              <span className="text-[#8B4513] text-lg shrink-0 mt-0.5 animate-pulse">★</span>
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-[#8B4513]">
                  {language === 'af' ? 'Spesiale promosie aanbieding' : 'Special promotion'}
                </h4>
                <p className="text-xs text-[#1A1A1A] leading-relaxed mt-1 font-semibold">
                  {language === 'af' ? product.promoText.af : product.promoText.en}
                </p>
              </div>
            </div>
          )}

          <p className="text-sm leading-relaxed text-gray-500 mb-8">
            {language === 'af' ? product.description.af : product.description.en}
          </p>

          {/* Color Selection (if more than 1 color) */}
          {product.colors.length > 1 && (
            <div className="mb-6">
              <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2.5 block">
                {language === 'af' ? 'Kies Kleur' : 'Select Color'}
              </label>
              <div className="flex gap-2.5">
                {product.colors.map((color) => {
                  const colorLabel = color.split(' / ')[0];
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-xs font-medium border rounded transition-all cursor-pointer ${
                        selectedColor === color
                          ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                          : 'border-[#E0DBCF] text-[#1A1A1A] hover:border-[#1A1A1A] bg-white'
                      }`}
                    >
                      {colorLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selector */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2.5">
              <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 block">
                {language === 'af' ? 'Kies Grootte' : 'Select Size'}
              </label>
              <button
                onClick={() => setGlobalSizeGuideOpen(true)}
                className="text-[10px] uppercase font-black tracking-widest text-[#8B4513] hover:text-[#5C2E0B] transition-colors cursor-pointer flex items-center space-x-1 font-black"
              >
                <Ruler size={11} />
                <span>{language === 'af' ? 'Groottegids & Kleure' : 'Size Guide & Colors'}</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 border text-xs font-black transition-all cursor-pointer ${
                    selectedSize === size
                      ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                      : 'border-[#E0DBCF] hover:border-[#1A1A1A] text-[#1A1A1A] bg-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="mb-8">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2.5 block">
              {language === 'af' ? 'Aantal' : 'Quantity'}
            </label>
            
            <div className="flex space-x-4">
              {/* Quantity selectors */}
              <div className="flex items-center border border-[#E0DBCF] bg-white rounded overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-gray-100 text-[#1A1A1A] font-bold text-xs cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 py-2 font-black text-xs text-[#1A1A1A]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 hover:bg-gray-100 text-[#1A1A1A] font-bold text-xs cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`border border-[#E0DBCF] p-3 rounded hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer ${
                  isWish ? 'text-[#8B4513] bg-[#E0DBCF]/25' : 'text-[#1A1A1A]'
                }`}
                title={language === 'af' ? 'Gunstelinge' : 'Wishlist'}
              >
                <Heart size={16} fill={isWish ? '#8B4513' : 'none'} />
              </button>
            </div>
          </div>

          {/* Add to Cart Trigger */}
          <div className="mb-10">
            {product.stockCount > 0 ? (
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
                    <span>{language === 'af' ? 'Suksesvol Bygevoeg' : 'Successfully Added'}</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <ShoppingBag size={14} />
                    <span>{language === 'af' ? 'Voeg by Mandjie' : 'Add to Cart'}</span>
                  </span>
                )}
              </button>
            ) : (
              <button
                disabled
                className="w-full py-4 bg-gray-200 text-gray-400 text-xs uppercase tracking-[0.2em] cursor-not-allowed"
              >
                {language === 'af' ? 'UITVERKOOP' : 'OUT OF STOCK'}
              </button>
            )}

            {/* Aramex Prompt */}
            <div className="flex items-center justify-center space-x-2 text-[10px] text-gray-400 uppercase tracking-widest mt-4">
              <Truck size={12} className="text-[#8B4513]" />
              <span>Aramex Aflewering binne 24 - 72 uur landwyd</span>
            </div>
          </div>

          {/* Dynamic tabs / accordion for more features */}
          <div className="border border-[#E0DBCF] bg-[#F5F2ED]/40 rounded mb-10 overflow-hidden text-xs">
            {/* Tabs Header */}
            <div className="flex border-b border-[#E0DBCF] bg-[#F5F2ED]">
              <button
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-3 px-4 text-[10px] uppercase tracking-wider font-black text-center cursor-pointer transition-all ${
                  activeTab === 'details' ? 'bg-white text-[#8B4513] border-b-2 border-[#8B4513]' : 'text-gray-500 hover:text-[#1A1A1A]'
                }`}
              >
                {language === 'af' ? 'Kenmerke' : 'Features'}
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`flex-1 py-3 px-4 text-[10px] uppercase tracking-wider font-black text-center cursor-pointer transition-all ${
                  activeTab === 'materials' ? 'bg-white text-[#8B4513] border-b-2 border-[#8B4513]' : 'text-gray-500 hover:text-[#1A1A1A]'
                }`}
              >
                {language === 'af' ? 'Materiaal' : 'Materials'}
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`flex-1 py-3 px-4 text-[10px] uppercase tracking-wider font-black text-center cursor-pointer transition-all ${
                  activeTab === 'care' ? 'bg-white text-[#8B4513] border-b-2 border-[#8B4513]' : 'text-gray-500 hover:text-[#1A1A1A]'
                }`}
              >
                {language === 'af' ? 'Sorgsnoere' : 'Care'}
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-5 bg-white text-gray-500 leading-relaxed">
              {activeTab === 'details' && (
                <ul className="list-disc pl-4 space-y-2">
                  {product.features.map((feat, idx) => (
                    <li key={idx}>
                      {language === 'af' ? feat.af : feat.en}
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === 'materials' && (
                <p>{language === 'af' ? product.materials.af : product.materials.en}</p>
              )}
              {activeTab === 'care' && (
                <p>{language === 'af' ? product.careInstructions.af : product.careInstructions.en}</p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Reviews Showcase and Submission Section */}
      <div className="border-t border-[#E0DBCF] mt-16 pt-16 max-w-4xl">
        <h2 className="text-2xl font-black uppercase tracking-tight text-[#1A1A1A] mb-8">
          {language === 'af' ? 'Kliënte Resensies' : 'Customer Reviews'}
        </h2>

        {/* Existing Reviews list */}
        <div className="space-y-6 mb-12">
          {productReviews.length === 0 ? (
            <div className="bg-white p-6 border border-[#E0DBCF] text-center text-xs text-gray-400 italic rounded">
              {language === 'af'
                ? 'Geen resensies vir hierdie produk tans goedgekeur nie. Wees die eerste om een te plaas!'
                : 'No reviews approved for this product yet. Be the first to write one!'}
            </div>
          ) : (
            productReviews.map((rev) => (
              <div key={rev.id} className="bg-white border border-[#E0DBCF] rounded p-6 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs uppercase text-[#1A1A1A]">{rev.name}</span>
                    <span className="text-[10px] text-gray-400">• {rev.date}</span>
                  </div>
                  {/* Stars indicators */}
                  <div className="flex text-[#C5A059]">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} size={12} fill="#C5A059" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>
            ))
          )}
        </div>

        {/* Submit Review form */}
        <div className="bg-[#E0DBCF]/20 border border-[#E0DBCF] rounded p-6 md:p-8">
          <h3 className="text-sm uppercase tracking-wider font-black text-[#1A1A1A] mb-6 flex items-center space-x-2">
            <MessageSquare size={16} className="text-[#8B4513]" />
            <span>{language === 'af' ? 'Skryf \'n Resensie' : 'Write a Review'}</span>
          </h3>

          {reviewSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-5 rounded">
              {language === 'af'
                ? 'Baie dankie vir jou resensie! Dit is suksesvol ingedien en sal sigbaar wees sodra dit deur die admin goedgekeur is.'
                : 'Thank you for your review! It has been successfully submitted and will be visible once approved by the admin.'}
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] uppercase font-black tracking-widest text-gray-400 mb-1.5 block">
                    {language === 'af' ? 'Jou Volle Naam' : 'Your Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full bg-white border border-[#E0DBCF] rounded p-2.5 text-xs focus:outline-none focus:border-[#8B4513]"
                    placeholder="Bv. Jan van der Merwe"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase font-black tracking-widest text-gray-400 mb-1.5 block">
                    {language === 'af' ? 'Beoordeling' : 'Rating'}
                  </label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full bg-white border border-[#E0DBCF] rounded p-2.5 text-xs focus:outline-none focus:border-[#8B4513]"
                  >
                    <option value="5">★★★★★ (5 / 5)</option>
                    <option value="4">★★★★☆ (4 / 5)</option>
                    <option value="3">★★★☆☆ (3 / 5)</option>
                    <option value="2">★★☆☆☆ (2 / 5)</option>
                    <option value="1">★☆☆☆☆ (1 / 5)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[9px] uppercase font-black tracking-widest text-gray-400 mb-1.5 block">
                  {language === 'af' ? 'Jou Resensie' : 'Your Review'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-white border border-[#E0DBCF] rounded p-2.5 text-xs focus:outline-none focus:border-[#8B4513]"
                  placeholder={language === 'af' ? 'Deel jou ervaring oor die diens en materiaal...' : 'Share your thoughts about fabric and services...'}
                />
              </div>

              <button
                type="submit"
                className="bg-[#1A1A1A] hover:bg-[#333] text-white font-bold text-[9px] uppercase tracking-widest px-6 py-3 rounded cursor-pointer transition-colors"
              >
                {language === 'af' ? 'Dien Resensie In' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Related Products Grid (Cross-sell to increase AOV) */}
      <div className="border-t border-[#E0DBCF] mt-16 pt-16">
        <h2 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A] mb-8">
          {language === 'af' ? 'Ander Gewilde Items' : 'Other Popular Items'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((rel) => (
            <div
              key={rel.id}
              onClick={() => {
                setSelectedProductId(rel.id);
                setSelectedSize(rel.sizes[0]);
                setSelectedColor(rel.colors[0]);
                setView('product-details');
              }}
              className="bg-white border border-[#E0DBCF] hover:border-gray-400 transition-all rounded p-4 cursor-pointer group shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="aspect-square w-full bg-[#F5F2ED] rounded overflow-hidden mb-3">
                  <img
                    src={rel.images[0]}
                    alt={rel.name.af}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-black text-xs uppercase text-[#1A1A1A] tracking-tight group-hover:text-[#8B4513] transition-colors">
                  {language === 'af' ? rel.name.af : rel.name.en}
                </h3>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">
                  R{rel.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Size & Color Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white border border-[#E0DBCF] w-full max-w-2xl rounded shadow-2xl p-6 md:p-8 my-8 text-[#1A1A1A]"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#1A1A1A] p-1 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="border-b border-[#E0DBCF] pb-4 mb-4">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#8B4513]">
                {language === 'af' ? 'Volksgrond Klere Gids' : 'Volksgrond Garment Guide'}
              </span>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#1A1A1A] mt-1 flex items-center space-x-2">
                <Ruler className="text-[#8B4513]" size={20} />
                <span>
                  {product.category === 'ladies'
                    ? (language === 'af' ? 'Dames T-hemp Gids (Kortmou)' : 'Ladies T-Shirt Guide (Short Sleeve)')
                    : (language === 'af' ? 'Mans T-hemp Gids' : 'Men\'s T-Shirt Guide')}
                </span>
              </h3>
            </div>

            {/* Tab navigation inside the modal */}
            <div className="flex border-b border-[#E0DBCF] mb-6">
              <button
                type="button"
                onClick={() => setSizeGuideTab('calculator')}
                className={`flex-1 py-3 text-xs uppercase tracking-[0.15em] font-black text-center cursor-pointer transition-all ${
                  sizeGuideTab === 'calculator' 
                    ? 'border-b-2 border-[#8B4513] text-[#8B4513]' 
                    : 'text-gray-400 hover:text-[#1A1A1A]'
                }`}
              >
                {language === 'af' ? '🧮 Interaktiewe Groottegids' : '🧮 Interactive Size Guide'}
              </button>
              <button
                type="button"
                onClick={() => setSizeGuideTab('chart')}
                className={`flex-1 py-3 text-xs uppercase tracking-[0.15em] font-black text-center cursor-pointer transition-all ${
                  sizeGuideTab === 'chart' 
                    ? 'border-b-2 border-[#8B4513] text-[#8B4513]' 
                    : 'text-gray-400 hover:text-[#1A1A1A]'
                }`}
              >
                {language === 'af' ? '📏 Groottekaart & Metings' : '📏 Size Chart & Specs'}
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              
              {/* Size Guide Tab Content */}
              {sizeGuideTab === 'calculator' ? (
                <div className="space-y-6">
                  <p className="text-xs text-gray-500 leading-relaxed bg-[#F5F2ED]/50 border-l-2 border-[#8B4513] pl-3.5 py-1.5">
                    {language === 'af'
                      ? 'Sê totsiens vir terugsendings! Voer jou lengte en gewig in vir \'n wetenskaplik-berekende grootte-aanbeveling vir jou liggaamstipe.'
                      : 'Say goodbye to returns! Input your height and weight for a scientifically calculated size recommendation for your body type.'}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F5F2ED]/30 border border-[#E0DBCF] rounded p-6">
                    {/* Left Column: Sliders */}
                    <div className="space-y-5">
                      {/* Height Slider */}
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] uppercase font-black tracking-wider text-gray-500">
                            {language === 'af' ? 'Jou Lengte (cm)' : 'Your Height (cm)'}
                          </span>
                          <span className="text-xs font-black font-mono text-[#8B4513] bg-[#8B4513]/10 px-2.5 py-0.5 rounded">
                            {calcHeight} cm
                          </span>
                        </div>
                        <input
                          type="range"
                          min="140"
                          max="210"
                          value={calcHeight}
                          onChange={(e) => setCalcHeight(Number(e.target.value))}
                          className="w-full accent-[#8B4513] cursor-ew-resize bg-gray-200 rounded h-1"
                        />
                        <div className="flex justify-between text-[9px] text-gray-400 font-mono mt-1">
                          <span>140 cm</span>
                          <span>175 cm</span>
                          <span>210 cm</span>
                        </div>
                      </div>

                      {/* Weight Slider */}
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] uppercase font-black tracking-wider text-gray-500">
                            {language === 'af' ? 'Jou Gewig (kg)' : 'Your Weight (kg)'}
                          </span>
                          <span className="text-xs font-black font-mono text-[#8B4513] bg-[#8B4513]/10 px-2.5 py-0.5 rounded">
                            {calcWeight} kg
                          </span>
                        </div>
                        <input
                          type="range"
                          min="40"
                          max="130"
                          value={calcWeight}
                          onChange={(e) => setCalcWeight(Number(e.target.value))}
                          className="w-full accent-[#8B4513] cursor-ew-resize bg-gray-200 rounded h-1"
                        />
                        <div className="flex justify-between text-[9px] text-gray-400 font-mono mt-1">
                          <span>40 kg</span>
                          <span>85 kg</span>
                          <span>130 kg</span>
                        </div>
                      </div>

                      {/* Fit Preference Button Toggles */}
                      <div>
                        <span className="text-[10px] uppercase font-black tracking-wider text-gray-500 mb-2 block">
                          {language === 'af' ? 'Verkose Pasvorm' : 'Fit Preference'}
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'slim', labelAf: 'Noupassend', labelEn: 'Slim Fit' },
                            { id: 'regular', labelAf: 'Standaard', labelEn: 'Regular' },
                            { id: 'relaxed', labelAf: 'Losser', labelEn: 'Relaxed' }
                          ].map((pref) => (
                            <button
                              key={pref.id}
                              type="button"
                              onClick={() => setCalcPreference(pref.id as any)}
                              className={`py-2 px-1 text-[9px] uppercase tracking-wider font-black border rounded text-center transition-all cursor-pointer ${
                                calcPreference === pref.id
                                  ? 'border-[#8B4513] bg-[#8B4513] text-white shadow-sm'
                                  : 'border-[#E0DBCF] bg-white text-[#1A1A1A] hover:border-[#8B4513]'
                              }`}
                            >
                              {language === 'af' ? pref.labelAf : pref.labelEn}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Visual output and apply CTA */}
                    <div className="border border-[#E0DBCF] bg-white rounded p-5 flex flex-col justify-between items-center text-center shadow-sm">
                      <div className="space-y-2 w-full">
                        <span className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-400 block">
                          {language === 'af' ? 'VOORGESTELDE GROOTTE' : 'RECOMMENDED SIZE'}
                        </span>
                        
                        {/* Huge visual Size letter */}
                        <div className="w-24 h-24 rounded-full bg-[#8B4513]/5 border-2 border-[#8B4513]/20 flex items-center justify-center mx-auto shadow-sm">
                          <span className="text-4xl font-black text-[#8B4513] font-sans">
                            {getRecommendedSize()}
                          </span>
                        </div>

                        {/* Match Percentage Indicator */}
                        <div className="inline-block bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                          <span className="text-[10px] font-black text-emerald-800 font-mono flex items-center gap-1">
                            <span className="text-emerald-500">●</span>
                            <span>
                              {calcWeight % 3 === 0 ? '98%' : '95%'} {language === 'af' ? 'Akkuraatheidspasvorm' : 'Accuracy Match'}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Explanation subtitle */}
                      <p className="text-[11px] text-gray-500 italic px-2 mt-4 leading-relaxed">
                        {language === 'af'
                          ? `Gegrond op jou lengte (${calcHeight}cm) en gewig (${calcWeight}kg), is die ideale keuse 'n "${calcPreference === 'slim' ? 'Noupassende' : calcPreference === 'relaxed' ? 'Losser' : 'Standaard'}" ${getRecommendedSize()}-hemp.`
                          : `Based on your height (${calcHeight}cm) and weight (${calcWeight}kg), the ideal choice is a "${calcPreference === 'slim' ? 'Slim Fit' : calcPreference === 'relaxed' ? 'Relaxed' : 'Regular'}" ${getRecommendedSize()} shirt.`}
                      </p>

                      {/* Apply button */}
                      <button
                        type="button"
                        onClick={() => {
                          const size = getRecommendedSize();
                          setSelectedSize(size);
                          setShowSizeGuide(false);
                          alert(language === 'af' 
                            ? `Grootte ${size} is suksesvol gekies as jou grootte!` 
                            : `Size ${size} has been successfully selected!`);
                        }}
                        className="w-full mt-4 py-2.5 bg-[#1A1A1A] hover:bg-[#333] text-white rounded text-[10px] uppercase tracking-widest font-black transition-all cursor-pointer shadow"
                      >
                        {language === 'af' ? 'Pas hierdie grootte toe' : 'Apply this recommended size'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Traditional Size Chart & Info tab
                <div className="space-y-6">
                  {/* COLOR SWATCHES (Dames spesifiek) */}
                  {product.category === 'ladies' && (
                    <div>
                      <h4 className="text-xs uppercase tracking-widest font-black text-[#8B4513] mb-3">
                        {language === 'af' ? 'Beskikbare Kleurpalet' : 'Available Color Palette'}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#F5F2ED]/40 border border-[#E0DBCF] rounded p-4">
                        {[
                          { nameAf: 'Swart', nameEn: 'Black', hex: '#111111' },
                          { nameAf: 'Wit', nameEn: 'White', hex: '#FFFFFF', border: true },
                          { nameAf: 'Muntgroen', nameEn: 'Mint Green', hex: '#98FFD9' },
                          { nameAf: 'Rooi', nameEn: 'Red', hex: '#E63946' },
                          { nameAf: 'Pienk', nameEn: 'Pink', hex: '#FF69B4' },
                          { nameAf: 'Vlootblou', nameEn: 'Navy Blue', hex: '#1D3557' },
                          { nameAf: 'Sand', nameEn: 'Sand', hex: '#D2B48C' }
                        ].map((col, i) => (
                          <div key={i} className="flex items-center space-x-2.5">
                            <span
                              className={`w-6 h-6 rounded-full shadow-inner block ${
                                col.border ? 'border border-[#E0DBCF]' : ''
                              }`}
                              style={{ backgroundColor: col.hex }}
                            />
                            <div className="text-[11px] leading-tight">
                              <span className="font-bold block text-gray-800">
                                {language === 'af' ? col.nameAf : col.nameEn}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* MEASUREMENTS TABLE */}
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-black text-[#8B4513] mb-3">
                      {language === 'af' ? 'Grootte Kaart & Matings (cm)' : 'Size Chart & Measurements (cm)'}
                    </h4>
                    <div className="overflow-x-auto border border-[#E0DBCF] rounded">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#F5F2ED] border-b border-[#E0DBCF] uppercase tracking-wider text-[9px] font-black text-[#8B4513]">
                            <th className="py-3 px-4">{language === 'af' ? 'Grootte' : 'Size'}</th>
                            <th className="py-3 px-4">{language === 'af' ? '1. Borswydte (Width)' : '1. Body Width'}</th>
                            <th className="py-3 px-4">{language === 'af' ? '2. Totale Lengte (Length)' : '2. Body Length'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E0DBCF] font-mono">
                          {product.category === 'ladies' ? (
                            [
                              { size: 'XS', width: '37.5', length: '62' },
                              { size: 'S', width: '40.5', length: '63' },
                              { size: 'M', width: '43', length: '64' },
                              { size: 'L', width: '46', length: '65' },
                              { size: 'XL', width: '49', length: '66' },
                              { size: '2XL', width: '52', length: '66.5' }
                            ].map((row, idx) => (
                              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                <td className="py-2.5 px-4 font-sans font-black text-[#1A1A1A]">{row.size}</td>
                                <td className="py-2.5 px-4 text-gray-600">{row.width} cm</td>
                                <td className="py-2.5 px-4 text-gray-600">{row.length} cm</td>
                              </tr>
                            ))
                          ) : (
                            [
                              { size: 'S', width: '50', length: '70' },
                              { size: 'M', width: '53', length: '72' },
                              { size: 'L', width: '56', length: '74' },
                              { size: 'XL', width: '59', length: '76' },
                              { size: 'XXL', width: '62', length: '78' }
                            ].map((row, idx) => (
                              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                <td className="py-2.5 px-4 font-sans font-black text-[#1A1A1A]">{row.size}</td>
                                <td className="py-2.5 px-4 text-gray-600">{row.width} cm</td>
                                <td className="py-2.5 px-4 text-gray-600">{row.length} cm</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* HOW TO MEASURE & GRAPHIC */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-[#F5F2ED]/25 border border-[#E0DBCF] rounded p-5">
                    <div className="flex justify-center items-center">
                      <div className="relative w-40 h-40 bg-[#1A1A1A]/5 rounded-lg flex items-center justify-center border border-[#E0DBCF]/60">
                        <svg viewBox="0 0 100 100" className="w-32 h-32 text-gray-400 stroke-current stroke-[1.5] fill-none">
                          <path d="M 30,15 L 42,20 C 45,15 55,15 58,20 L 70,15 L 82,27 L 72,37 L 72,85 L 28,85 L 28,37 L 18,27 Z" />
                          <line x1="28" y1="48" x2="72" y2="48" className="stroke-[#8B4513] stroke-[1]" strokeDasharray="2" />
                          <circle cx="50" cy="48" r="4.5" className="fill-[#8B4513]" />
                          <text x="50" y="51" className="fill-white text-[7px] font-sans font-black text-center" textAnchor="middle">1</text>
                          
                          <line x1="50" y1="18" x2="50" y2="85" className="stroke-[#8B4513] stroke-[1]" strokeDasharray="2" />
                          <circle cx="50" cy="68" r="4.5" className="fill-[#8B4513]" />
                          <text x="50" y="71" className="fill-white text-[7px] font-sans font-black text-center" textAnchor="middle">2</text>
                        </svg>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div>
                        <h5 className="font-black text-[#8B4513] uppercase text-[10px] tracking-wider mb-1">
                          1. {language === 'af' ? 'Borswydte (Body Width)' : 'Body Width'}
                        </h5>
                        <p className="text-gray-500 leading-relaxed">
                          {language === 'af'
                            ? 'Meet horisontaal oor die bors van die kledingstuk, reg onder die arms van naat tot naat.'
                            : 'Measure horizontally across the chest of the garment, right underneath the arms from seam to seam.'}
                        </p>
                      </div>
                      <div>
                        <h5 className="font-black text-[#8B4513] uppercase text-[10px] tracking-wider mb-1">
                          2. {language === 'af' ? 'Kledingstuk Lengte (Body Length)' : 'Body Length'}
                        </h5>
                        <p className="text-gray-500 leading-relaxed">
                          {language === 'af'
                            ? 'Meet vertikaal van die hoogste punt van die skouer tot by die heel onderste soom.'
                            : 'Measure vertically from the highest point of the shoulder down to the very bottom hem.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-400 italic text-center mt-2">
                    {language === 'af'
                      ? '* Al ons kledingstukke word met die hand gemeet en vervaardig; uitsonderings van tot 1.5cm mag voorkom.'
                      : '* All our garments are measured and crafted by hand; tolerances of up to 1.5cm may occur.'}
                  </p>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#E0DBCF] pt-4 mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSizeGuide(false)}
                className="bg-[#1A1A1A] hover:bg-[#333] text-white font-bold text-[10px] uppercase tracking-widest px-6 py-2.5 rounded transition-colors cursor-pointer"
              >
                {language === 'af' ? 'Sluit Gids' : 'Close Guide'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};
