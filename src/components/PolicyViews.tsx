import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Phone, MapPin, Truck, RotateCcw, ShieldCheck, FileText, Check, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface PolicyViewProps {
  type: 'about' | 'contact' | 'shipping' | 'returns' | 'privacy' | 'terms';
}

export const PolicyViews: React.FC<PolicyViewProps> = ({ type }) => {
  const { language, setView } = useApp();

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setContactName('');
    setContactEmail('');
    setContactMsg('');
    setTimeout(() => setContactSent(false), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
      
      {/* ABOUT US VIEW (ONS STORIE) */}
      {type === 'about' && (
        <div className="space-y-10">
          <div 
            className="relative overflow-hidden rounded-lg bg-[#1A1A1A] py-16 px-6 text-center shadow-md border border-[#E0DBCF]/30"
            style={{
              backgroundImage: 'url(/src/assets/images/volksgrond_heritage_bg_1783548402167.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Subtle premium dark overlay to ensure high readability */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
            
            <div className="relative z-10 space-y-3">
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#C5A059]">
                {language === 'af' ? 'GEBOU OP SUID-AFRIKAANSE BODEM' : 'ROOTED IN SOUTH AFRICAN SOIL'}
              </span>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
                {language === 'af' ? 'Ons Storie' : 'Our Story'}
              </h1>
              <div className="w-16 h-[2px] bg-[#C5A059] mx-auto mt-4"></div>
            </div>
          </div>

          {/* About description paragraphs */}
          <div className="space-y-6 text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#1A1A1A]">
              {language === 'af' ? 'Oor Volksgrond' : 'About Volksgrond'}
            </h2>
            <p>
              {language === 'af'
                ? 'Volksgrond is nie bloot ’n kleremerk nie—dit is ’n lewende beweging wat ons diepste wortels omarm en die gees van ons voorvaders eer. In ’n wêreld waar historiese waarhede dikwels verdraai word, staan Volksgrond op as ’n baken van hoop en eenheid.'
                : 'Volksgrond is not merely a clothing brand—it is a living movement that embraces our deepest roots and honors the spirit of our ancestors. In a world where historical truths are often distorted, Volksgrond stands as a beacon of hope and unity.'}
            </p>
            <p>
              {language === 'af'
                ? 'Elke kledingstuk wat ons skep, is geweef met die verhale en gedeelde geskiedenis van die nege volke. Dit is ons passievolle roepstem om terug te keer na ons oorsprong, die leuens te deurbreek, en saam te bou aan ’n toekoms van eerlikheid, geregtigheid en trots.'
                : 'Each garment we create is woven with the stories and shared history of the nine nations. It is our passionate calling to return to our origins, shatter the falsehoods, and build together a future of honesty, justice, and pride.'}
            </p>
          </div>

          {/* Centered Premium Brand Image */}
          <div className="flex justify-center my-8">
            <div className="max-w-md w-full border border-[#E0DBCF] rounded-lg overflow-hidden shadow-md bg-white p-2 md:p-3 transition-all hover:border-[#C5A059]/40">
              <img 
                src="/src/assets/images/sintagmaties_horse_1783982885579.jpg" 
                alt={language === 'af' ? 'Sintagmaties - Volksgrond' : 'Syntagmatic - Volksgrond'} 
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover rounded-md"
              />
            </div>
          </div>

          {/* Sintagmaties details */}
          <div className="bg-[#F5F2ED]/30 border border-[#E0DBCF] p-6 md:p-8 rounded-lg space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold uppercase tracking-tight text-[#1A1A1A]">
                {language === 'af' ? 'Sintagmaties en Volksgrond: Dieper Betekenis' : 'Syntagmatic and Volksgrond: Deeper Meaning'}
              </h3>
              <div className="w-12 h-[2px] bg-[#C5A059] mx-auto"></div>
            </div>
            
            <p className="text-sm text-gray-600 text-center leading-relaxed">
              {language === 'af'
                ? 'In die taalkunde verwys die term "sintagmaties" na die wyse waarop losstaande elemente binne ’n groter struktuur saamwerk om betekenis te skep.'
                : 'In linguistics, the term "syntagmatic" refers to the way standalone elements work together within a larger structure to create meaning.'}
            </p>

            <p className="text-sm text-gray-600 text-center leading-relaxed font-medium">
              {language === 'af'
                ? 'Net so staan Volksgrond nie op sy eie nie. Ons handelsmerk is sintagmaties verweef met die geskiedenis, kultuur en mense van Suid-Afrika:'
                : 'Similarly, Volksgrond does not stand alone. Our brand is syntagmatically interwoven with the history, culture, and people of South Africa:'}
            </p>

            <ul className="space-y-4 text-sm text-gray-600 max-w-lg mx-auto">
              <li className="flex items-start space-x-3">
                <span className="text-[#C5A059] font-black mt-0.5">•</span>
                <div>
                  <strong className="text-[#1A1A1A]">{language === 'af' ? 'Verbinding: ' : 'Connection: '}</strong>
                  {language === 'af' 
                    ? 'Ons oorbrug die gaping tussen die verlede en die toekoms, en tussen grond en identiteit.'
                    : 'We bridge the gap between the past and the future, and between land and identity.'}
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#C5A059] font-black mt-0.5">•</span>
                <div>
                  <strong className="text-[#1A1A1A]">{language === 'af' ? 'Samehorigheid: ' : 'Cohesion: '}</strong>
                  {language === 'af'
                    ? 'In ’n tyd van verdeeldheid dien ons as ’n simbool van eenheid—’n tapisserie van gedeelde ervarings.'
                    : 'In a time of division, we serve as a symbol of unity—a tapestry of shared experiences.'}
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#C5A059] font-black mt-0.5">•</span>
                <div>
                  <strong className="text-[#1A1A1A]">{language === 'af' ? '’n Lewende Verhaal: ' : 'A Living Story: '}</strong>
                  {language === 'af'
                    ? 'Ons is meer as net klere op ’n rak; ons is ’n tasbare uitdrukking van ’n volk wat weier om sy betekenis te verloor.'
                    : 'We are more than just clothes on a shelf; we are a tangible expression of a people that refuses to lose its significance.'}
                </div>
              </li>
            </ul>

            <p className="text-sm text-gray-600 text-center leading-relaxed pt-2">
              {language === 'af'
                ? 'Volksgrond is ons gesamentlike verhaal van moed en onwrikbare geloof. Sluit by ons aan, dra die gees van ons volk, en stap saam met ons die pad vorentoe.'
                : 'Volksgrond is our collective story of courage and unwavering faith. Join us, wear the spirit of our nation, and walk the path forward with us.'}
            </p>

            <p className="text-sm font-black text-[#8B4513] text-center tracking-wide pt-2 border-t border-[#E0DBCF]/30 max-w-xs mx-auto">
              {language === 'af'
                ? 'Volksgrond – Sintagmaties gebou op waarheid.'
                : 'Volksgrond – Syntagmatically built on truth.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            <div className="bg-white border border-[#E0DBCF] p-6 rounded shadow-sm space-y-3">
              <h3 className="font-black text-xs uppercase tracking-wider text-[#1A1A1A]">
                {language === 'af' ? 'Ons Missie' : 'Our Mission'}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {language === 'af'
                  ? 'Om premium kwaliteit erfenisdrag te skep wat stylvol en duursaam is, terwyl ons gesinswaardes, respek vir tradisie, en die skoonheid van die Suid-Afrikaanse natuur bevorder.'
                  : 'To design premium quality heritage wear that is stylish and exceptionally durable, whilst promoting family values, respect for tradition, and the beauty of South African nature.'}
              </p>
            </div>

            <div className="bg-white border border-[#E0DBCF] p-6 rounded shadow-sm space-y-3">
              <h3 className="font-black text-xs uppercase tracking-wider text-[#1A1A1A]">
                {language === 'af' ? 'Vervaardiging' : 'Our Manufacturing'}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {language === 'af'
                  ? 'Elke kledingstuk word met sorgvuldige trots in Suid-Afrika ontwerp en geweef. Deur plaaslik te produseer, ondersteun ons plaaslike gesinne en behou ons die absolute hoogste standaarde van vakmanskap.'
                  : 'Every single garment is designed and manufactured with precise pride in South Africa. By producing locally, we support local families and preserve the absolute highest standards of craftsmanship.'}
              </p>
            </div>
          </div>

          <div className="text-center pt-8">
            <button
              onClick={() => setView('shop')}
              className="bg-[#1A1A1A] hover:bg-[#333] text-white font-bold text-[10px] uppercase tracking-widest px-8 py-3.5 rounded cursor-pointer transition-colors"
            >
              {language === 'af' ? 'Ontdek Ons Versameling' : 'Discover Our Collection'}
            </button>
          </div>
        </div>
      )}

      {/* CONTACT VIEW (KONTAK) */}
      {type === 'contact' && (
        <div className="space-y-12">
          <div 
            className="relative overflow-hidden rounded-lg bg-[#1A1A1A] py-16 px-6 text-center shadow-md border border-[#E0DBCF]/30"
            style={{
              backgroundImage: 'url(/src/assets/images/volksgrond_heritage_bg_1783548402167.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Subtle premium dark overlay to ensure high readability */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
            
            <div className="relative z-10 space-y-3">
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#C5A059]">
                {language === 'af' ? 'ONS HOOR GRAAG VAN JOU' : 'WE LOVE HEARING FROM YOU'}
              </span>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
                {language === 'af' ? 'Kontak Volksgrond' : 'Contact Volksgrond'}
              </h1>
              <div className="w-16 h-[2px] bg-[#C5A059] mx-auto mt-4"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Contact details */}
            <div className="md:col-span-5 space-y-6">
              <h3 className="font-black text-xs uppercase tracking-wider text-[#1A1A1A]">
                {language === 'af' ? 'Kontakbesonderhede' : 'Contact Information'}
              </h3>
              
              <div className="space-y-3.5">
                <a href="mailto:cbrduplessis.x2@gmail.com" className="flex items-center space-x-4 p-3.5 bg-[#F5F2ED]/40 border border-[#E0DBCF] rounded hover:border-[#8B4513] transition-all group">
                  <div className="w-8 h-8 rounded-full bg-[#8B4513]/5 flex items-center justify-center text-[#8B4513] group-hover:bg-[#8B4513] group-hover:text-white transition-all">
                    <Mail size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">E-pos / Email</span>
                    <span className="text-xs text-[#1A1A1A] font-medium font-mono">cbrduplessis.x2@gmail.com</span>
                  </div>
                </a>

                <a href="tel:0648532434" className="flex items-center space-x-4 p-3.5 bg-[#F5F2ED]/40 border border-[#E0DBCF] rounded hover:border-[#8B4513] transition-all group">
                  <div className="w-8 h-8 rounded-full bg-[#8B4513]/5 flex items-center justify-center text-[#8B4513] group-hover:bg-[#8B4513] group-hover:text-white transition-all">
                    <Phone size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Telefoon / Phone</span>
                    <span className="text-xs text-[#1A1A1A] font-medium font-mono">064 853 2434</span>
                  </div>
                </a>

                <div className="flex items-center space-x-4 p-3.5 bg-[#F5F2ED]/40 border border-[#E0DBCF] rounded hover:border-[#8B4513] transition-all group">
                  <div className="w-8 h-8 rounded-full bg-[#8B4513]/5 flex items-center justify-center text-[#8B4513] group-hover:bg-[#8B4513] group-hover:text-white transition-all">
                    <MapPin size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Ligging / Location</span>
                    <span className="text-xs text-[#1A1A1A] font-medium">
                      {language === 'af' ? 'Rustenburg, Suid-Afrika' : 'Rustenburg, South Africa'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sociale Media Skakels / Social Media Links Grid */}
              <div className="space-y-3 pt-2">
                <h4 className="font-black text-[9px] uppercase tracking-widest text-[#8B4513]">
                  {language === 'af' ? 'VOLG ONS OP SOSIALE MEDIA' : 'FOLLOW OUR JOURNEY'}
                </h4>
                
                <div className="grid grid-cols-3 gap-3">
                  <a
                    href="https://www.facebook.com/share/17bDNvXAdK/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3.5 bg-[#F5F2ED]/20 border border-[#E0DBCF] rounded hover:border-[#8B4513] hover:bg-white text-[#1A1A1A] transition-all group text-center cursor-pointer shadow-sm hover:scale-[1.02]"
                  >
                    <svg className="w-4 h-4 text-[#8B4513] group-hover:scale-110 transition-transform mb-1.5 fill-current" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                    </svg>
                    <span className="text-[9px] font-black uppercase tracking-wider">Facebook</span>
                  </a>

                  <a
                    href="https://www.instagram.com/volksgrond?igsh=dW5ja2FmaHFvYTdl&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3.5 bg-[#F5F2ED]/20 border border-[#E0DBCF] rounded hover:border-[#8B4513] hover:bg-white text-[#1A1A1A] transition-all group text-center cursor-pointer shadow-sm hover:scale-[1.02]"
                  >
                    <svg className="w-4 h-4 text-[#8B4513] group-hover:scale-110 transition-transform mb-1.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                    <span className="text-[9px] font-black uppercase tracking-wider">Instagram</span>
                  </a>

                  <a
                    href="https://www.tiktok.com/@claudine_pike_du_plessis?_r=1&_t=ZS-97s8iM34grp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3.5 bg-[#F5F2ED]/20 border border-[#E0DBCF] rounded hover:border-[#8B4513] hover:bg-white text-[#1A1A1A] transition-all group text-center cursor-pointer shadow-sm hover:scale-[1.02]"
                  >
                    <svg className="w-4 h-4 text-[#8B4513] group-hover:scale-110 transition-transform mb-1.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2a1 1 0 0 0-1 1v11.69A3.82 3.82 0 1 1 7.31 11a1 1 0 0 0 0-2 5.82 5.82 0 1 0 5.69 5.82V7.1a7.82 7.82 0 0 0 4.88-2.11 1 1 0 0 0-1.41-1.41 5.82 5.82 0 0 1-4.47 1.42V3a1 1 0 0 0-1-1z" />
                    </svg>
                    <span className="text-[9px] font-black uppercase tracking-wider">TikTok</span>
                  </a>
                </div>
              </div>

              <div className="bg-[#E0DBCF]/20 border border-[#E0DBCF] p-5 rounded text-xs">
                <p className="font-bold text-[#1A1A1A] uppercase tracking-wider">Aramex Opspoor Navrae</p>
                <p className="text-gray-500 mt-2 leading-relaxed">
                  {language === 'af'
                    ? 'As jy navrae het oor jou Aramex aflewering, stuur asseblief jou VG bestel ID na ons e-pos adres vir flink ondersteuning.'
                    : 'If you have questions regarding your Aramex delivery, please email your VG order ID directly to us for instant support.'}
                </p>
              </div>
            </div>

            {/* Interactive contact form */}
            <div className="md:col-span-7 bg-white border border-[#E0DBCF] rounded p-6 md:p-8 shadow-sm">
              <h3 className="font-black text-xs uppercase tracking-wider text-[#1A1A1A] mb-6">
                {language === 'af' ? 'Stuur vir ons \'n Boodskap' : 'Send us a Message'}
              </h3>

              {contactSent ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-5 rounded font-bold">
                  {language === 'af'
                    ? 'Boodskap suksesvol gestuur! Ons sal jou binne 24 uur kontak.'
                    : 'Message successfully sent! We will contact you within 24 hours.'}
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="text-[9px] uppercase font-black tracking-widest text-gray-400 mb-1.5 block">
                      {language === 'af' ? 'Jou Naam' : 'Your Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-[#F5F2ED]/40 border border-[#E0DBCF] rounded p-2.5 text-xs focus:outline-none focus:border-[#8B4513]"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-black tracking-widest text-gray-400 mb-1.5 block">
                      {language === 'af' ? 'Jou E-pos Adres' : 'Your Email'}
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-[#F5F2ED]/40 border border-[#E0DBCF] rounded p-2.5 text-xs focus:outline-none focus:border-[#8B4513]"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-black tracking-widest text-gray-400 mb-1.5 block">
                      {language === 'af' ? 'Jou Boodskap' : 'Your Message'}
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      className="w-full bg-[#F5F2ED]/40 border border-[#E0DBCF] rounded p-2.5 text-xs focus:outline-none focus:border-[#8B4513]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#1A1A1A] hover:bg-[#333] text-white font-bold text-[9px] uppercase tracking-widest px-6 py-3 rounded cursor-pointer transition-colors"
                  >
                    {language === 'af' ? 'Stuur Boodskap' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SHIPPING POLICY VIEW */}
      {type === 'shipping' && (
        <div className="space-y-8 bg-white border border-[#E0DBCF] rounded-lg p-8 md:p-12 shadow-sm text-xs text-gray-600 leading-relaxed">
          <div className="flex items-center space-x-3 border-b border-[#E0DBCF] pb-4 mb-6">
            <Truck size={24} className="text-[#8B4513]" />
            <h1 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A]">
              {language === 'af' ? 'Afleweringsbeleid' : 'Shipping Policy'}
            </h1>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-xs uppercase text-[#1A1A1A]">1. Afleweringsvennoot</h3>
            <p>
              Ons gebruik uitsluitlik **Aramex Store-to-Door Courier** vir betroubare, veilige, en vinnige aflewerings dwarsdeur Suid-Afrika.
            </p>

            <h3 className="font-bold text-xs uppercase text-[#1A1A1A]">2. Koerier Koste (Geen Gratis Aflewering)</h3>
            <p>
              Ter wille van deursigtigheid en die handhawing van die absolute beste produkkwaliteit en kantoen-pryse, beraam ons koerierkoste direk aan die kliënt:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>**Aramex Store-to-Door Courier:** Flat-rate van R99.99 ZAR landwyd, direk na jou voordeur of kantoor.</li>
              <li>**Aramex Sleeve Option (Pak-en-Haal):** Flat-rate van R89.99 ZAR landwyd, gestuur na jou naaste Pick n Pay, Checkers of FreshStop sluitkas vir maklike afhaal.</li>
            </ul>

            <h3 className="font-bold text-xs uppercase text-[#1A1A1A]">3. Afleweringstye</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>**Hoofsentrums (Johannesburg, Pretoria, Kaapstad, Durban):** Aflewering binne 24 tot 48 uur na betaling.</li>
              <li>**Streeks- en Plaasadresse:** Aflewering binne 48 tot 72 uur.</li>
            </ul>

            <h3 className="font-bold text-xs uppercase text-[#1A1A1A]">4. Pakkie Opsporing (Tracking)</h3>
            <p>
              Sodra jou bestelling verpak is, sal jy \'n e-pos en SMS met jou Aramex waybill-nommer ontvang. Jy kan jou pakkie intyds opspoor op die Aramex webtuiste.
            </p>
          </div>
        </div>
      )}

      {/* RETURNS POLICY VIEW */}
      {type === 'returns' && (
        <div className="space-y-8 bg-white border border-[#E0DBCF] rounded-lg p-8 md:p-12 shadow-sm text-xs text-gray-600 leading-relaxed">
          <div className="flex items-center space-x-3 border-b border-[#E0DBCF] pb-4 mb-6">
            <RotateCcw size={24} className="text-[#8B4513]" />
            <h1 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A]">
              {language === 'af' ? 'Terugsending & Ruilbeleid' : 'Returns & Exchange Policy'}
            </h1>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-xs uppercase text-[#1A1A1A]">1. 14-Dae Ruilwaarborg</h3>
            <p>
              As jou kledingstuk nie perfek pas nie, of as jy nie ten volle tevrede is met jou produk nie, kan jy dit binne 14 dae na aflewering ruil vir \'n ander grootte of styl.
            </p>

            <h3 className="font-bold text-xs uppercase text-[#1A1A1A]">2. Voorwaardes vir Terugsending</h3>
            <p>
              Klere kan slegs geruil word indien dit voldoen aan die volgende voorwaardes:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Die produk moet ongewas, ongedra, en onbeskadig wees.</li>
              <li>Alle oorspronklike Volksgrond etikette moet nog aangeheg wees.</li>
              <li>Dit moet in die oorspronklike verpakking wees.</li>
            </ul>

            <h3 className="font-bold text-xs uppercase text-[#1A1A1A]">3. Ruilproses</h3>
            <p>
              Stuur asseblief \'n e-pos na cbrduplessis.x2@gmail.com met jou bestelnommer en die grootte waarvoor jy dit wil ruil. Die kliënt is verantwoordelik vir die koerierkoste (R99.99) om die produk na ons te stuur, en ons sal die nuwe kledingstuk na jou stuur teen slegs R99.99.
            </p>
          </div>
        </div>
      )}

      {/* PRIVACY POLICY VIEW */}
      {type === 'privacy' && (
        <div className="space-y-8 bg-white border border-[#E0DBCF] rounded-lg p-8 md:p-12 shadow-sm text-xs text-gray-600 leading-relaxed">
          <div className="flex items-center space-x-3 border-b border-[#E0DBCF] pb-4 mb-6">
            <ShieldCheck size={24} className="text-[#8B4513]" />
            <h1 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A]">
              {language === 'af' ? 'Privaatheidsbeleid' : 'Privacy Policy'}
            </h1>
          </div>

          <div className="space-y-4">
            <p>
              Volksgrond is verbind tot die beskerming van jou persoonlike inligting in ooreenstemming met die Suid-Afrikaanse Wet op die Beskerming van Persoonlike Inligting (POPIA).
            </p>

            <h3 className="font-bold text-xs uppercase text-[#1A1A1A]">1. Inligting Wat Ons Versamel</h3>
            <p>
              Ons versamel slegs die nodige inligting om jou bestelling te verwerk, insluitend jou volle naam, e-pos, selfoonnommer (vir Aramex SMS), fisiese afleweringsadres, en betalingsmetode.
            </p>

            <h3 className="font-bold text-xs uppercase text-[#1A1A1A]">2. Sekuriteit</h3>
            <p>
              Alle betalings via Ozow Instant EFT of kaartbetalings word hanteer deur geakkrediteerde Suid-Afrikaanse gateway-vennote met hoë SSL-enkripsie. Ons stoor nooit jou bankbesonderhede of kaartnommers op ons stelsels nie.
            </p>
          </div>
        </div>
      )}

      {/* TERMS AND CONDITIONS VIEW */}
      {type === 'terms' && (
        <div className="space-y-8 bg-white border border-[#E0DBCF] rounded-lg p-8 md:p-12 shadow-sm text-xs text-gray-600 leading-relaxed">
          <div className="flex items-center space-x-3 border-b border-[#E0DBCF] pb-4 mb-6">
            <FileText size={24} className="text-[#8B4513]" />
            <h1 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A]">
              {language === 'af' ? 'Bepalings & Voorwaardes' : 'Terms & Conditions'}
            </h1>
          </div>

          <div className="space-y-4">
            <p>
              Hierdie webtuiste word besit en bedryf deur Volksgrond (Pty) Ltd, \'n geregistreerde maatskappy in die Republiek van Suid-Afrika. Deur ons webtuiste te gebruik en aankooptransaksies te voltooi, stem jy in tot hierdie bepalings.
            </p>

            <h3 className="font-bold text-xs uppercase text-[#1A1A1A]">1. Kontrak van Verkope</h3>
            <p>
              Bestellings is onderhewig aan die beskikbaarheid van voorraad. \'n Verkope-kontrak word eers aangegaan sodra Volksgrond jou betaling ontvang het (via EFT of Ozow) en \'n e-pos bevestiging uitgestuur het.
            </p>

            <h3 className="font-bold text-xs uppercase text-[#1A1A1A]">2. Pryse en BTW</h3>
            <p>
              Alle pryse is gelyk aan R269.99 ZAR per produk. Alhoewel pryse veranderings kan ondergaan sonder vooraf kennisgewing, sal dit nooit \'n reeds geplaasde bestelling beïnvloed nie. Pryse sluit 15% BTW in.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
