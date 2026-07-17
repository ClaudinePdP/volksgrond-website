import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink, Calendar, Link as LinkIcon, Heart } from 'lucide-react';

export const GalleryLinksView: React.FC = () => {
  const { language, setView, galleryLinks } = useApp();

  const handleLinkClick = (url: string) => {
    if (!url) return;
    const trimmed = url.trim();
    
    // Check if it matches internal views
    if (trimmed === 'shop' || trimmed === '/shop') {
      setView('shop');
      return;
    }
    if (trimmed === 'about' || trimmed === '/about') {
      setView('about');
      return;
    }
    if (trimmed === 'contact' || trimmed === '/contact') {
      setView('contact');
      return;
    }

    // Otherwise treat as external link (auction, song, facebook page, etc.)
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      window.open(trimmed, '_blank', 'noopener,noreferrer');
    } else {
      // Append https:// for direct domains like www.auction.co.za or auction.co.za
      window.open(`https://${trimmed}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-12">
      {/* Back to Home Button */}
      <button
        onClick={() => setView('home')}
        className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-black text-gray-500 hover:text-[#1A1A1A] transition-colors cursor-pointer"
        id="btn-back-to-home"
      >
        <ArrowLeft size={14} />
        <span>{language === 'af' ? 'Terug na Tuisskerm' : 'Back to Home'}</span>
      </button>

      {/* Hero Banner Header */}
      <div 
        className="relative overflow-hidden rounded-lg bg-[#1A1A1A] py-16 px-6 text-center shadow-md border border-[#E0DBCF]/30"
        style={{
          backgroundImage: 'url(/src/assets/images/volksgrond_heritage_bg_1783548402167.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay to maintain superb readability */}
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[0.5px] pointer-events-none" />
        
        {/* Decorative radial lighting effect */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none" 
          style={{
            background: 'radial-gradient(circle at center, #8B4513 0%, transparent 80%)',
          }}
        />

        <div className="relative z-10 space-y-3">
          <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#C5A059]">
            {language === 'af' ? 'KUNS • ERFENIS • GEMEENSKAP' : 'ART • HERITAGE • COMMUNITY'}
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
            {language === 'af' ? 'Erfenis Galery & Skakels' : 'Heritage Gallery & Links'}
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[#F5F2ED]/70 max-w-xl mx-auto">
            {language === 'af' 
              ? 'Verken foto-versamelings van spesiale geleenthede en nuttige skakels na ons nuutste projekte.' 
              : 'Explore photo collections of special occasions and helpful links to our latest projects.'}
          </p>
          <div className="w-16 h-[2px] bg-[#C5A059] mx-auto mt-4"></div>
        </div>
      </div>

      {/* Gallery & Occasions Grid */}
      {galleryLinks && galleryLinks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryLinks.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white border border-[#E0DBCF] rounded overflow-hidden shadow-sm hover:border-[#8B4513] transition-all flex flex-col justify-between"
              id={`gallery-card-${item.id}`}
            >
              {/* Image Section */}
              <div className="relative aspect-[4/3] w-full bg-[#F5F2ED] overflow-hidden">
                <img
                  src={item.imageUrl || '/src/assets/images/volksgrond_heritage_bg_1783548402167.jpg'}
                  alt={language === 'af' ? item.titleAf : item.titleEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Visual Indicator of clickable gallery item */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/95 text-[#1A1A1A] font-black text-[9px] uppercase tracking-widest px-4 py-2.5 rounded shadow-md">
                    {language === 'af' ? 'Besoek Skakel' : 'Visit Link'}
                  </span>
                </div>
                
                {/* Occasion pill */}
                {(item.occasionAf || item.occasionEn) && (
                  <span className="absolute top-3 left-3 bg-[#1A1A1A] text-[#C5A059] text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-md border border-white/10">
                    {language === 'af' ? item.occasionAf : item.occasionEn}
                  </span>
                )}
              </div>

              {/* Text content & Details */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-base font-black uppercase text-[#1A1A1A] tracking-tight line-clamp-2">
                    {language === 'af' ? item.titleAf : item.titleEn}
                  </h3>
                  <div className="flex items-center space-x-2 text-[10px] text-gray-400">
                    <Calendar size={12} className="text-[#8B4513]" />
                    <span>{language === 'af' ? 'Spesiale Geleentheid' : 'Special Occasion'}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleLinkClick(item.linkUrl)}
                  className="w-full py-3 border border-[#E0DBCF] hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] text-[#1A1A1A] transition-all duration-300 font-bold text-[9px] uppercase tracking-widest rounded flex items-center justify-center space-x-2 cursor-pointer"
                  id={`btn-gallery-link-${item.id}`}
                >
                  <LinkIcon size={12} />
                  <span>{language === 'af' ? 'Besoek Bestemming' : 'Visit Destination'}</span>
                  {item.linkUrl && (item.linkUrl.startsWith('http') ? <ExternalLink size={10} className="opacity-60" /> : null)}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-[#F5F2ED]/30 border border-[#E0DBCF]/60 rounded-lg space-y-4 max-w-xl mx-auto px-6">
          <Heart size={36} className="text-[#C5A059] mx-auto animate-pulse" />
          <p className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide">
            {language === 'af' ? 'Geen Galery-skakels Beskikbaar' : 'No Gallery Links Available'}
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            {language === 'af' 
              ? 'Daar is tans geen aktiewe geleentheid skakels opgelaai nie. Gaan asb. na die administrasie paneel om items by te voeg.' 
              : 'There are currently no active occasion links uploaded. Please visit the admin panel to add some items.'}
          </p>
        </div>
      )}
    </div>
  );
};
