import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Trash2, Tag, ArrowRight, ShieldCheck, Truck, X } from 'lucide-react';
import { motion } from 'motion/react';

export const CartView: React.FC = () => {
  const {
    language,
    cart,
    updateCartQuantity,
    removeFromCart,
    setView,
    applyPromoCode,
    removePromoCode,
    appliedDiscount,
    promoCode
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; text: string } | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percent) / 100 : 0;
  const totalBeforeShipping = subtotal - discountAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    
    const res = applyPromoCode(couponInput);
    setCouponMsg({ success: res.success, text: res.message });
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleRemoveCoupon = () => {
    removePromoCode();
    setCouponMsg(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
      <div className="border-b border-[#E0DBCF] pb-6 mb-10">
        <h1 className="text-3xl font-black uppercase tracking-tight text-[#1A1A1A] flex items-center space-x-3">
          <ShoppingCart size={28} className="text-[#8B4513]" />
          <span>{language === 'af' ? 'Jou Winkelmandjie' : 'Your Shopping Cart'}</span>
        </h1>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white border border-[#E0DBCF] p-16 rounded text-center shadow-sm">
          <span className="text-5xl mb-4 block">🛒</span>
          <h3 className="font-bold uppercase text-sm tracking-widest text-[#1A1A1A] mb-2">
            {language === 'af' ? 'Jou mandjie is leeg' : 'Your cart is empty'}
          </h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6">
            {language === 'af'
              ? 'Voeg van ons premium kledingstukke by om jou ryk Suid-Afrikaanse erfenis met trots uit te dra.'
              : 'Add some of our premium garments to wear your rich South African heritage with pride.'}
          </p>
          <button
            onClick={() => setView('shop')}
            className="bg-[#1A1A1A] hover:bg-[#333] text-white font-bold text-[10px] uppercase tracking-widest px-8 py-3.5 rounded cursor-pointer transition-all"
          >
            {language === 'af' ? 'Gaan na Winkel' : 'Go to Shop'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, idx) => {
              const itemTotal = item.product.price * item.quantity;
              return (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="bg-white border border-[#E0DBCF] rounded p-4 md:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    {/* Item Image */}
                    <div className="w-16 h-16 bg-[#F5F2ED] border border-[#E0DBCF] rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name.af}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Title and variation specs */}
                    <div>
                      <h3 className="font-black text-xs uppercase text-[#1A1A1A] tracking-tight">
                        {language === 'af' ? item.product.name.af : item.product.name.en}
                      </h3>
                      <div className="flex flex-wrap gap-x-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1.5">
                        <span>
                          {language === 'af' ? `Grootte: ${item.selectedSize}` : `Size: ${item.selectedSize}`}
                        </span>
                        {item.selectedColor && (
                          <span>
                            {language === 'af' ? `Kleur: ${item.selectedColor.split(' / ')[0]}` : `Color: ${item.selectedColor.split(' / ')[1] || item.selectedColor}`}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono mt-1 block">
                        R{item.product.price.toFixed(2)} {language === 'af' ? 'elk' : 'each'}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Controls & Delete */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E0DBCF]/50">
                    <div className="flex items-center border border-[#E0DBCF] bg-[#F5F2ED]/40 rounded overflow-hidden">
                      <button
                        onClick={() =>
                          updateCartQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)
                        }
                        className="px-2.5 py-1.5 hover:bg-gray-100 text-[#1A1A1A] font-bold text-xs cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 font-black text-xs text-[#1A1A1A]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateCartQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)
                        }
                        className="px-2.5 py-1.5 hover:bg-gray-100 text-[#1A1A1A] font-bold text-xs cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-black text-[#1A1A1A] font-mono">
                      R{itemTotal.toFixed(2)}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                      className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                      title={language === 'af' ? 'Verwyder' : 'Remove'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Aramex Prompt Banner */}
            <div className="bg-[#E0DBCF]/20 border border-[#E0DBCF] rounded p-5 flex items-start space-x-3 text-xs">
              <Truck size={18} className="text-[#8B4513] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#1A1A1A]">
                  {language === 'af' ? 'Aramex Flits-Aflewering' : 'Aramex Express Delivery'}
                </p>
                <p className="text-gray-500 text-[11px] mt-1 leading-relaxed">
                  {language === 'af'
                    ? 'Ons gebruik Aramex Store-to-Door om jou bestelling direk by jou huis of kantoor af te lewer. Let wel: Geen gratis aflewering nie. R99.99 landwyd of R89.99 vir afhaal by Pick n Pay/Checkers.'
                    : 'We use Aramex Store-to-Door to deliver your order straight to your house or office. Note: No free shipping. R99.99 nationwide or R89.99 for pickup at Pick n Pay/Checkers.'}
                </p>
              </div>
            </div>
          </div>

          {/* Cart Summary Panel */}
          <div className="bg-white border border-[#E0DBCF] rounded p-6 shadow-sm h-fit space-y-6">
            <h3 className="text-xs uppercase tracking-wider font-black text-[#1A1A1A] border-b border-[#E0DBCF]/70 pb-3">
              {language === 'af' ? 'Bestellingsopsomming' : 'Order Summary'}
            </h3>

            {/* Calculations layout */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotaal</span>
                <span className="font-mono">R{subtotal.toFixed(2)}</span>
              </div>

              {appliedDiscount && (
                <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50 p-2 rounded">
                  <span className="flex items-center gap-1">
                    <Tag size={12} />
                    <span>Afslag ({appliedDiscount.code})</span>
                  </span>
                  <span className="font-mono">- R{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-500 border-t border-[#E0DBCF]/50 pt-3">
                <span>{language === 'af' ? 'Beraamde Aflewering' : 'Estimated Shipping'}</span>
                <span className="text-gray-400 text-[10px]">Calculated at Checkout</span>
              </div>

              <div className="flex justify-between text-base font-black text-[#1A1A1A] border-t border-[#E0DBCF] pt-4">
                <span>Totaal (voor koerier)</span>
                <span className="font-mono">R{totalBeforeShipping.toFixed(2)}</span>
              </div>

              <p className="text-[10px] text-gray-400 italic text-center pt-2">
                {language === 'af' ? '15% BTW is ingesluit by bogenoemde pryse.' : '15% VAT is included in the above prices.'}
              </p>
            </div>

            {/* Promo Code Input Form */}
            <div className="border-t border-[#E0DBCF]/70 pt-4">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder={language === 'af' ? 'Koeponkode' : 'Coupon Code'}
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  disabled={!!appliedDiscount}
                  className="flex-1 bg-[#F5F2ED]/60 border border-[#E0DBCF] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#8B4513] disabled:opacity-50"
                />
                {!appliedDiscount ? (
                  <button
                    type="submit"
                    className="bg-[#1A1A1A] hover:bg-[#333] text-white font-bold text-[9px] uppercase tracking-widest px-4 py-2 rounded cursor-pointer"
                  >
                    {language === 'af' ? 'Pas Toe' : 'Apply'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="bg-[#8B4513] text-white p-2 rounded cursor-pointer flex items-center justify-center"
                    title={language === 'af' ? 'Verwyder Koepon' : 'Remove Coupon'}
                  >
                    <X size={14} />
                  </button>
                )}
              </form>

              {couponMsg && (
                <p className={`text-[10px] mt-2 font-bold ${couponMsg.success ? 'text-emerald-600' : 'text-red-500'}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* CTA checkout button */}
            <button
              onClick={() => setView('checkout')}
              className="w-full bg-[#1A1A1A] hover:bg-[#333] text-white py-4 uppercase text-xs font-black tracking-[0.2em] shadow-lg rounded transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>{language === 'af' ? 'Gaan Voort Na Betaling' : 'Proceed to Checkout'}</span>
              <ArrowRight size={14} />
            </button>

            {/* Back to shop link */}
            <button
              onClick={() => setView('shop')}
              className="w-full text-center text-xs text-gray-500 hover:text-[#1A1A1A] font-bold underline cursor-pointer"
            >
              {language === 'af' ? 'Hou aan inkopies doen' : 'Continue shopping'}
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
