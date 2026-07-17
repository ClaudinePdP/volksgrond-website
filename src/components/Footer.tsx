import React from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Phone, MapPin, Landmark, ShieldCheck, Ruler } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setView, setGlobalSizeGuideOpen } = useApp();

  const handleNav = (targetView: any) => {
    setView(targetView);
  };

  return (
    <footer className="bg-[#1A1A1A] text-[#F5F2ED] border-t border-[#E0DBCF]/30 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Description Column */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter uppercase text-white">
              VOLKSGROND
            </span>
            <span className="text-[8px] tracking-[0.25em] font-black uppercase text-[#C5A059] -mt-1">
              {language === 'af' ? 'OORSPRONKLIKE DRAG' : 'ORIGINAL APPAREL'}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed max-w-xs">
            {language === 'af'
              ? 'Premium Suid-Afrikaanse erfenisdrag, spesiaal geweef vir die moderne gesin wat trots is op hul tradisies en die vryheid van ons bodem.'
              : 'Premium South African heritage wear, specially crafted for the modern family who are proud of their traditions and the freedom of our soil.'}
          </p>

          {/* Sociale Media Skakels / Social Media Links */}
          <div className="flex items-center space-x-3 pt-3">
            <a
              href="https://www.facebook.com/share/17bDNvXAdK/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#2A2A2A] hover:bg-[#C5A059] hover:text-black text-gray-300 flex items-center justify-center transition-all duration-300 border border-gray-800 hover:border-[#C5A059] hover:scale-105"
              title="Facebook"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/volksgrond?igsh=dW5ja2FmaHFvYTdl&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#2A2A2A] hover:bg-[#C5A059] hover:text-black text-gray-300 flex items-center justify-center transition-all duration-300 border border-gray-800 hover:border-[#C5A059] hover:scale-105"
              title="Instagram"
            >
              <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@claudine_pike_du_plessis?_r=1&_t=ZS-97s8iM34grp"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#2A2A2A] hover:bg-[#C5A059] hover:text-black text-gray-300 flex items-center justify-center transition-all duration-300 border border-gray-800 hover:border-[#C5A059] hover:scale-105"
              title="TikTok"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2a1 1 0 0 0-1 1v11.69A3.82 3.82 0 1 1 7.31 11a1 1 0 0 0 0-2 5.82 5.82 0 1 0 5.69 5.82V7.1a7.82 7.82 0 0 0 4.88-2.11 1 1 0 0 0-1.41-1.41 5.82 5.82 0 0 1-4.47 1.42V3a1 1 0 0 0-1-1z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-4">
          <h4 className="text-[10px] uppercase font-black tracking-widest text-[#C5A059]">
            {language === 'af' ? 'Inligtingskakels' : 'Quick Navigation'}
          </h4>
          <ul className="space-y-2.5 text-xs text-gray-400">
            <li>
              <button onClick={() => handleNav('home')} className="hover:text-white transition-colors cursor-pointer text-left">
                {language === 'af' ? 'Tuiste' : 'Home'}
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('shop')} className="hover:text-white transition-colors cursor-pointer text-left">
                {language === 'af' ? 'Koop Winkel' : 'Shop Collections'}
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('about')} className="hover:text-white transition-colors cursor-pointer text-left">
                {language === 'af' ? 'Ons Storie' : 'Our Story'}
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors cursor-pointer text-left">
                {language === 'af' ? 'Kontak Ons' : 'Contact Us'}
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('admin')} className="hover:text-white transition-colors cursor-pointer text-left text-xs font-bold text-[#C5A059]">
                {language === 'af' ? 'Handelaarsportaal (Admin)' : 'Merchant Portal (Admin)'}
              </button>
            </li>
          </ul>
        </div>

        {/* Legal Policies Column */}
        <div className="space-y-4">
          <h4 className="text-[10px] uppercase font-black tracking-widest text-[#C5A059]">
            {language === 'af' ? 'Handelsbeleide' : 'Store Policies'}
          </h4>
          <ul className="space-y-2.5 text-xs text-gray-400">
            <li>
              <button onClick={() => handleNav('shipping')} className="hover:text-white transition-colors cursor-pointer text-left">
                {language === 'af' ? 'Koerier & Aflewering' : 'Shipping Policy'}
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('returns')} className="hover:text-white transition-colors cursor-pointer text-left">
                {language === 'af' ? 'Terugsending & Ruilbeleid' : 'Returns & Exchanges'}
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('privacy')} className="hover:text-white transition-colors cursor-pointer text-left">
                {language === 'af' ? 'Privaatheidsbeleid' : 'Privacy Policy'}
              </button>
            </li>
            <li>
              <button onClick={() => handleNav('terms')} className="hover:text-white transition-colors cursor-pointer text-left">
                {language === 'af' ? 'Bepalings & Voorwaardes' : 'Terms & Conditions'}
              </button>
            </li>
          </ul>
        </div>

        {/* Contact/Support Column */}
        <div className="space-y-4">
          <h4 className="text-[10px] uppercase font-black tracking-widest text-[#C5A059]">
            {language === 'af' ? 'Kliëntediens' : 'Customer Care'}
          </h4>
          <ul className="space-y-3 text-xs text-gray-400">
            <li className="flex items-center space-x-2.5">
              <Mail size={12} className="text-[#C5A059]" />
              <a href="mailto:cbrduplessis.x2@gmail.com" className="hover:text-white transition-colors">cbrduplessis.x2@gmail.com</a>
            </li>
            <li className="flex items-center space-x-2.5">
              <Phone size={12} className="text-[#C5A059]" />
              <a href="tel:0648532434" className="hover:text-white transition-colors">064 853 2434</a>
            </li>
            <li className="flex items-center space-x-2.5">
              <MapPin size={12} className="text-[#C5A059]" />
              <span>
                {language === 'af' ? 'Rustenburg, Suid-Afrika' : 'Rustenburg, South Africa'}
              </span>
            </li>
            <li className="pt-2">
              <button
                onClick={() => setGlobalSizeGuideOpen(true)}
                className="flex items-center space-x-2 bg-[#C5A059] text-black font-black text-[9px] uppercase tracking-widest px-3 py-2 rounded shadow hover:bg-white hover:text-black transition-all cursor-pointer w-full text-center justify-center border border-[#C5A059]"
              >
                <Ruler size={11} />
                <span>{language === 'af' ? 'Interaktiewe Groottegids' : 'Interactive Size Guide'}</span>
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* Courier & Delivery banner - matching the Natural Tones specifications */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-gray-800 flex flex-col items-center justify-center text-[10px] uppercase font-black tracking-widest text-gray-400 gap-6">
        <div className="flex flex-wrap justify-center gap-6 md:gap-12">
          <div className="flex items-center">
            <span className="text-[#C5A059] mr-2">Koerier / Courier:</span>
            <span className="text-white">Aramex Store-to-Door</span>
          </div>
          <div className="flex items-center">
            <span className="text-[#C5A059] mr-2">Aflewering / Transit:</span>
            <span className="text-white">24 - 72 Uur / Hours</span>
          </div>
          <div className="flex items-center">
            <span className="text-[#C5A059] mr-2">Koste / Cost:</span>
            <span className="text-white">R99.99 Landwyd / Nationwide</span>
          </div>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="text-center text-[10px] text-gray-500 font-bold tracking-widest mt-12 uppercase space-y-1.5">
        <p>© {new Date().getFullYear()} Volksgrond (Pty) Ltd. Alle Regte Voorbehou. Suid-Afrikaanse Erfenisdrag.</p>
        <p className="text-[#C5A059]">
          {language === 'af' 
            ? 'Met trots geskep vir Volksgrond en my vrou deur Barend du Plessis.' 
            : 'Proudly created for Volksgrond and my wife by Barend du Plessis.'}
        </p>
      </div>
