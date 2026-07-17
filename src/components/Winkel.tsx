import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { Heart, Search, Filter, ShoppingCart, SlidersHorizontal, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Winkel: React.FC = () => {
  const {
    language,
    products,
    wishlist,
    toggleWishlist,
    addToCart,
    setView,
    setSelectedProductId,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    sizeFilter,
    setSizeFilter
  } = useApp();

  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});

  const categories = [
    { key: null, af: 'Alles', en: 'All' },
    { key: 'men', af: 'Mans', en: 'Men' },
    { key: 'ladies', af: 'Dames', en: 'Ladies' },
    { key: 'volkspore', af: 'Volkspore Kinders', en: 'Volkspore Kids' },
    { key: 'caps', af: 'Kepse', en: 'Caps' },
    { key: 'promo', af: 'Spesiale Promosies 🔥', en: 'Special Promotions 🔥' }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', 'Adjustable / Verstelbaar'];

  // Advanced client-side filtering and sorting engine
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search Query Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.af.toLowerCase().includes(q) ||
          p.name.en.toLowerCase().includes(q) ||
          p.description.af.toLowerCase().includes(q) ||
          p.description.en.toLowerCase().includes(q)
      );
    }

    // Category Filter
    if (categoryFilter) {
      if (categoryFilter === 'promo') {
        result = result.filter((p) => p.isPromo === true);
      } else {
        result = result.filter((p) => p.category === categoryFilter);
      }
    }

    // Size Filter
    if (sizeFilter) {
      result = result.filter((p) => p.sizes.includes(sizeFilter));
    }

    // Sort Logic
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, searchQuery, categoryFilter, sizeFilter, sortBy]);

  const handleProductClick = (id: string) => {
    setSelectedProductId(id);
    setView('product-details');
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    // Default to M size unless it is adjustable cap
    const defaultSize = product.category === 'caps' ? product.sizes[0] : 'M';
    addToCart(product, 1, defaultSize, product.colors[0]);
    
    setAddedItemMap(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemMap(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const handleToggleWish = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toggleWishlist(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
      {/* Header / Search Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E0DBCF] pb-8 mb-10">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] font-black text-[#8B4513] mb-2 block">
            {language === 'af' ? 'OORSPRONKLIKE VERSAMELINGS' : 'ORIGINAL COLLECTIONS'}
          </span>
          <h1 className="text-4xl font-black uppercase tracking-tight text-[#1A1A1A]">
            {language === 'af' ? 'Koop Volksgrond' : 'Shop Volksgrond'}
          </h1>
        </div>

        {/* Search Bar Input */}
        <div className="relative mt-6 md:mt-0 max-w-sm w-full">
          <input
            type="text"
            placeholder={language === 'af' ? 'Soek produkte...' : 'Search products...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E0DBCF] rounded px-4 py-2.5 pl-10 text-xs focus:outline-none focus:border-[#8B4513] transition-colors"
          />
          <Search size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Filters Sidebar (Large screens) or Top Bar */}
        <div className="w-full lg:w-1/4 flex flex-col space-y-8">
          
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-center space-x-2 w-full bg-[#E0DBCF]/50 hover:bg-[#E0DBCF] py-3 text-xs uppercase tracking-widest font-black transition-colors rounded cursor-pointer"
          >
            <SlidersHorizontal size={14} />
            <span>{language === 'af' ? 'Wys Filtreerders' : 'Show Filters'}</span>
          </button>

          {/* Filters Container */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-8`}>
            
            {/* Category Filter */}
            <div className="border-b border-[#E0DBCF] pb-6">
              <h3 className="text-xs uppercase tracking-wider font-black text-[#1A1A1A] mb-4">
                {language === 'af' ? 'Kategorieë' : 'Categories'}
              </h3>
              <div className="flex flex-col space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.key as any}
                    onClick={() => setCategoryFilter(cat.key as any)}
                    className={`text-left text-xs py-1.5 transition-colors cursor-pointer flex items-center justify-between ${
                      categoryFilter === cat.key
                        ? 'font-black text-[#8B4513]'
                        : 'text-gray-500 hover:text-[#1A1A1A]'
                    }`}
                  >
                    <span>{language === 'af' ? cat.af : cat.en}</span>
                    {categoryFilter === cat.key && <span className="w-1.5 h-1.5 rounded-full bg-[#8B4513]"></span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="border-b border-[#E0DBCF] pb-6">
              <h3 className="text-xs uppercase tracking-wider font-black text-[#1A1A1A] mb-4">
                {language === 'af' ? 'Filtreer volgens Grootte' : 'Filter by Size'}
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSizeFilter(null)}
                  className={`px-3 py-1.5 text-[10px] uppercase font-bold border transition-colors cursor-pointer ${
                    sizeFilter === null
                      ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                      : 'border-[#E0DBCF] text-gray-500 hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
                  }`}
                >
                  {language === 'af' ? 'Almal' : 'All'}
                </button>
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSizeFilter(sz)}
                    className={`px-3 py-1.5 text-[10px] uppercase font-bold border transition-colors cursor-pointer ${
                      sizeFilter === sz
                        ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                        : 'border-[#E0DBCF] text-gray-500 hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {sz.split(' / ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorter Selection */}
            <div>
              <h3 className="text-xs uppercase tracking-wider font-black text-[#1A1A1A] mb-4">
                {language === 'af' ? 'Sorteer Volgens' : 'Sort By'}
              </h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513] cursor-pointer"
              >
                <option value="newest">{language === 'af' ? 'Nuutste Produkte' : 'Newest Releases'}</option>
                <option value="price-low">{language === 'af' ? 'Prys: Laag na Hoog' : 'Price: Low to High'}</option>
                <option value="price-high">{language === 'af' ? 'Prys: Hoog na Laag' : 'Price: High to Low'}</option>
              </select>
            </div>

          </div>
        </div>

        {/* Products Grid Pane */}
        <div className="w-full lg:w-3/4">
          <AnimatePresence mode="popLayout">
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-[#E0DBCF] text-center p-16 rounded shadow-sm flex flex-col items-center"
              >
                <span className="text-4xl mb-4">🔍</span>
                <h3 className="font-bold uppercase text-sm tracking-widest text-[#1A1A1A]">
                  {language === 'af' ? 'Geen produkte gevind nie' : 'No products found'}
                </h3>
                <p className="text-xs text-gray-400 mt-2">
                  {language === 'af' 
                    ? 'Probeer asseblief weer met ander soekwoorde of filtreerders.' 
                    : 'Please try searching with other keywords or filters.'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter(null);
                    setSizeFilter(null);
                  }}
                  className="mt-6 bg-[#1A1A1A] text-white font-bold text-[10px] uppercase tracking-widest px-6 py-3 cursor-pointer rounded hover:bg-[#333]"
                >
                  {language === 'af' ? 'Herstel Filtreerders' : 'Reset Filters'}
                </button>
              </motion.div>
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProducts.map((prod) => {
                  const isWish = wishlist.includes(prod.id);
                  const isAdded = addedItemMap[prod.id] || false;
                  return (
                    <motion.div
                      layout
                      key={prod.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      onClick={() => handleProductClick(prod.id)}
                      className="bg-white border border-[#E0DBCF] hover:border-gray-400 transition-all rounded p-4 group cursor-pointer flex flex-col justify-between shadow-sm relative"
                    >
                      {/* Product Thumbnail container */}
                      <div>
                        <div className="relative aspect-square w-full bg-[#F5F2ED] rounded overflow-hidden mb-4">
                          <img
                            src={prod.images[0]}
                            alt={prod.name.af}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />

                          {/* Quick wishlist overlay action */}
                          <button
                            onClick={(e) => handleToggleWish(e, prod.id)}
                            className="absolute top-2.5 right-2.5 bg-white/95 hover:bg-white text-[#1A1A1A] p-2 rounded-full shadow transition-all hover:scale-105 cursor-pointer z-10"
                          >
                            <Heart 
                              size={14} 
                              fill={isWish ? '#8B4513' : 'none'} 
                              stroke={isWish ? '#8B4513' : '#1A1A1A'} 
                            />
                          </button>

                          {/* Category Badge overlay */}
                          <span className="absolute bottom-2.5 left-2.5 bg-[#1A1A1A]/85 text-[#F5F2ED] text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                            {language === 'af' ? prod.categoryLabel.af : prod.categoryLabel.en}
                          </span>

                          {prod.isPromo && (
                            <span className="absolute top-2.5 left-2.5 bg-[#D4AF37] text-[#1A1A1A] text-[7px] font-black uppercase tracking-wider px-2 py-1 rounded shadow-md border border-[#C5A059] z-10">
                              {language === 'af' ? 'Spesiale promosie aanbieding' : 'Special promotion'}
                            </span>
                          )}

                          {prod.stockCount <= 5 && prod.stockCount > 0 && (
                            <span className={`absolute ${prod.isPromo ? 'top-9' : 'top-2.5'} left-2.5 bg-[#8B4513] text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow z-10`}>
                              {language === 'af' ? `Laaste ${prod.stockCount}` : `Last ${prod.stockCount}`}
                            </span>
                          )}

                          {prod.stockCount === 0 && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                              <span className="bg-[#8B4513] text-white font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded">
                                {language === 'af' ? 'UITVERKOOP' : 'OUT OF STOCK'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Title and Category info */}
                        <div className="px-1">
                          {prod.isPromo && (
                            <span className="text-[9px] font-black text-[#8B4513] uppercase tracking-wider block mb-1">
                              ★ {language === 'af' ? 'PROMOSIE AANBIEDING' : 'SPECIAL PROMOTION'}
                            </span>
                          )}
                          <h3 className="font-black text-sm uppercase text-[#1A1A1A] tracking-tight group-hover:text-[#8B4513] transition-colors">
                            {language === 'af' ? prod.name.af : prod.name.en}
                          </h3>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                            R{prod.price.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Quick Buy Button */}
                      <div className="mt-4 pt-4 border-t border-[#E0DBCF]/50">
                        {prod.stockCount > 0 ? (
                          <button
                            onClick={(e) => handleQuickAdd(e, prod)}
                            className={`w-full py-2.5 uppercase text-[9px] font-black tracking-widest transition-all rounded cursor-pointer ${
                              isAdded 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-[#E0DBCF] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A]'
                            }`}
                          >
                            {isAdded ? (
                              <span className="flex items-center justify-center space-x-1">
                                <Check size={10} />
                                <span>{language === 'af' ? 'Bygevoeg' : 'Added'}</span>
                              </span>
                            ) : (
                              <span className="flex items-center justify-center space-x-1">
                                <ShoppingCart size={10} />
                                <span>{language === 'af' ? 'Vinnig Koop' : 'Quick Buy'}</span>
                              </span>
                            )}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="w-full py-2.5 bg-gray-100 text-gray-400 text-[9px] uppercase tracking-widest rounded cursor-not-allowed"
                          >
                            {language === 'af' ? 'Nie Beskikbaar' : 'Unavailable'}
                          </button>
                        )}
                      </div>

                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
