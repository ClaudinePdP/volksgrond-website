import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { ShieldCheck, Truck, Check, HelpCircle, ArrowLeft, Landmark, CreditCard, Sparkles, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PROVINCES = [
  { value: 'GP', label: 'Gauteng' },
  { value: 'WC', label: 'Western Cape (Wes-Kaap)' },
  { value: 'KZN', label: 'KwaZulu-Natal' },
  { value: 'EC', label: 'Eastern Cape (Oos-Kaap)' },
  { value: 'FS', label: 'Free State (Vrystaat)' },
  { value: 'MP', label: 'Mpumalanga' },
  { value: 'NW', label: 'North West (Noordwes)' },
  { value: 'LP', label: 'Limpopo' },
  { value: 'NC', label: 'Northern Cape (Noord-Kaap)' }
];

export const CheckoutView: React.FC = () => {
  const {
    language,
    cart,
    appliedDiscount,
    submitOrder,
    setView,
    payfastMerchantId,
    payfastMerchantKey
  } = useApp();

  // Form Field States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('GP');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [smsNotification, setSmsNotification] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Shipping & Payment selections
  const [shippingMethod, setShippingMethod] = useState<'aramex-door' | 'aramex-sleeve' | 'postnet' | 'courier-guy'>('aramex-door');
  const [paymentMethod, setPaymentMethod] = useState<'payfast' | 'eft'>('eft');

  // Checkout Stages
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percent) / 100 : 0;
  const discountedSubtotal = subtotal - discountAmount;

  // Determine shipping cost: No free shipping, flat rates apply
  const getShippingCost = (method: 'aramex-door' | 'aramex-sleeve' | 'postnet' | 'courier-guy') => {
    switch (method) {
      case 'aramex-door':
        return 99.99;
      case 'aramex-sleeve':
        return 89.99;
      case 'postnet':
        return 109.99;
      case 'courier-guy':
        return 99.99;
      default:
        return 99.99;
    }
  };
  const shippingCost = getShippingCost(shippingMethod);
  const grandTotal = discountedSubtotal + shippingCost;

  // Highlight if province is remote/outlying (e.g. Northern Cape, rural parts)
  const isOutlying = ['NC', 'LP', 'NW', 'EC'].includes(province);

  const getWhatsAppUrl = (order: Order) => {
    const phoneNumber = '27648532434';
    
    const itemsText = order.items.map(item => {
      const nameStr = language === 'af' ? item.productName.af : item.productName.en;
      const sizeLabel = language === 'af' ? 'Grootte' : 'Size';
      const colorLabel = language === 'af' ? 'Kleur' : 'Color';
      return `• ${item.quantity}x ${nameStr} (${sizeLabel}: ${item.size}, ${colorLabel}: ${item.color}) - R${(item.price * item.quantity).toFixed(2)}`;
    }).join('\n');

    const addressText = `${order.address}, ${order.province}, ${order.postalCode}`;
    const shippingMethodLabel = order.shippingMethod === 'aramex-door' 
      ? (language === 'af' ? 'Aramex Huis-tot-Deur' : 'Aramex Door-to-Door')
      : order.shippingMethod === 'aramex-sleeve'
      ? (language === 'af' ? 'Aramex Toebroodjiesak Afhaal' : 'Aramex Sleeve Pickup')
      : order.shippingMethod === 'postnet'
      ? (language === 'af' ? 'PostNet Toonbank-tot-Toonbank' : 'PostNet Counter-to-Counter')
      : (language === 'af' ? 'The Courier Guy Huis-tot-Deur' : 'The Courier Guy Door-to-Door');

    const message = language === 'af'
      ? `Hallo Volksgrond!\n\nEk het sopas 'n nuwe bestelling geplaas op julle webtuiste.\n\n*Bestelling ID:* ${order.id}\n*Naam:* ${order.name}\n*Selfoon:* ${order.phone}\n*E-pos:* ${order.email}\n*Afleweringsadres:* ${addressText}\n${order.notes ? `*Notas:* ${order.notes}\n` : ''}\n*Bestelde Items:*\n${itemsText}\n\n*Subtotaal:* R${order.subtotal.toFixed(2)}\n*Aflewering (${shippingMethodLabel}):* R${order.shippingCost.toFixed(2)}\n*Groot Totaal:* R${order.total.toFixed(2)}\n*Betalingsmetode:* ${order.paymentMethod.toUpperCase()}`
      : `Hello Volksgrond!\n\nI have just placed a new order on your website.\n\n*Order ID:* ${order.id}\n*Name:* ${order.name}\n*Mobile:* ${order.phone}\n*Email:* ${order.email}\n*Delivery Address:* ${addressText}\n${order.notes ? `*Notes:* ${order.notes}\n` : ''}\n*Ordered Items:*\n${itemsText}\n\n*Subtotal:* R${order.subtotal.toFixed(2)}\n*Shipping (${shippingMethodLabel}):* R${order.shippingCost.toFixed(2)}\n*Grand Total:* R${order.total.toFixed(2)}\n*Payment Method:* ${order.paymentMethod.toUpperCase()}`;

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert(language === 'af' ? 'Aanvaar asseblief eers die bepalings en voorwaardes.' : 'Please accept the terms and conditions first.');
      return;
    }

    if (paymentMethod === 'payfast') {
      alert(
        language === 'af'
          ? 'PayFast aanlyn betalings is tans besig met integrasie en sal binnekort beskikbaar wees. Gebruik asseblief Direkte Bank EFT vir die oomblik.'
          : 'PayFast online payments are currently being integrated and will be available soon. Please use Direct Bank EFT for now.'
      );
      setPaymentMethod('eft');
      return;
    }

    setIsSubmitting(true);

    try {
      // Small delay for professional UX feedback
      await new Promise(resolve => setTimeout(resolve, 1200));

      const order = await submitOrder({
        name,
        email,
        phone,
        address,
        province,
        postalCode,
        notes,
        shippingMethod,
        shippingCost,
        paymentMethod,
        smsNotification
      });

      if (paymentMethod === 'payfast') {
        // Build and submit form to PayFast Sandbox
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://sandbox.payfast.co.za/eng/process';

        const fields: Record<string, string> = {
          merchant_id: payfastMerchantId,
          merchant_key: payfastMerchantKey,
          return_url: `${window.location.origin}/?orderId=${order.id}&payment=success`,
          cancel_url: `${window.location.origin}/?orderId=${order.id}&payment=cancel`,
          name_first: name.split(' ')[0] || 'Kliënt',
          name_last: name.split(' ').slice(1).join(' ') || 'Volksgrond',
          email_address: email,
          m_payment_id: order.id,
          amount: grandTotal.toFixed(2),
          item_name: language === 'af' ? `Volksgrond Bestelling ${order.id}` : `Volksgrond Order ${order.id}`,
        };

        for (const key in fields) {
          if (Object.prototype.hasOwnProperty.call(fields, key)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = fields[key];
            form.appendChild(input);
          }
        }

        document.body.appendChild(form);
        form.submit();
      } else {
        setCreatedOrder(order);
      }
    } catch (err) {
      console.error(err);
      alert('Bestelling indiening het misluk. Probeer asseblief weer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnToShop = () => {
    setView('shop');
  };

  // SUCCESS PAGE
  if (createdOrder) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-[#E0DBCF] rounded-lg p-8 md:p-12 shadow-xl text-center space-y-6"
        >
          <div className="w-16 h-16 bg-[#C5A059]/10 text-[#C5A059] rounded-full flex items-center justify-center mx-auto shadow-md">
            <Check size={32} strokeWidth={3} />
          </div>

          <h1 className="text-3xl font-black uppercase tracking-tight text-[#1A1A1A]">
            {language === 'af' ? 'Dankie vir jou Ondersteuning!' : 'Thank you for your Support!'}
          </h1>
          
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            {language === 'af'
              ? `Jou bestelling (${createdOrder.id}) is suksesvol geplaas en word tans verwerk. Ons bou saam aan ons Suid-Afrikaanse erfenis.`
              : `Your order (${createdOrder.id}) has been successfully placed and is being processed. Together we build our South African heritage.`}
          </p>

          <div className="bg-[#F5F2ED] border border-[#E0DBCF] p-5 rounded text-left space-y-3 max-w-lg mx-auto">
            <h3 className="text-xs uppercase tracking-wider font-black text-[#1A1A1A]">
              {language === 'af' ? 'Bestelling Besonderhede' : 'Order Details'}
            </h3>
            <div className="text-[11px] text-gray-600 space-y-1.5 font-mono">
              <div><strong className="text-gray-500">Bestel ID / Order ID:</strong> {createdOrder.id}</div>
              <div><strong className="text-gray-500">Kliënt / Customer:</strong> {createdOrder.name}</div>
              <div><strong className="text-gray-500">Totaal betaal / Total Paid:</strong> R{createdOrder.total.toFixed(2)}</div>
              <div><strong className="text-gray-500">Aflewering / Shipping:</strong> {createdOrder.shippingMethod === 'aramex-door' ? 'Aramex Store-to-Door' : 'Aramex Sleeve Option'}</div>
              <div><strong className="text-gray-500">Metode / Payment:</strong> {createdOrder.paymentMethod.toUpperCase()}</div>
            </div>
          </div>

          {/* BANKING DETAILS FOR DIRECT EFT - REALISTIC & CRITICAL */}
          {createdOrder.paymentMethod === 'eft' && (
            <div className="bg-[#8B4513]/10 border-2 border-dashed border-[#8B4513] p-6 rounded-lg text-left max-w-lg mx-auto space-y-4">
              <div className="flex items-center space-x-2 text-[#8B4513] font-black uppercase text-xs tracking-wider">
                <Landmark size={16} />
                <span>Kritieke Bankbesonderhede vir EFT</span>
              </div>
              <p className="text-[10px] text-gray-600 leading-relaxed italic">
                {language === 'af'
                  ? 'Plaas asseblief jou EFT betaling onmiddellik en stuur jou bewys van betaling (POP) na cbrduplessis.x2@gmail.com om jou bestelling te bekragtig.'
                  : 'Please complete your bank transfer and email your proof of payment (POP) to cbrduplessis.x2@gmail.com to release your order.'}
              </p>
              <div className="bg-white p-4 border border-[#E0DBCF] rounded font-mono text-[11px] text-gray-700 space-y-1">
                <div><strong>Bank:</strong> Capitec Bank Business</div>
                <div><strong>Rekeninghouer:</strong> Volksgrond (Pty) Ltd</div>
                <div><strong>Rekeningnommer:</strong> 1548782910</div>
                <div><strong>Takkode:</strong> 470010</div>
                <div><strong>Verwysing:</strong> {createdOrder.id}</div>
              </div>
            </div>
          )}

          {/* WHATSAPP ORDER SUBMISSION BUTTON */}
          <div className="max-w-lg mx-auto bg-emerald-50 border border-emerald-200/60 p-6 rounded-lg text-center space-y-4 shadow-sm">
            <p className="text-xs text-emerald-800 font-bold leading-relaxed">
              {language === 'af' 
                ? 'Stuur jou bestelling vinnig na ons via WhatsApp vir blitsige verwerking en direkte diens!' 
                : 'Send your order details to us via WhatsApp for lightning-fast processing and direct support!'}
            </p>
            <a
              href={getWhatsAppUrl(createdOrder)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 w-full max-w-xs bg-[#25D366] hover:bg-[#20ba56] text-white font-black text-xs uppercase tracking-[0.15em] py-4 px-6 rounded shadow-md hover:shadow-lg transition-all"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>{language === 'af' ? 'Stuur via WhatsApp' : 'Send via WhatsApp'}</span>
            </a>
          </div>

          {/* Courier timeline notes */}
          <div className="flex items-center justify-center space-x-2 text-[10px] text-gray-400 uppercase tracking-widest pt-4">
            <Truck size={14} className="text-[#8B4513]" />
            <span>Aramex sal binne 24 - 72 uur aflewer. Opspoor kode sal per e-pos gestuur word.</span>
          </div>

          <button
            onClick={handleReturnToShop}
            className="inline-block bg-[#1A1A1A] hover:bg-[#333] text-white font-bold text-[10px] uppercase tracking-widest px-8 py-4 rounded transition-all cursor-pointer"
          >
            {language === 'af' ? 'Terug na Winkel' : 'Return to Shop'}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
      {/* Page Header */}
      <div className="border-b border-[#E0DBCF] pb-6 mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-black uppercase tracking-tight text-[#1A1A1A] flex items-center space-x-3">
          <ShieldCheck size={28} className="text-[#8B4513]" />
          <span>{language === 'af' ? 'Veilige Betaling' : 'Secure Checkout'}</span>
        </h1>
        <button
          onClick={() => setView('cart')}
          className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-black text-gray-500 hover:text-[#1A1A1A] cursor-pointer"
        >
          <ArrowLeft size={12} />
          <span>{language === 'af' ? 'Wysig Mandjie' : 'Edit Cart'}</span>
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">Jou mandjie is leeg. Kan nie checkout doen nie.</p>
          <button onClick={() => setView('shop')} className="bg-[#1A1A1A] text-white px-6 py-3 uppercase text-xs font-bold tracking-widest">
            Gaan na Winkel
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Side: Delivery Details Form */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Guest Details Panel */}
            <div className="bg-white border border-[#E0DBCF] rounded p-6 shadow-sm space-y-4">
              <h3 className="text-xs uppercase tracking-wider font-black text-[#1A1A1A] border-b border-[#E0DBCF]/70 pb-3">
                {language === 'af' ? '1. Afleweringsbesonderhede (Kliënt)' : '1. Delivery Details (Guest Checkout)'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1.5 block">
                    {language === 'af' ? 'Volle Naam & Van' : 'Full Name & Surname'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#F5F2ED]/40 border border-[#E0DBCF] rounded p-2.5 text-xs focus:outline-none focus:border-[#8B4513]"
                    placeholder="Bv. Pieter van der Merwe"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1.5 block">
                    {language === 'af' ? 'Selfoonnommer' : 'Mobile Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F5F2ED]/40 border border-[#E0DBCF] rounded p-2.5 text-xs focus:outline-none focus:border-[#8B4513]"
                    placeholder="Bv. 082 123 4567"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1.5 block">
                  {language === 'af' ? 'E-pos Adres' : 'Email Address'}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F5F2ED]/40 border border-[#E0DBCF] rounded p-2.5 text-xs focus:outline-none focus:border-[#8B4513]"
                  placeholder="Bv. pieter@gmail.com"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1.5 block">
                  {language === 'af' ? 'Fisiese Straatadres (Huis/Werk)' : 'Street Address (Home/Work)'}
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#F5F2ED]/40 border border-[#E0DBCF] rounded p-2.5 text-xs focus:outline-none focus:border-[#8B4513]"
                  placeholder="Bv. Kerkstraat 123, Pretoria-Oos"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1.5 block">
                    {language === 'af' ? 'Provinsie' : 'Province'}
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full bg-[#F5F2ED]/40 border border-[#E0DBCF] rounded p-2.5 text-xs focus:outline-none focus:border-[#8B4513] cursor-pointer"
                  >
                    {PROVINCES.map((prov) => (
                      <option key={prov.value} value={prov.value}>
                        {prov.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1.5 block">
                    {language === 'af' ? 'Poskode' : 'Postal Code'}
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-[#F5F2ED]/40 border border-[#E0DBCF] rounded p-2.5 text-xs focus:outline-none focus:border-[#8B4513]"
                    placeholder="Bv. 0181"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Options Selector */}
            <div className="bg-white border border-[#E0DBCF] rounded p-6 shadow-sm space-y-4">
              <h3 className="text-xs uppercase tracking-wider font-black text-[#1A1A1A] border-b border-[#E0DBCF]/70 pb-3 flex items-center justify-between">
                <span>{language === 'af' ? '2. Koerier- & Posopsies' : '2. Courier & Shipping Options'}</span>
                <span className="text-[9px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded">GEEN GRATIS AFLEWERING</span>
              </h3>

              <div className="space-y-3">
                {/* Aramex Door */}
                <label className={`border rounded p-4 flex items-start space-x-3 cursor-pointer transition-all ${
                  shippingMethod === 'aramex-door' ? 'border-[#8B4513] bg-[#8B4513]/5' : 'border-[#E0DBCF] hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'aramex-door'}
                    onChange={() => setShippingMethod('aramex-door')}
                    className="mt-1 accent-[#8B4513]"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex justify-between font-bold text-[#1A1A1A]">
                      <span>{language === 'af' ? 'Aramex Store-to-Door Koerier' : 'Aramex Store-to-Door Courier'}</span>
                      <span className="font-mono">R99.99</span>
                    </div>
                    <p className="text-gray-400 text-[10px] mt-1">
                      {language === 'af'
                        ? 'Afgelewer by jou huis- of werkadres binne 24 - 72 uur in hoofsentrums.'
                        : 'Delivered directly to your home or work address within 24 - 72 hours in main centres.'}
                    </p>
                  </div>
                </label>

                {/* Aramex Sleeve */}
                <label className={`border rounded p-4 flex items-start space-x-3 cursor-pointer transition-all ${
                  shippingMethod === 'aramex-sleeve' ? 'border-[#8B4513] bg-[#8B4513]/5' : 'border-[#E0DBCF] hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'aramex-sleeve'}
                    onChange={() => setShippingMethod('aramex-sleeve')}
                    className="mt-1 accent-[#8B4513]"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex justify-between font-bold text-[#1A1A1A]">
                      <span>{language === 'af' ? 'Aramex Toebroodjiesak (Sleeve) - Pak-en-Haal' : 'Aramex Sleeve Option - Pickup'}</span>
                      <span className="font-mono">R89.99</span>
                    </div>
                    <p className="text-gray-400 text-[10px] mt-1">
                      {language === 'af'
                        ? 'Afgelaai by jou naaste Pick n Pay, Checkers of FreshStop sluitkas vir maklike afhaal.'
                        : 'Shipped to your nearest Pick n Pay, Checkers, or FreshStop locker for easy collection.'}
                    </p>
                  </div>
                </label>

                {/* PostNet Counter-to-Counter */}
                <label className={`border rounded p-4 flex items-start space-x-3 cursor-pointer transition-all ${
                  shippingMethod === 'postnet' ? 'border-[#8B4513] bg-[#8B4513]/5' : 'border-[#E0DBCF] hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'postnet'}
                    onChange={() => setShippingMethod('postnet')}
                    className="mt-1 accent-[#8B4513]"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex justify-between font-bold text-[#1A1A1A]">
                      <span>{language === 'af' ? 'PostNet Toonbank-tot-Toonbank' : 'PostNet Counter-to-Counter'}</span>
                      <span className="font-mono">R109.99</span>
                    </div>
                    <p className="text-gray-400 text-[10px] mt-1">
                      {language === 'af'
                        ? 'Ideaal as jou area buite Aramex se bereik val. Afhaal by jou gekose plaaslike PostNet tak.'
                        : 'Perfect fallback option for outlying/remote areas. Pickup at your selected local PostNet branch.'}
                    </p>
                  </div>
                </label>

                {/* The Courier Guy */}
                <label className={`border rounded p-4 flex items-start space-x-3 cursor-pointer transition-all ${
                  shippingMethod === 'courier-guy' ? 'border-[#8B4513] bg-[#8B4513]/5' : 'border-[#E0DBCF] hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'courier-guy'}
                    onChange={() => setShippingMethod('courier-guy')}
                    className="mt-1 accent-[#8B4513]"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex justify-between font-bold text-[#1A1A1A]">
                      <span>{language === 'af' ? 'The Courier Guy Huis-tot-Deur' : 'The Courier Guy Door-to-Door'}</span>
                      <span className="font-mono">R99.99</span>
                    </div>
                    <p className="text-gray-400 text-[10px] mt-1">
                      {language === 'af'
                        ? 'Uitstekende en vinnige afleweringsopsie vir sowel stede as afgeleë/buitewyk provinsies.'
                        : 'Reliable door-to-door option, highly recommended for both major hubs and rural locations.'}
                    </p>
                  </div>
                </label>
              </div>

              {/* OUTLYING PROVINCE WARNING - INCREDIBLY COMPLIANT AND DETAILED */}
              {isOutlying && (
                <div className="bg-[#C5A059]/10 border border-[#C5A059]/40 p-4 rounded text-xs leading-relaxed text-gray-700 flex items-start space-x-2">
                  <Truck className="text-[#8B4513] flex-shrink-0 mt-0.5" size={14} />
                  <div>
                    <strong className="text-[#8B4513] uppercase text-[10px] tracking-wider block">Beraamde afleweringskoste vir buite-areas</strong>
                    <p className="text-[11px] mt-0.5 text-gray-600">
                      {language === 'af'
                        ? 'As u adres in \'n buite-area val, kan Aramex langer neem. Ons beveel aan dat u PostNet of The Courier Guy as alternatief oorweeg.'
                        : 'If your address is in an outlying area, Aramex delivery may take longer. We recommend selecting PostNet or The Courier Guy.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Selectors */}
            <div className="bg-white border border-[#E0DBCF] rounded p-6 shadow-sm space-y-4">
              <h3 className="text-xs uppercase tracking-wider font-black text-[#1A1A1A] border-b border-[#E0DBCF]/70 pb-3">
                {language === 'af' ? '3. Veilige Suid-Afrikaanse Betaling' : '3. Secure South African Payment'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* PayFast Gateway */}
                <label className={`border rounded p-4 flex flex-col justify-between items-start cursor-pointer transition-all ${
                  paymentMethod === 'payfast' ? 'border-[#8B4513] bg-[#8B4513]/5' : 'border-[#E0DBCF] hover:border-gray-400'
                }`}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'payfast'}
                        onChange={() => setPaymentMethod('payfast')}
                        className="accent-[#8B4513]"
                      />
                      <span className="font-bold text-xs text-[#1A1A1A] uppercase tracking-wider flex items-center space-x-1.5">
                        <CreditCard size={14} className="text-[#8B4513]" />
                        <span>{language === 'af' ? 'Aanlyn (PayFast)' : 'Online (PayFast)'}</span>
                      </span>
                    </div>
                    <span className="bg-[#8B4513]/10 text-[#8B4513] text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded">
                      {language === 'af' ? 'Binnekort' : 'Soon'}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-2 block font-medium leading-relaxed line-through">
                    {language === 'af'
                      ? 'Kaart, Capitec Pay & Instant EFT'
                      : 'Card, Capitec Pay & Instant EFT'}
                  </span>
                  <span className="text-[9px] text-gray-400 mt-1 block italic">
                    {language === 'af'
                      ? 'Integrasie tans aan die gang'
                      : 'Integration currently in progress'}
                  </span>
                </label>

                {/* Direct Bank EFT */}
                <label className={`border rounded p-4 flex flex-col justify-between items-start cursor-pointer transition-all ${
                  paymentMethod === 'eft' ? 'border-[#C5A059] bg-[#C5A059]/10 shadow-sm' : 'border-[#E0DBCF] hover:border-gray-400'
                }`}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'eft'}
                        onChange={() => setPaymentMethod('eft')}
                        className="accent-[#8B4513]"
                      />
                      <span className="font-bold text-xs text-[#1A1A1A] uppercase tracking-wider flex items-center space-x-1.5">
                        <Landmark size={14} className="text-[#8B4513]" />
                        <span>{language === 'af' ? 'Direkte Bank EFT' : 'Direct Bank EFT'}</span>
                      </span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded animate-pulse">
                      {language === 'af' ? 'Aktief' : 'Active'}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-700 mt-2 block font-bold leading-relaxed">
                    {language === 'af'
                      ? 'Oorplasing & Capitec POP'
                      : 'Bank Transfer & POP'}
                  </span>
                  <span className="text-[9px] text-gray-500 mt-1 block">
                    {language === 'af'
                      ? 'Veilige handmatige betaling met blitsige verwerking'
                      : '100% secure manual transfer with rapid processing'}
                  </span>
                </label>
              </div>

              {/* PayFast Integration Status Alert Block */}
              <div className="bg-amber-50 border border-amber-300/60 rounded p-4 text-xs leading-relaxed text-gray-700 space-y-1.5 animate-fade-in">
                <div className="flex items-center space-x-1.5 text-amber-800 font-black uppercase text-[9px] tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  <span>{language === 'af' ? 'Kennisgewing: PayFast Integrasie' : 'Notice: PayFast Integration'}</span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  {language === 'af'
                    ? 'Ons is tans besig met die finale stappe om ons veilige PayFast-aanlynbetalingstelsel te aktiveer. Vir die oomblik kan u u bestellings voltooi via ons ten volle geaktiveerde en veilige '
                    : 'We are completing the final steps of our secure PayFast online payment gateway setup. In the meantime, please complete your order using our fully active and secure '}
                  <strong className="text-[#8B4513]">
                    {language === 'af' ? 'Direkte Bank EFT (Oorplasing)' : 'Direct Bank EFT (Transfer)'}
                  </strong>.
                </p>
                <p className="text-[10px] text-gray-500 font-medium">
                  {language === 'af'
                    ? '💡 Na die indiening van jou bestelling, sal ons bankbesonderhede vertoon word. Stuur gerus jou bewys van betaling (POP) na cbrduplessis.x2@gmail.com of per WhatsApp vir blitsige versending!'
                    : '💡 Upon placing your order, our bank details will be shown. Please send your proof of payment (POP) to cbrduplessis.x2@gmail.com or via WhatsApp for immediate dispatch!'}
                </p>
              </div>
            </div>

            {/* Notes & Checkboxes */}
            <div className="bg-white border border-[#E0DBCF] rounded p-6 shadow-sm space-y-4">
              <div>
                <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1.5 block">
                  {language === 'af' ? 'Bestellingsnotas (Opsioneel)' : 'Order Notes (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#F5F2ED]/40 border border-[#E0DBCF] rounded p-2.5 text-xs focus:outline-none focus:border-[#8B4513]"
                  placeholder={language === 'af' ? 'Bv. Bel my by die hek of los by sekuriteit...' : 'E.g. Call at gate or leave with reception...'}
                />
              </div>

              {/* WhatsApp and Email Notification */}
              <label className="flex items-start space-x-2.5 text-xs text-gray-500 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={smsNotification}
                  onChange={() => setSmsNotification(!smsNotification)}
                  className="mt-0.5 accent-[#8B4513]"
                />
                <span>
                  {language === 'af'
                    ? 'Stuur vir my bestelling-opdaterings en dop-inligting via WhatsApp en E-pos (Aanbeveel)'
                    : 'Send me order updates and tracking information via WhatsApp and Email (Recommended)'}
                </span>
              </label>

              {/* Terms and conditions */}
              <label className="flex items-start space-x-2.5 text-xs text-[#1A1A1A] cursor-pointer font-bold select-none">
                <input
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                  className="mt-0.5 accent-[#8B4513]"
                />
                <span>
                  {language === 'af'
                    ? 'Ek aanvaar die Terme, Voorwaardes en Privaatheidsbeleid van Volksgrond.'
                    : 'I accept the Terms, Conditions and Privacy Policy of Volksgrond.'}
                </span>
              </label>
            </div>

          </div>

          {/* Right Side: Order Summary Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E0DBCF] rounded p-6 shadow-sm space-y-6">
              <h3 className="text-xs uppercase tracking-wider font-black text-[#1A1A1A] border-b border-[#E0DBCF]/70 pb-3">
                {language === 'af' ? 'Jou Bestelling Opsomming' : 'Your Order Summary'}
              </h3>

              {/* Cart List Preview */}
              <div className="space-y-4 max-h-[240px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center justify-between text-xs border-b border-[#E0DBCF]/50 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#F5F2ED] border border-[#E0DBCF] rounded overflow-hidden flex-shrink-0">
                        <img src={item.product.images[0]} alt={item.product.name.af} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="font-bold text-[#1A1A1A] block uppercase text-[11px] truncate max-w-[150px]">
                          {language === 'af' ? item.product.name.af : item.product.name.en}
                        </span>
                        <span className="text-[9px] text-gray-400 block font-bold uppercase tracking-wider">
                          QTY: {item.quantity} | {item.selectedSize}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-gray-600 font-bold">
                      R{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Computations list */}
              <div className="border-t border-[#E0DBCF] pt-4 space-y-3 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotaal</span>
                  <span className="font-mono">R{subtotal.toFixed(2)}</span>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Afslag ({appliedDiscount.code})</span>
                    <span className="font-mono">- R{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-500">
                  <span>
                    {language === 'af' ? 'Aramex Afleweringskoste' : 'Aramex Delivery Shipping'}
                  </span>
                  <span className="font-mono">R{shippingCost.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base font-black text-[#1A1A1A] border-t border-[#E0DBCF] pt-4">
                  <span>Groot Totaal</span>
                  <span className="font-mono text-[#8B4513]">R{grandTotal.toFixed(2)}</span>
                </div>

                <p className="text-[10px] text-gray-400 italic text-center pt-2">
                  {language === 'af'
                    ? 'Veilige betalings verwerk deur PayFast en Capitec Bank word ten volle beskerm deur RSA wetgewing.'
                    : 'Secure payments processed via PayFast and Capitec Bank are fully protected under RSA law.'}
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1A1A1A] hover:bg-[#333] text-white py-4.5 uppercase text-xs font-black tracking-[0.25em] shadow-lg rounded transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{language === 'af' ? 'Verwerk Betaling...' : 'Processing Payment...'}</span>
                  </span>
                ) : (
                  <span>
                    {language === 'af'
                      ? `Plaas Bestelling (R${grandTotal.toFixed(2)})`
                      : `Place Order (R${grandTotal.toFixed(2)})`}
                  </span>
                )}
              </button>

            </div>
          </div>

        </form>
      )}
    </div>
  );
};
