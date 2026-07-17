import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Winkel } from './components/Winkel';
import { ProductDetails } from './components/ProductDetails';
import { CartView } from './components/CartView';
import { CheckoutView } from './components/CheckoutView';
import { AdminDashboard } from './components/AdminDashboard';
import { TrackOrderView } from './components/TrackOrderView';
import { PolicyViews } from './components/PolicyViews';
import { GalleryLinksView } from './components/GalleryLinksView';
import { Footer } from './components/Footer';
import { InteractiveSizeGuideModal } from './components/InteractiveSizeGuideModal';
import { ShieldCheck, Truck, RotateCcw, Heart, ArrowRight, Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Subcomponent for the Home view modules to keep code clean and modular
const HomeView: React.FC = () => {
  const { language, setView, setCategoryFilter, products, toggleWishlist, wishlist } = useApp();

  const handleCategoryClick = (catKey: any) => {
    setCategoryFilter(catKey);
    setView('shop');
  };

  // Best selling products preview (prioritizes home_featured display type, falls back to first products)
  const bestSellers = React.useMemo(() => {
    const featured = products.filter(p => p.displayLocation === 'home_featured');
    if (featured.length >= 3) {
      return featured.slice(0, 3);
    }
    const remaining = products.filter(p => p.displayLocation !== 'home_featured');
    return [...featured, ...remaining].slice(0, 3);
  }, [products]);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero section */}
      <Hero />

      {/* Featured Collection Categories Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-3 mb-12">
          <span className="text-[10px] uppercase tracking-[0.25em] font-black text-[#8B4513]">
            {language === 'af' ? 'KATEGORIEË' : 'CATEGORIES'}
          </span>
          <h2 className="text-3xl font-black uppercase tracking-tight text-[#1A1A1A]">
            {language === 'af' ? 'Ontdek Ons Reekse' : 'Explore Our Ranges'}
          </h2>
          <div className="w-12 h-[2px] bg-[#8B4513] mx-auto mt-4"></div>
        </div>

        {/* Categories Grid (Natural/Slate Bento feel) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {([
            { key: 'men', title: { af: 'Mans T-Hempte', en: 'Men\'s T-Shirts' }, desc: { af: 'Stoer & Duursaam', en: 'Rugged & Durable' }, img: '/src/assets/images/erfenis_black_tshirt_1783544659803.jpg' },
            { key: 'ladies', title: { af: 'Dames T-Hempte', en: 'Ladies T-Shirts' }, desc: { af: 'Kwaliteit & Gerief', en: 'Quality & Comfort' }, img: '/src/assets/images/boerekrygers_white_tshirt_1783544674183.jpg' },
            { key: 'volkspore', title: { af: 'Volkspore Kinders', en: 'Volkspore Kids' }, desc: { af: 'Vir die Kleinspan', en: 'For the Little Ones' }, img: '/src/assets/images/volkspore_kids_tshirt_1783544715921.jpg' },
            { key: 'caps', title: { af: 'Kepse & Bykomstighede', en: 'Caps & Accessories' }, desc: { af: 'Verstelbaar & Stylvol', en: 'Adjustable & Stylish' }, img: '/src/assets/images/boerekrygers_sand_cap_1783544687518.jpg' }
          ] as const).map((cat) => (
            <div
              key={cat.key}
              onClick={() => handleCategoryClick(cat.key)}
              className="group relative h-[380px] bg-stone-900 overflow-hidden rounded border border-[#E0DBCF]/40 cursor-pointer shadow-sm transition-all hover:scale-[1.01]"
            >
              {/* Cover Image */}
              <img
                src={cat.img}
                alt={cat.title.af}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
              />
              
              {/* Dark overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

              {/* Text content aligned inside */}
              <div className="absolute bottom-6 left-6 right-6 text-[#F5F2ED] space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-bold">
                  {language === 'af' ? cat.desc.af : cat.desc.en}
                </span>
                <h3 className="text-lg font-black uppercase tracking-tight">
                  {language === 'af' ? cat.title.af : cat.title.en}
                </h3>
                <div className="pt-2 text-[9px] uppercase tracking-widest font-bold text-white flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>{language === 'af' ? 'Sien Reeks' : 'View Range'}</span>
                  <ArrowRight size={10} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers Highlight Slider */}
      <section className="bg-[#E0DBCF]/20 py-16 border-y border-[#E0DBCF]/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-black text-[#8B4513] block mb-2">
                {language === 'af' ? 'GEWILDE PRODUKTE' : 'POPULAR PICKS'}
              </span>
              <h2 className="text-3xl font-black uppercase tracking-tight text-[#1A1A1A]">
                {language === 'af' ? 'Gewildste Kampioene' : 'Customer Favorites'}
              </h2>
            </div>
            <button
              onClick={() => { setCategoryFilter(null); setView('shop'); }}
              className="mt-4 md:mt-0 text-xs uppercase tracking-widest font-black text-[#8B4513] hover:text-[#1A1A1A] underline cursor-pointer"
            >
              {language === 'af' ? 'Sien Almal' : 'See Full Catalog'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {bestSellers.map((prod) => {
              const isWish = wishlist.includes(prod.id);
              return (
                <div
                  key={prod.id}
                  onClick={() => { setCategoryFilter(null); setView('shop'); }}
                  className="bg-white border border-[#E0DBCF] rounded p-5 hover:border-gray-400 cursor-pointer group shadow-sm transition-all"
                >
                  <div className="relative aspect-square bg-[#F5F2ED] rounded overflow-hidden mb-4">
                    <img
                      src={prod.images[0]}
                      alt={prod.name.af}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {prod.isPromo && (
                      <span className="absolute top-2.5 left-2.5 bg-[#D4AF37] text-[#1A1A1A] text-[7px] font-black uppercase tracking-wider px-2 py-1 rounded shadow-md border border-[#C5A059] z-10">
                        {language === 'af' ? 'Spesiale promosie aanbieding' : 'Special promotion'}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(prod.id);
                      }}
                      className="absolute top-2.5 right-2.5 bg-white p-2 rounded-full shadow hover:scale-105 transition-all cursor-pointer z-10"
                    >
                      <Heart size={14} fill={isWish ? '#8B4513' : 'none'} stroke={isWish ? '#8B4513' : '#1A1A1A'} />
                    </button>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[8px] bg-[#E0DBCF] text-[#8B4513] px-2 py-0.5 rounded uppercase font-black tracking-widest">
                        {language === 'af' ? prod.categoryLabel.af : prod.categoryLabel.en}
                      </span>
                      {prod.isPromo && (
                        <span className="text-[8px] font-black text-[#8B4513] uppercase tracking-wider">
                          ★ {language === 'af' ? 'PROMOSIE' : 'PROMO'}
                        </span>
                      )}
                    </div>
                    <h3 className="font-black text-sm uppercase text-[#1A1A1A] tracking-tight">
                      {language === 'af' ? prod.name.af : prod.name.en}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest">
                    R{prod.price.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Bullet Pillars Section */}
      <section className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Local Manufacturing Bullet */}
        <div className="flex flex-col items-center text-center space-y-3 p-6 border border-[#E0DBCF] bg-white rounded shadow-sm">
          <div className="w-12 h-12 bg-[#8B4513]/10 text-[#8B4513] rounded-full flex items-center justify-center">
            <ShieldCheck size={22} />
          </div>
          <h4 className="font-black text-xs uppercase text-[#1A1A1A] tracking-wider">
            {language === 'af' ? '100% Plaaslik Vervaardig' : '100% Locally Made'}
          </h4>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            {language === 'af'
              ? 'Elke t-hemp word met absolute Suid-Afrikaanse trots geweef en afgewerk om maksimum duursaamheid en gerief te verseker.'
              : 'Every single t-shirt is stitched and packaged with absolute South African pride ensuring maximum longevity and comfort.'}
          </p>
        </div>

        {/* Courier Shipping Bullet */}
        <div className="flex flex-col items-center text-center space-y-3 p-6 border border-[#E0DBCF] bg-white rounded shadow-sm">
          <div className="w-12 h-12 bg-[#C5A059]/10 text-[#C5A059] rounded-full flex items-center justify-center">
            <Truck size={22} />
          </div>
          <h4 className="font-black text-xs uppercase text-[#1A1A1A] tracking-wider">
            {language === 'af' ? 'Aramex Flits-Aflewering' : 'Aramex Fast Shipping'}
          </h4>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            {language === 'af'
              ? 'Direkte en veilige Store-to-Door aflewering landwyd binne 24 - 72 uur. Opspoor en SMS dop-nommers word dadelik gestuur.'
              : 'Direct secure Store-to-Door courier transit nationwide in 24 - 72 hours. Live SMS tracking updates on transit milestones.'}
          </p>
        </div>

        {/* Free Exchanges Bullet */}
        <div className="flex flex-col items-center text-center space-y-3 p-6 border border-[#E0DBCF] bg-white rounded shadow-sm">
          <div className="w-12 h-12 bg-[#1A1A1A]/10 text-[#1A1A1A] rounded-full flex items-center justify-center">
            <RotateCcw size={22} />
          </div>
          <h4 className="font-black text-xs uppercase text-[#1A1A1A] tracking-wider">
            {language === 'af' ? '14-Dae Ruilwaarborg' : '14-Day Exchanges'}
          </h4>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            {language === 'af'
              ? 'Nie heeltemal tevrede met jou grootte nie? Ruil dit vinnig en deursigtig uit binne 14 dae vir die perfekte pasvorm.'
              : 'Unsure about your selected size? Send it back and exchange it easily within 14 days for a flawless fit.'}
          </p>
        </div>

      </section>
    </div>
  );
};

// Main App Router and Container component
const AppContent: React.FC = () => {
  const { view, setView, language, updateOrderStatus, orders, isAnnouncementEnabled, announcementText } = useApp();

  const [announcementDismissed, setAnnouncementDismissed] = React.useState<boolean>(() => {
    return sessionStorage.getItem('vg_announcement_dismissed') === 'true';
  });

  const handleDismissAnnouncement = () => {
    sessionStorage.setItem('vg_announcement_dismissed', 'true');
    setAnnouncementDismissed(true);
  };

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');
    const payment = params.get('payment');

    if (orderId && payment) {
      if (payment === 'success') {
        updateOrderStatus(orderId, 'processing');
        alert(
          language === 'af'
            ? `Veilige betaling suksesvol voltooi vir Bestelling ${orderId}! Dankie vir u ondersteuning.`
            : `Secure payment successfully completed for Order ${orderId}! Thank you for your support.`
        );
      } else if (payment === 'cancel') {
        alert(
          language === 'af'
            ? `Betaling is gekanselleer of nie voltooi vir Bestelling ${orderId} nie.`
            : `Payment was cancelled or not completed for Order ${orderId}.`
        );
      }
      // Clean query parameters from URL without reloading
      window.history.replaceState({}, document.title, window.location.pathname);
      setView('track-order');
    }
  }, [orders, setView, updateOrderStatus, language]);

  const renderActiveView = () => {
    switch (view) {
      case 'home':
        return <HomeView />;
      case 'shop':
        return <Winkel />;
      case 'product-details':
        return <ProductDetails />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'admin':
        return <AdminDashboard />;
      case 'gallery-links':
        return <GalleryLinksView />;
      case 'track-order':
        return <TrackOrderView />;
      case 'about':
        return <PolicyViews type="about" />;
      case 'contact':
        return <PolicyViews type="contact" />;
      case 'shipping':
        return <PolicyViews type="shipping" />;
      case 'returns':
        return <PolicyViews type="returns" />;
      case 'privacy':
        return <PolicyViews type="privacy" />;
      case 'terms':
        return <PolicyViews type="terms" />;
      default:
        return <HomeView />;
    }
  };

  const whatsappUrl = language === 'af'
    ? 'https://wa.me/27648532434?text=Hallo%20Volksgrond!%20Ek%20wil%20graag%20meer%20uitvind%20oor%20julle%20produkte.'
    : 'https://wa.me/27648532434?text=Hello%20Volksgrond!%20I%20would%20like%20to%20find%20out%20more%20about%20your%20products.';

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#1A1A1A] font-sans flex flex-col justify-between relative">
      <div>
        <Header />
        
        {/* Core View Switch with AnimatePresence Page Transition */}
        <main className="min-h-[60vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating WhatsApp Customer Support Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#25D366] hover:bg-[#20ba56] text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transition-all group relative border border-[#1ebd50]"
          id="whatsapp-floating-btn"
          title={language === 'af' ? 'Gesels met ons op WhatsApp' : 'Chat with us on WhatsApp'}
        >
          {/* Badge label tooltip */}
          <span className="absolute right-full mr-3 bg-[#1A1A1A] text-[#F5F2ED] text-[9px] uppercase tracking-[0.2em] font-black px-3 py-2 rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none border border-[#E0DBCF]/20 font-mono translate-x-2 group-hover:translate-x-0">
            {language === 'af' ? 'KLIËNTEDIENS' : 'CUSTOMER SUPPORT'}
          </span>
          
          {/* WhatsApp SVG Icon */}
          <svg
            className="w-6 h-6 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </motion.a>
      </div>

      <Footer />
      <AnimatePresence>
        <InteractiveSizeGuideModal />
      </AnimatePresence>
      <AnimatePresence>
        {isAnnouncementEnabled && view === 'home' && !announcementDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-6 z-50 max-w-[340px] bg-white border border-[#E0DBCF] shadow-[0_10px_30px_rgba(0,0,0,0.15)] rounded-lg p-5 flex flex-col gap-3"
            id="announcement-floating-popup"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-[#F5F2ED] text-[#8B4513] shrink-0">
                <Bell size={18} className="animate-bounce" />
              </div>
              <div className="flex-1">
                <h4 className="text-[11px] uppercase tracking-[0.2em] font-black text-[#8B4513] font-mono mb-1">
                  {language === 'af' ? 'AANKONDIGING' : 'ANNOUNCEMENT'}
                </h4>
                <p className="text-xs text-[#2A2A2A] leading-relaxed font-sans font-medium">
                  {announcementText}
                </p>
              </div>
              <button
                onClick={handleDismissAnnouncement}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex justify-end pt-1">
              <button
                onClick={handleDismissAnnouncement}
                className="px-4 py-1.5 bg-[#1A1A1A] hover:bg-[#8B4513] text-[#F5F2ED] hover:text-white text-[10px] uppercase tracking-wider font-bold rounded shadow transition-all duration-300 cursor-pointer border border-[#1A1A1A]"
              >
                {language === 'af' ? 'Verstaan' : 'Got it'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
