import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, MapPin, Calendar, CreditCard, Truck, CheckCircle, Package, ArrowRight, MessageSquare, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TrackOrderView: React.FC = () => {
  const { language, orders } = useApp();
  
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [searched, setSearched] = useState(false);
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<{ af: string; en: string } | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setErrorMsg(null);
    setSearchResult(null);

    const cleanId = orderId.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanId || !cleanEmail) {
      setErrorMsg({
        af: 'Voer asseblief beide jou Bestelling ID en E-posadres in.',
        en: 'Please enter both your Order ID and Email address.'
      });
      return;
    }

    // Support both VG-123456 and 123456 formats
    const searchId = cleanId.startsWith('VG-') ? cleanId : `VG-${cleanId}`;

    const match = orders.find(o => 
      o.id.toUpperCase() === searchId && 
      o.email.toLowerCase() === cleanEmail
    );

    if (match) {
      setSearchResult(match);
    } else {
      setErrorMsg({
        af: 'Geen bestelling gevind met daardie besonderhede nie. Kontroleer asseblief die Bestelling ID en e-pos en probeer weer.',
        en: 'No order found with those details. Please check the Order ID and email and try again.'
      });
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'pending': return 1;
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 1;
    }
  };

  const currentStep = searchResult ? getStatusStep(searchResult.status) : 1;

  const steps = [
    {
      step: 1,
      labelAf: 'Ontvang',
      labelEn: 'Received',
      descAf: 'Bestelling geregistreer en wag op betaling',
      descEn: 'Order registered and awaiting payment validation'
    },
    {
      step: 2,
      labelAf: 'Verpakking',
      labelEn: 'Packaging',
      descAf: 'Gemaak met sorg, gereed vir oordrag',
      descEn: 'Crafted with care, preparing for dispatch'
    },
    {
      step: 3,
      labelAf: 'Versend',
      labelEn: 'Shipped',
      descAf: 'Oorhandig aan koerier vir aflewering',
      descEn: 'Handed over to courier for transit'
    },
    {
      step: 4,
      labelAf: 'Afgelewer',
      labelEn: 'Delivered',
      descAf: 'Veilig by u bestemming afgelewer',
      descEn: 'Safely delivered at your destination'
    }
  ];

  const getShippingLabel = (method: string) => {
    switch (method) {
      case 'aramex-door':
        return language === 'af' ? 'Aramex Huis-tot-Deur' : 'Aramex Store-to-Door';
      case 'aramex-sleeve':
        return language === 'af' ? 'Aramex Sluitkas Toebroodjiesak' : 'Aramex Locker Sleeve';
      case 'postnet':
        return language === 'af' ? 'PostNet Toonbank-tot-Toonbank' : 'PostNet Counter-to-Counter';
      case 'courier-guy':
        return language === 'af' ? 'The Courier Guy Huis-tot-Deur' : 'The Courier Guy Door-to-Door';
      default:
        return language === 'af' ? 'Koerier' : 'Courier';
    }
  };

  const getTrackingLink = (method: string, trackingNumber: string) => {
    if (!trackingNumber) return null;
    const cleanNum = trackingNumber.trim();
    if (method.startsWith('aramex')) {
      return `https://www.aramex.com/za/en/track/results?shipmentNumber=${cleanNum}`;
    } else if (method === 'postnet') {
      return `https://www.postnet.co.za/tracker`;
    } else if (method === 'courier-guy') {
      return `https://portal.thecourierguy.co.za/track?tracking_number=${cleanNum}`;
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20" id="track-order-view-container">
      {/* View Header */}
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl font-black uppercase tracking-tight text-[#1A1A1A] font-sans">
          {language === 'af' ? 'Volg Jou Bestelling' : 'Track Your Order'}
        </h1>
        <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
          {language === 'af'
            ? 'Voer asseblief jou Bestelling ID (bv. VG-123456) en die e-posadres in wat gebruik is met die aankoop.'
            : 'Please enter your Order ID (e.g. VG-123456) and the email address used during purchase.'}
        </p>
      </div>

      {/* Search Form Card */}
      <div className="bg-white border border-[#E0DBCF] rounded-lg p-6 md:p-8 shadow-sm max-w-lg mx-auto">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1.5 block">
              {language === 'af' ? 'Bestelling ID' : 'Order ID'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-gray-400 font-bold font-mono">VG-</span>
              <input
                type="text"
                required
                value={orderId.replace(/^VG-/i, '')}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="104928"
                className="w-full bg-[#F5F2ED]/40 border border-[#E0DBCF] rounded p-2.5 pl-10 text-xs font-mono font-bold focus:outline-none focus:border-[#8B4513]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1.5 block">
              {language === 'af' ? 'E-posadres' : 'Email Address'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="u-naam@e-pos.co.za"
              className="w-full bg-[#F5F2ED]/40 border border-[#E0DBCF] rounded p-2.5 text-xs focus:outline-none focus:border-[#8B4513]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1A1A1A] hover:bg-[#8B4513] text-white rounded py-3 text-xs uppercase tracking-widest font-black transition-all shadow hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Search size={14} />
            <span>{language === 'af' ? 'Soek Bestelling' : 'Search Order'}</span>
          </button>
        </form>

        {/* Info banner - Premium Trust Builder */}
        <div className="mt-6 pt-6 border-t border-[#E0DBCF]/60 flex items-start space-x-3 text-[11px] text-gray-500 leading-relaxed">
          <CheckCircle className="text-[#8B4513] flex-shrink-0 mt-0.5" size={14} />
          <p>
            {language === 'af'
              ? 'Ons stuur ook outomatiese status-opdaterings direk na u WhatsApp en e-pos sodra u pakkie die depot verlaat.'
              : 'We also send automated status updates directly to your WhatsApp and email as soon as your package leaves the depot.'}
          </p>
        </div>
      </div>

      {/* Result Section */}
      <AnimatePresence mode="wait">
        {searched && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.3 }}
            className="mt-10"
          >
            {errorMsg && (
              <div className="max-w-lg mx-auto bg-red-50 border border-red-200 text-red-800 p-4 rounded text-xs flex items-start space-x-2.5">
                <AlertCircle className="flex-shrink-0 mt-0.5" size={14} />
                <span>{language === 'af' ? errorMsg.af : errorMsg.en}</span>
              </div>
            )}

            {searchResult && (
              <div className="bg-white border border-[#E0DBCF] rounded-lg p-6 md:p-10 shadow-md space-y-8">
                {/* Header Summary */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-[#E0DBCF] gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs uppercase bg-[#8B4513]/10 text-[#8B4513] font-black px-2.5 py-0.5 rounded tracking-wider">
                        {searchResult.status === 'delivered' 
                          ? (language === 'af' ? 'Afgelewer' : 'Delivered') 
                          : searchResult.status === 'shipped'
                          ? (language === 'af' ? 'Op Pad' : 'In Transit')
                          : (language === 'af' ? 'Verwerk' : 'Processing')}
                      </span>
                      <span className="text-gray-400 text-xs">|</span>
                      <span className="font-mono text-xs font-bold text-gray-500">{searchResult.id}</span>
                    </div>
                    <h2 className="text-lg font-black text-[#1A1A1A]">
                      {language === 'af' ? `Geagte ${searchResult.name}` : `Dear ${searchResult.name}`}
                    </h2>
                  </div>

                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center text-gray-400 space-x-1">
                      <Calendar size={14} />
                      <span className="font-mono">{searchResult.date}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Stepper Grid */}
                <div className="space-y-6">
                  <h3 className="text-xs uppercase tracking-widest font-black text-[#1A1A1A]">
                    {language === 'af' ? 'Aflewering Status' : 'Delivery Status'}
                  </h3>

                  {/* Desktop Stepper */}
                  <div className="hidden md:grid grid-cols-4 gap-4 relative">
                    {/* Connecting Bar */}
                    <div className="absolute top-4 left-[12.5%] right-[12.5%] h-0.5 bg-gray-100 z-0">
                      <div 
                        className="h-full bg-[#8B4513] transition-all duration-500"
                        style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                      />
                    </div>

                    {steps.map((st) => {
                      const isActive = currentStep >= st.step;
                      const isCurrent = currentStep === st.step;
                      return (
                        <div key={st.step} className="flex flex-col items-center text-center space-y-2.5 z-10">
                          <div className={`w-9.5 h-9.5 rounded-full flex items-center justify-center transition-all shadow ${
                            isCurrent 
                              ? 'bg-[#8B4513] text-white ring-4 ring-[#8B4513]/20 scale-110' 
                              : isActive 
                              ? 'bg-[#1A1A1A] text-white' 
                              : 'bg-white border border-[#E0DBCF] text-gray-400'
                          }`}>
                            {isActive ? <CheckCircle size={16} /> : <span className="font-mono text-xs font-bold">{st.step}</span>}
                          </div>
                          <div className="space-y-0.5">
                            <span className={`text-xs font-black uppercase tracking-wider block ${isActive ? 'text-[#1A1A1A]' : 'text-gray-400'}`}>
                              {language === 'af' ? st.labelAf : st.labelEn}
                            </span>
                            <span className="text-[10px] text-gray-400 max-w-[140px] block leading-relaxed mx-auto">
                              {language === 'af' ? st.descAf : st.descEn}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile Stepper (Vertical) */}
                  <div className="md:hidden space-y-6 pl-4 relative border-l border-[#E0DBCF]/80 ml-2">
                    {steps.map((st) => {
                      const isActive = currentStep >= st.step;
                      const isCurrent = currentStep === st.step;
                      return (
                        <div key={st.step} className="relative pl-6">
                          {/* Circle indicator */}
                          <div className={`absolute -left-[23px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center shadow ${
                            isCurrent 
                              ? 'bg-[#8B4513] text-white ring-4 ring-[#8B4513]/10' 
                              : isActive 
                              ? 'bg-[#1A1A1A] text-white' 
                              : 'bg-white border border-[#E0DBCF] text-gray-400'
                          }`}>
                            {isActive ? <CheckCircle size={12} /> : <span className="text-[10px] font-mono">{st.step}</span>}
                          </div>
                          <div className="space-y-0.5">
                            <span className={`text-xs font-black uppercase tracking-wider block ${isActive ? 'text-[#1A1A1A]' : 'text-gray-400'}`}>
                              {language === 'af' ? st.labelAf : st.labelEn}
                            </span>
                            <span className="text-[10px] text-gray-400 block leading-relaxed">
                              {language === 'af' ? st.descAf : st.descEn}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Shipping and courier details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#E0DBCF]/60">
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase font-black tracking-wider text-gray-400">
                      {language === 'af' ? 'Afleweringsopsie' : 'Delivery Method'}
                    </h4>
                    <div className="flex items-start space-x-2.5">
                      <Truck className="text-[#8B4513] flex-shrink-0" size={16} />
                      <div className="text-xs">
                        <strong className="text-[#1A1A1A] block font-bold">
                          {getShippingLabel(searchResult.shippingMethod)}
                        </strong>
                        <span className="text-gray-400 text-[10px]">
                          {language === 'af' ? 'Geadresseer na:' : 'Addressed to:'} {searchResult.address}, {searchResult.province}, {searchResult.postalCode}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase font-black tracking-wider text-gray-400">
                      {language === 'af' ? 'Dop-inligting' : 'Tracking Information'}
                    </h4>
                    {searchResult.trackingNumber ? (
                      <div className="space-y-2">
                        <div className="text-xs">
                          <span className="text-gray-400 block">{language === 'af' ? 'Vragbrief-nommer:' : 'Waybill number:'}</span>
                          <span className="font-mono font-bold text-[#1A1A1A] text-sm tracking-wider">{searchResult.trackingNumber}</span>
                        </div>
                        {getTrackingLink(searchResult.shippingMethod, searchResult.trackingNumber) ? (
                          <a
                            href={getTrackingLink(searchResult.shippingMethod, searchResult.trackingNumber)!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1.5 text-xs text-[#8B4513] hover:text-[#1A1A1A] font-bold transition-colors uppercase tracking-wider"
                          >
                            <span>{language === 'af' ? 'Dop Pakkie Aanlyn' : 'Track Package Online'}</span>
                            <ArrowRight size={12} />
                          </a>
                        ) : (
                          <p className="text-[10px] text-gray-400 italic">
                            {language === 'af' 
                              ? 'Gebruik asseblief hierdie nommer by u plaaslike koerier.' 
                              : 'Please reference this number with your local courier.'}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 bg-gray-50 border border-gray-100 p-3 rounded">
                        {language === 'af'
                          ? 'Sodra jou kledingstukke verpak en aan die koerier oorhandig is, sal u vragbriefnommer hier verskyn en via WhatsApp of E-pos gestuur word.'
                          : 'As soon as your apparel is packed and handed to the courier, your waybill number will appear here and will be shared via WhatsApp or Email.'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Items Summarized */}
                <div className="pt-6 border-t border-[#E0DBCF]/60">
                  <h4 className="text-[10px] uppercase font-black tracking-wider text-gray-400 mb-4">
                    {language === 'af' ? 'Bestelde Items' : 'Ordered Items'}
                  </h4>
                  <div className="divide-y divide-gray-100 text-xs">
                    {searchResult.items.map((item: any, idx: number) => {
                      const nameStr = language === 'af' ? item.productName.af : item.productName.en;
                      return (
                        <div key={idx} className="py-2.5 flex justify-between items-center">
                          <div>
                            <span className="font-bold text-[#1A1A1A]">{nameStr}</span>
                            <span className="text-gray-400 ml-2">
                              ({item.size} / {item.color})
                            </span>
                          </div>
                          <span className="font-mono text-gray-500 font-bold">
                            {item.quantity} x R{item.price.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Need Help? WhatsApp CTA */}
                <div className="bg-[#F5F2ED] border border-[#E0DBCF] p-5 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-10 h-10 rounded-full bg-[#8B4513]/10 text-[#8B4513] flex items-center justify-center flex-shrink-0">
                      <MessageSquare size={18} />
                    </div>
                    <div className="text-xs">
                      <strong className="font-bold text-[#1A1A1A] block">
                        {language === 'af' ? 'Het u hulp nodig met u aflewering?' : 'Need help with your delivery?'}
                      </strong>
                      <span className="text-gray-500">
                        {language === 'af' 
                          ? 'Ons kliëntediens is beskikbaar vir vinnige bystand via e-pos en WhatsApp.' 
                          : 'Our support team is available for fast assistance via email and WhatsApp.'}
                      </span>
                    </div>
                  </div>

                  <a
                    href="https://wa.me/27648532434"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-xs uppercase tracking-wider font-bold shadow transition-colors cursor-pointer"
                  >
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
