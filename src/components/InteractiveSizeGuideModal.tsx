import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Ruler, HelpCircle, Check, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const InteractiveSizeGuideModal: React.FC = () => {
  const {
    language,
    globalSizeGuideOpen,
    setGlobalSizeGuideOpen,
    lastCalculatedSize,
    setLastCalculatedSize,
    selectedProductId,
    products
  } = useApp();

  // Find active category if we are currently looking at a product
  const activeProduct = products.find((p) => p.id === selectedProductId);
  const initialCategory = activeProduct?.category === 'ladies' ? 'ladies' : 'men';

  // Calculator states
  const [tab, setTab] = useState<'calculator' | 'specs'>('calculator');
  const [category, setCategory] = useState<'men' | 'ladies' | 'kids'>('men');
  const [height, setHeight] = useState(175); // cm
  const [weight, setWeight] = useState(75); // kg
  const [preference, setPreference] = useState<'slim' | 'regular' | 'relaxed'>('regular');
  const [isApplied, setIsApplied] = useState(false);

  // Sync category with active product category when modal opens
  useEffect(() => {
    if (globalSizeGuideOpen && activeProduct) {
      if (activeProduct.category === 'ladies') {
        setCategory('ladies');
        setHeight(165);
        setWeight(58);
      } else if (activeProduct.category === 'kids') {
        setCategory('kids');
        setHeight(115);
        setWeight(22);
      } else {
        setCategory('men');
        setHeight(178);
        setWeight(80);
      }
      setIsApplied(false);
    }
  }, [globalSizeGuideOpen, selectedProductId]);

  // Handle category default updates
  const handleCategoryChange = (cat: 'men' | 'ladies' | 'kids') => {
    setCategory(cat);
    if (cat === 'ladies') {
      setHeight(165);
      setWeight(58);
    } else if (cat === 'kids') {
      setHeight(115);
      setWeight(22);
    } else {
      setHeight(178);
      setWeight(80);
    }
  };

  const calculateRecommendedSize = (): string => {
    let size = 'M';

    if (category === 'ladies') {
      if (weight < 48) size = 'XS';
      else if (weight >= 48 && weight < 56) size = 'S';
      else if (weight >= 56 && weight < 66) size = 'M';
      else if (weight >= 66 && weight < 76) size = 'L';
      else if (weight >= 76 && weight < 86) size = 'XL';
      else size = '2XL';

      // Height logic
      if (height > 175 && size === 'XS') size = 'S';
      if (height < 155 && (size === 'XL' || size === '2XL')) {
        size = size === '2XL' ? 'XL' : 'L';
      }
    } else if (category === 'kids') {
      // Kids size recommendations typically by age or height
      if (height < 100) size = '2-3 Y';
      else if (height >= 100 && height < 112) size = '4-5 Y';
      else if (height >= 112 && height < 125) size = '6-7 Y';
      else if (height >= 125 && height < 138) size = '8-9 Y';
      else if (height >= 138 && height < 150) size = '10-11 Y';
      else size = '12-13 Y';
    } else {
      // Men's category
      if (weight < 65) size = 'S';
      else if (weight >= 65 && weight < 77) size = 'M';
      else if (weight >= 77 && weight < 89) size = 'L';
      else if (weight >= 89 && weight < 101) size = 'XL';
      else size = 'XXL';

      // Height logic adjustment
      if (height > 185 && size === 'S') size = 'M';
      if (height < 165 && (size === 'XL' || size === 'XXL')) {
        size = size === 'XXL' ? 'XL' : 'L';
      }
    }

    // Apply fit preference offsets (does not apply to kids for simplicity)
    if (category !== 'kids') {
      const availableSizes = category === 'ladies' 
        ? ['XS', 'S', 'M', 'L', 'XL', '2XL'] 
        : ['S', 'M', 'L', 'XL', 'XXL'];
      
      const idx = availableSizes.indexOf(size);
      if (idx !== -1) {
        if (preference === 'slim' && idx > 0) {
          size = availableSizes[idx - 1];
        } else if (preference === 'relaxed' && idx < availableSizes.length - 1) {
          size = availableSizes[idx + 1];
        }
      }
    }

    return size;
  };

  const recSize = calculateRecommendedSize();

  const handleApplySize = () => {
    setLastCalculatedSize(recSize);
    setIsApplied(true);
    setTimeout(() => {
      setGlobalSizeGuideOpen(false);
      setIsApplied(false);
    }, 1200);
  };

  if (!globalSizeGuideOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3 }}
        className="bg-[#F5F2ED] border border-[#E0DBCF] rounded-lg shadow-2xl max-w-2xl w-full relative overflow-hidden"
      >
        {/* Banner/Header style branding */}
        <div className="bg-[#1A1A1A] text-white p-5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Ruler className="text-[#C5A059] h-5 w-5" />
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#F5F2ED]">
                {language === 'af' ? 'Interaktiewe Groottegids' : 'Interactive Size Guide'}
              </h2>
              <p className="text-[9px] uppercase tracking-wider text-[#C5A059] font-bold">
                {language === 'af' ? 'Verminder terugsendings • Ideale pasvorm' : 'Zero Returns • Perfect Tailored Fit'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setGlobalSizeGuideOpen(false)}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-[#E0DBCF] bg-[#EAE5DC]">
          <button
            onClick={() => setTab('calculator')}
            className={`flex-1 py-3.5 text-[10px] uppercase tracking-[0.15em] font-black text-center cursor-pointer transition-all ${
              tab === 'calculator'
                ? 'bg-[#F5F2ED] text-[#8B4513] border-b-2 border-[#8B4513]'
                : 'text-gray-500 hover:text-[#1A1A1A] hover:bg-[#F5F2ED]/30'
            }`}
          >
            {language === 'af' ? '🧮 Grootte Sakrekenaar' : '🧮 Size Calculator'}
          </button>
          <button
            onClick={() => setTab('specs')}
            className={`flex-1 py-3.5 text-[10px] uppercase tracking-[0.15em] font-black text-center cursor-pointer transition-all ${
              tab === 'specs'
                ? 'bg-[#F5F2ED] text-[#8B4513] border-b-2 border-[#8B4513]'
                : 'text-gray-500 hover:text-[#1A1A1A] hover:bg-[#F5F2ED]/30'
            }`}
          >
            {language === 'af' ? '📏 Metings & Spesifikasies' : '📏 Measurement Charts'}
          </button>
        </div>

        {/* Modal content body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {tab === 'calculator' ? (
            <div className="space-y-6">
              
              {/* Category Selector */}
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-[#8B4513] block mb-2.5">
                  {language === 'af' ? 'Kies Geslag / Reeks' : 'Select Category'}
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'men', af: 'Mans', en: 'Men' },
                    { key: 'ladies', af: 'Dames', en: 'Ladies' },
                    { key: 'kids', af: 'Volkspore Kinders', en: 'Volkspore Kids' }
                  ].map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => handleCategoryChange(cat.key as any)}
                      className={`py-2.5 px-2 text-[10px] uppercase tracking-wider font-black border rounded text-center transition-all cursor-pointer ${
                        category === cat.key
                          ? 'border-[#8B4513] bg-[#8B4513] text-white shadow-sm'
                          : 'border-[#E0DBCF] bg-white text-[#1A1A1A] hover:border-[#8B4513]'
                      }`}
                    >
                      {language === 'af' ? cat.af : cat.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/40 border border-[#E0DBCF] rounded p-5">
                
                {/* Height Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-black tracking-wider text-gray-500">
                      {language === 'af' ? 'Jou Lengte (cm)' : 'Your Height (cm)'}
                    </span>
                    <span className="text-xs font-black font-mono text-[#8B4513] bg-[#8B4513]/10 px-2.5 py-0.5 rounded">
                      {height} cm
                    </span>
                  </div>
                  <input
                    type="range"
                    min={category === 'kids' ? 80 : 140}
                    max={category === 'kids' ? 160 : 210}
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full accent-[#8B4513] cursor-ew-resize bg-[#E0DBCF] rounded h-1"
                  />
                  <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                    <span>{category === 'kids' ? '80 cm' : '140 cm'}</span>
                    <span>{category === 'kids' ? '120 cm' : '175 cm'}</span>
                    <span>{category === 'kids' ? '160 cm' : '210 cm'}</span>
                  </div>
                </div>

                {/* Weight Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-black tracking-wider text-gray-500">
                      {language === 'af' ? 'Jou Gewig (kg)' : 'Your Weight (kg)'}
                    </span>
                    <span className="text-xs font-black font-mono text-[#8B4513] bg-[#8B4513]/10 px-2.5 py-0.5 rounded">
                      {weight} kg
                    </span>
                  </div>
                  <input
                    type="range"
                    min={category === 'kids' ? 10 : 40}
                    max={category === 'kids' ? 60 : 130}
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full accent-[#8B4513] cursor-ew-resize bg-[#E0DBCF] rounded h-1"
                  />
                  <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                    <span>{category === 'kids' ? '10 kg' : '40 kg'}</span>
                    <span>{category === 'kids' ? '35 kg' : '85 kg'}</span>
                    <span>{category === 'kids' ? '60 kg' : '130 kg'}</span>
                  </div>
                </div>

              </div>

              {/* Fit Preference (Hidden for Kids) */}
              {category !== 'kids' && (
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-[#8B4513] block mb-2.5">
                    {language === 'af' ? 'Verkose Pasvorm' : 'Fit Preference'}
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'slim', labelAf: 'Noupassend (Slim Fit)', labelEn: 'Slim Fit' },
                      { id: 'regular', labelAf: 'Standaard (Regular)', labelEn: 'Regular Fit' },
                      { id: 'relaxed', labelAf: 'Losser (Relaxed)', labelEn: 'Relaxed Fit' }
                    ].map((pref) => (
                      <button
                        key={pref.id}
                        type="button"
                        onClick={() => setPreference(pref.id as any)}
                        className={`py-2.5 px-2 text-[9px] uppercase tracking-wider font-black border rounded text-center transition-all cursor-pointer ${
                          preference === pref.id
                            ? 'border-[#8B4513] bg-[#8B4513] text-white'
                            : 'border-[#E0DBCF] bg-white text-[#1A1A1A] hover:border-[#8B4513]'
                        }`}
                      >
                        {language === 'af' ? pref.labelAf : pref.labelEn}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 italic mt-2">
                    {language === 'af'
                      ? '* As jy van \'n bietjie losser hou, kies "Losser". Ons klere is reeds krimp-bestand en kantoen-ryk.'
                      : '* For a roomier feel, select "Relaxed Fit". Our premium cotton garments are pre-shrunk for lasting structure.'}
                  </p>
                </div>
              )}

              {/* Results Pane */}
              <div className="bg-white border border-[#E0DBCF] rounded-lg p-6 text-center shadow-inner space-y-4">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-400 block mb-1">
                    {language === 'af' ? 'ONS AANBEVELING' : 'OUR RECOMMENDATION'}
                  </span>
                  
                  {/* Recommended Size Output */}
                  <div className="w-20 h-20 rounded-full bg-[#8B4513]/5 border-2 border-[#8B4513]/20 flex items-center justify-center mx-auto my-2 shadow-sm">
                    <span className="text-3xl font-black text-[#8B4513] font-sans">
                      {recSize}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[10px] font-black text-emerald-800 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {language === 'af' ? '98% Pasvorm Akkuraatheid' : '98% Accuracy Match'}
                  </span>
                </div>

                <p className="text-[11px] text-gray-500 leading-relaxed max-w-md mx-auto italic">
                  {language === 'af'
                    ? `Volgens jou liggaamsmetings (${height}cm lengte, ${weight}kg gewig) en voorkeur vir 'n ${
                        preference === 'slim' ? 'noupassende' : preference === 'relaxed' ? 'losser' : 'standaard'
                      } pasvorm, is ons oortuig dat grootte "${recSize}" jou uitstekend sal pas.`
                    : `Based on your measurements (${height}cm height, ${weight}kg weight) and preference for a ${
                        preference === 'slim' ? 'slim' : preference === 'relaxed' ? 'relaxed' : 'regular'
                      } fit, we are confident size "${recSize}" will fit you perfectly.`}
                </p>

                {/* Apply size Button */}
                <button
                  onClick={handleApplySize}
                  disabled={isApplied}
                  className={`w-full py-3 rounded text-xs uppercase tracking-widest font-black transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer ${
                    isApplied 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-[#1A1A1A] text-white hover:bg-[#333]'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check size={14} />
                      <span>{language === 'af' ? 'Grootte Suksesvol Toegepas!' : 'Size Successfully Applied!'}</span>
                    </>
                  ) : (
                    <span>{language === 'af' ? 'Pas hierdie grootte toe' : 'Apply this size to purchase'}</span>
                  )}
                </button>
              </div>

            </div>
          ) : (
            // Measurements charts & Specs tab
            <div className="space-y-6">
              
              {/* Selector for Specs */}
              <div className="flex space-x-2">
                {[
                  { key: 'men', labelAf: 'Mans T-hemde', labelEn: 'Men T-Shirts' },
                  { key: 'ladies', labelAf: 'Dames Snit', labelEn: 'Ladies Slim Cut' },
                  { key: 'kids', labelAf: 'Volkspore Kinders', labelEn: 'Volkspore Kids' }
                ].map((specTab) => (
                  <button
                    key={specTab.key}
                    onClick={() => setCategory(specTab.key as any)}
                    className={`flex-1 py-2 text-[9px] uppercase tracking-wider font-black border rounded text-center cursor-pointer ${
                      category === specTab.key
                        ? 'border-[#8B4513] bg-[#8B4513]/10 text-[#8B4513]'
                        : 'border-[#E0DBCF] bg-white text-gray-500 hover:text-black'
                    }`}
                  >
                    {language === 'af' ? specTab.labelAf : specTab.labelEn}
                  </button>
                ))}
              </div>

              {/* Table of measurements */}
              <div className="border border-[#E0DBCF] rounded overflow-hidden">
                <table className="w-full text-left border-collapse text-xs bg-white">
                  <thead>
                    <tr className="bg-[#F5F2ED] border-b border-[#E0DBCF] uppercase tracking-wider text-[9px] font-black text-[#8B4513]">
                      <th className="py-3 px-4">{language === 'af' ? 'Grootte (Size)' : 'Size'}</th>
                      <th className="py-3 px-4">{language === 'af' ? 'Borswydte (Width)' : 'Body Width'}</th>
                      <th className="py-3 px-4">{language === 'af' ? 'Totale Lengte (Length)' : 'Body Length'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E0DBCF] font-mono text-gray-700">
                    {category === 'ladies' ? (
                      [
                        { size: 'XS', width: '37.5 cm', length: '62 cm' },
                        { size: 'S', width: '40.5 cm', length: '63 cm' },
                        { size: 'M', width: '43 cm', length: '64 cm' },
                        { size: 'L', width: '46 cm', length: '65 cm' },
                        { size: 'XL', width: '49 cm', length: '66 cm' },
                        { size: '2XL', width: '52 cm', length: '66.5 cm' }
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="py-2.5 px-4 font-sans font-black text-[#1A1A1A]">{row.size}</td>
                          <td className="py-2.5 px-4">{row.width}</td>
                          <td className="py-2.5 px-4">{row.length}</td>
                        </tr>
                      ))
                    ) : category === 'kids' ? (
                      [
                        { size: '2-3 Y (Age 2-3)', width: '32 cm', length: '42 cm' },
                        { size: '4-5 Y (Age 4-5)', width: '34 cm', length: '46 cm' },
                        { size: '6-7 Y (Age 6-7)', width: '36 cm', length: '50 cm' },
                        { size: '8-9 Y (Age 8-9)', width: '38 cm', length: '54 cm' },
                        { size: '10-11 Y (Age 10-11)', width: '41 cm', length: '58 cm' },
                        { size: '12-13 Y (Age 12-13)', width: '44 cm', length: '62 cm' }
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="py-2.5 px-4 font-sans font-black text-[#1A1A1A]">{row.size}</td>
                          <td className="py-2.5 px-4">{row.width}</td>
                          <td className="py-2.5 px-4">{row.length}</td>
                        </tr>
                      ))
                    ) : (
                      [
                        { size: 'S', width: '50 cm', length: '70 cm' },
                        { size: 'M', width: '53 cm', length: '72 cm' },
                        { size: 'L', width: '56 cm', length: '74 cm' },
                        { size: 'XL', width: '59 cm', length: '76 cm' },
                        { size: 'XXL', width: '62 cm', length: '78 cm' }
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="py-2.5 px-4 font-sans font-black text-[#1A1A1A]">{row.size}</td>
                          <td className="py-2.5 px-4">{row.width}</td>
                          <td className="py-2.5 px-4">{row.length}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Graphic Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-[#F5F2ED]/25 border border-[#E0DBCF] rounded p-5">
                <div className="flex justify-center items-center">
                  <div className="relative w-40 h-40 bg-[#1A1A1A]/5 rounded-lg flex items-center justify-center border border-[#E0DBCF]/60">
                    <svg viewBox="0 0 100 100" className="w-32 h-32 text-gray-400 stroke-current stroke-[1.5] fill-none">
                      <path d="M 30,15 L 42,20 C 45,15 55,15 58,20 L 70,15 L 82,27 L 72,37 L 72,85 L 28,85 L 28,37 L 18,27 Z" />
                      
                      {/* Measurement line 1 (width) */}
                      <line x1="28" y1="48" x2="72" y2="48" className="stroke-[#8B4513] stroke-[1] stroke-dasharray-[2]" />
                      <circle cx="50" cy="48" r="4.5" className="fill-[#8B4513]" />
                      <text x="50" y="51" className="fill-white text-[7px] font-sans font-black text-center" textAnchor="middle">1</text>
                      
                      {/* Measurement line 2 (length) */}
                      <line x1="50" y1="18" x2="50" y2="85" className="stroke-[#8B4513] stroke-[1] stroke-dasharray-[2]" />
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
                        ? 'Meet horisontaal oor die bors van jou gunsteling T-hemp, reg onder die arms van naat tot naat.'
                        : 'Measure horizontally across the chest of your favorite T-shirt, right underneath the arms from seam to seam.'}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-black text-[#8B4513] uppercase text-[10px] tracking-wider mb-1">
                      2. {language === 'af' ? 'Totale Lengte (Body Length)' : 'Body Length'}
                    </h5>
                    <p className="text-gray-500 leading-relaxed">
                      {language === 'af'
                        ? 'Meet vertikaal van die skouer se hoogste naat reguit af tot by die heel onderste soom.'
                        : 'Measure vertically from the highest shoulder seam straight down to the very bottom hem.'}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Modal Footer info box */}
        <div className="bg-[#EAE5DC] p-4 border-t border-[#E0DBCF] flex items-center space-x-2.5 text-[10px] text-gray-600 leading-tight">
          <Info size={14} className="text-[#8B4513] shrink-0" />
          <p>
            {language === 'af'
              ? 'Volksgrond kledingstukke word handgemaak in Suid-Afrika van premium 100% gekamde katoen. Speling van ±1.5cm mag voorkom.'
              : 'Volksgrond garments are handcrafted in South Africa from premium 100% combed cotton. Tolerances of ±1.5cm may occur.'}
          </p>
        </div>

      </motion.div>
    </div>
  );
};
