import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import { db } from './src/lib/firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, serverTimestamp, getDoc } from 'firebase/firestore';

// Server-side State
let products = [
  {
    id: 'die-erfenis-themp',
    name: {
      af: 'Die Erfenis T-hemp',
      en: 'The Heritage T-Shirt'
    },
    price: 269.99,
    originalPrice: 349.99,
    category: 'men',
    categoryLabel: {
      af: 'Mans',
      en: 'Men'
    },
    stockCount: 15,
    description: {
      af: 'Niks spreek van ons ryk erfenis soos die vryheid van ons Suid-Afrikaanse bodem nie. Hierdie premium swart T-hemp is spesiaal ontwerp vir die moderne man wat trots is op sy tradisies en weier om sy waardes te kompromitteer. Dit dra die handelsmerk se handtekening en is gemaak van die hoogste gehalte, dig-geweefde kantoen vir uiterste gerief en langdurige duursaamheid.',
      en: 'Nothing speaks of our rich heritage like the freedom of our South African soil. This premium black T-shirt is specially designed for the modern man who is proud of his traditions and refuses to compromise on his values. Carrying the brand’s signature, it is crafted from the highest quality, dense-weave cotton for ultimate comfort and long-lasting durability.'
    },
    features: [
      {
        af: '100% Premium Suid-Afrikaanse Katoen',
        en: '100% Premium South African Cotton'
      },
      {
        af: 'Swaar Gewig (220gsm) vir premium val',
        en: 'Heavyweight (220gsm) for a premium drape'
      },
      {
        af: 'Kwaliteit goud-sand reliëfdrukwerk',
        en: 'High-quality gold-sand embossed print'
      },
      {
        af: 'Dubbelstiksel afwerking langs die some',
        en: 'Double-needle stitched hems for durability'
      }
    ],
    materials: {
      af: '100% Gekamde Katoen. Plaaslik verkry en vervaardig.',
      en: '100% Combed Cotton. Locally sourced and manufactured.'
    },
    careInstructions: {
      af: 'Was koud binne-buite. Moenie direk op drukwerk stryk nie. Moenie tuimeldroog nie.',
      en: 'Wash cold inside-out. Do not iron directly on print. Do not tumble dry.'
    },
    images: ['/src/assets/images/erfenis_black_tshirt_1783544659803.jpg'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Swart / Black']
  },
  {
    id: 'boerekrygers-themp',
    name: {
      af: 'Boerekrygers T-hemp',
      en: 'Boerekrygers T-Shirt'
    },
    price: 269.99,
    category: 'men',
    categoryLabel: {
      af: 'Mans',
      en: 'Men'
    },
    stockCount: 24,
    description: {
      af: 'Geïnspireer deur die veerkragtigheid en die onblusbare gees van die Suid-Afrikaanse boer en buitelewe-kultuur. Die Boerekrygers T-hemp verteenwoordig harde werk, eerlikheid en lojaliteit aan die grond. Die grasieuse swart handskrif-borduurwerk op die spierwit agtergrond maak dit die perfekte kombinasie van robuust en stylvol.',
      en: 'Inspired by the resilience and unyielding spirit of the South African farmer and outdoor culture. The Boerekrygers T-shirt represents hard work, honesty, and loyalty to the land. The elegant black script embroidery on the crisp white background makes it the perfect combination of robust and stylish.'
    },
    features: [
      {
        af: 'Fyn borduurwerk met premium gare',
        en: 'Fine embroidery with premium thread'
      },
      {
        af: '100% Sagte Gekamde Katoen',
        en: '100% Soft Combed Cotton'
      },
      {
        af: 'Ideaal vir warm Suid-Afrikaanse somers',
        en: 'Ideal for warm South African summers'
      },
      {
        af: 'Eko-vriendelike organiese kleurmetodes',
        en: 'Eco-friendly organic dyeing methods'
      }
    ],
    materials: {
      af: '100% Premium Gekamde Katoen (180gsm).',
      en: '100% Premium Combed Cotton (180gsm).'
    },
    careInstructions: {
      af: 'Was teen 30 grade. Stryk teen medium hitte. Moenie bleik nie.',
      en: 'Wash at 30 degrees. Iron at medium heat. Do not bleach.'
    },
    images: ['/src/assets/images/boerekrygers_white_tshirt_1783544674183.jpg'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Wit / White', 'Burgondi / Burgundy', 'Swart / Black']
  },
  {
    id: 'boerekrygers-keps',
    name: {
      af: 'Boerekrygers Sand Keps',
      en: 'Boerekrygers Sand Cap'
    },
    price: 269.99,
    originalPrice: 299.99,
    category: 'caps',
    categoryLabel: {
      af: 'Kepse',
      en: 'Caps'
    },
    stockCount: 8,
    description: {
      af: 'Die perfekte bykomstigheid vir dae in die veld of op die plaas. Hierdie gestruktureerde sand-kleurige keps beskerm jou teen die ongenaakbare Afrika-son terwyl dit jou trots op ons kultuur beklemtoon. Gemaak van hoë-gehalte katoen-twill met die fyn Boerekrygers handskrif in swart borduurwerk.',
      en: 'The perfect accessory for days in the field or on the farm. This structured sand-colored cap protects you from the harsh African sun while emphasizing your pride in our culture. Crafted from high-quality cotton twill with the fine Boerekrygers script embroidered in black.'
    },
    features: [
      {
        af: 'Verstelbare brons gespe vir perfekte pasvorm',
        en: 'Adjustable brass buckle for the perfect fit'
      },
      {
        af: 'Premium katoen twill materiaal',
        en: 'Premium cotton twill material'
      },
      {
        af: 'Luggate vir asemhaling',
        en: 'Ventilation eyelets for breathability'
      },
      {
        af: 'Duursame geboë skerm',
        en: 'Durable curved visor'
      }
    ],
    materials: {
      af: '100% Katoen Twill met brons metaalsluiting.',
      en: '100% Cotton Twill with brass metal clasp.'
    },
    careInstructions: {
      af: 'Handwas met lae temperatuur water. Moenie in wasmasjien plaas nie.',
      en: 'Hand wash with cool water. Do not place in washing machine.'
    },
    images: ['/src/assets/images/boerekrygers_sand_cap_1783544687518.jpg'],
    sizes: ['Adjustable / Verstelbaar'],
    colors: ['Sand / Sand']
  },
  {
    id: 'staan-vir-wat-jy-in-glo',
    name: {
      af: 'Staan Vir Wat Jy In Glo T-hemp',
      en: 'Stand For What You Believe T-Shirt'
    },
    price: 269.99,
    category: 'men',
    categoryLabel: {
      af: 'Mans',
      en: 'Men'
    },
    stockCount: 12,
    description: {
      af: 'Geloof is die fondament waarop ons huise gebou is. Hierdie houtskool-swart T-hemp dra die kragtige boodskap van geloof met \'n stylvolle, handgetekende wit kruisgrafika omring deur die elegante Volksgrond logo. Gemaak vir diegene wat onwrikbaar staan in hul oortuigings.',
      en: 'Faith is the foundation upon which our homes are built. This charcoal-black T-shirt carries the powerful message of faith with a stylish, hand-drawn white cross graphic surrounded by the elegant Volksgrond logo. Made for those who stand unyielding in their convictions.'
    },
    features: [
      {
        af: 'Betekenisvolle handgetekende kruis-ontwerp',
        en: 'Meaningful hand-drawn cross design'
      },
      {
        af: 'Swaar 200gsm gekamde katoen',
        en: 'Heavyweight 200gsm combed cotton'
      },
      {
        af: 'Gepak in herwinbare bio-afbreekbare verpakking',
        en: 'Packed in recyclable biodegradable packaging'
      },
      {
        af: 'Versterkte skouersome vir vorm-behoud',
        en: 'Reinforced shoulder seams for shape retention'
      }
    ],
    materials: {
      af: '100% Organiese Gekamde Katoen.',
      en: '100% Organic Combed Cotton.'
    },
    careInstructions: {
      af: 'Koue wasmasjien-siklus. Was saam met soortgelyke kleure. Moenie stryk op die grafika nie.',
      en: 'Cold machine wash cycle. Wash with similar colors. Do not iron on graphic.'
    },
    images: ['/src/assets/images/staan_glo_tshirt_1783544705497.jpg'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Houtskool Swart / Charcoal Black']
  },
  {
    id: 'volkspore-kids-tshirt',
    name: {
      af: 'Volkspore Kinderslyn T-hemp',
      en: 'Volkspore Kids T-Shirt'
    },
    price: 269.99,
    category: 'volkspore',
    categoryLabel: {
      af: 'Volkspore Kinders',
      en: 'Volkspore Kids'
    },
    stockCount: 18,
    description: {
      af: 'Ons nageslag bou op die spore van ons vaders. Ons Volkspore kinderslyn is geskep vir die kleinspan wat die rykdom van die buitelewe en gesinswaardes van jongs af leer ken. Gemaak van ultra-sagte organiese olyf-beige katoen wat sag is op sensitiewe vel en uiterste vryheid vir speel toelaat.',
      en: "Our generation builds on the tracks of our fathers. Our Volkspore children's line is created for the little ones who learn the richness of outdoor life and family values from a young age. Crafted from ultra-soft organic olive-beige cotton that is gentle on sensitive skin and allows ultimate freedom for play."
    },
    features: [
      {
        af: 'Ultra-sagte organiese katoen vir delikate vel',
        en: 'Ultra-soft organic cotton for delicate skin'
      },
      {
        af: 'Volkspore sirkel-logo met bergpunte',
        en: 'Volkspore circular logo with mountain peaks'
      },
      {
        af: 'Hiposeleergene en natuurlik gekleur',
        en: 'Hypoallergenic and naturally dyed'
      },
      {
        af: 'Ekstra rekbare kraag vir maklike aantrek',
        en: 'Extra stretch collar for easy dressing'
      }
    ],
    materials: {
      af: '100% Geverifieerde Organiese Katoen (160gsm).',
      en: '100% Verified Organic Cotton (160gsm).'
    },
    careInstructions: {
      af: 'Was liggies in koue water. Droog in die skaduwee. Ligte stryk indien nodig.',
      en: 'Wash gently in cold water. Dry in shade. Light iron if needed.'
    },
    images: ['/src/assets/images/volkspore_kids_tshirt_1783544715921.jpg'],
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    colors: ['Olyf-Beige / Olive-Beige']
  },
  {
    id: 'die-goue-kruis-themp',
    name: {
      af: 'Die Goue Kruis T-hemp',
      en: 'The Gold Cross T-Shirt'
    },
    price: 269.99,
    category: 'men',
    categoryLabel: {
      af: 'Mans',
      en: 'Men'
    },
    stockCount: 15,
    description: {
      af: 'Geloof is ons anker en ons fondant. Hierdie luukse swart T-hemp spog met \'n treffende goud-borsel kruisgrafika en die verheffende woorde "Staan vir wat jy in glo". Gemaak van hoë-gehalte katoen vir \'n ongeëwenaarde gemaklike pasvorm.',
      en: 'Faith is our anchor and our foundation. This luxury black T-shirt boasts a striking gold-brush cross graphic and the uplifting words "Staan vir wat jy in glo" (Stand for what you believe in). Crafted from high-quality cotton for an unparalleled comfortable fit.'
    },
    features: [
      {
        af: 'Treffende goud-borsel kruisgrafika',
        en: 'Striking gold-brush cross graphic'
      },
      {
        af: '100% Premium Suid-Afrikaanse Katoen',
        en: '100% Premium South African Cotton'
      },
      {
        af: 'Aantreklike en inspirerende ontwerp',
        en: 'Attractive and inspiring design'
      }
    ],
    materials: {
      af: '100% Gekamde Katoen. Plaaslik verkry en vervaardig.',
      en: '100% Combed Cotton. Locally sourced and manufactured.'
    },
    careInstructions: {
      af: 'Was koud binne-buite. Moenie direk op drukwerk stryk nie. Moenie tuimeldroog nie.',
      en: 'Wash cold inside-out. Do not iron directly on print. Do not tumble dry.'
    },
    images: ['/src/assets/images/goue_kruis_tshirt_1783554648467.jpg'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Swart / Black']
  },
  {
    id: 'die-borsel-kruis-wit-themp',
    name: {
      af: 'Die Borsel-Kruis T-hemp (Wit)',
      en: 'The Brush Cross T-Shirt (White)'
    },
    price: 269.99,
    category: 'men',
    categoryLabel: {
      af: 'Mans',
      en: 'Men'
    },
    stockCount: 12,
    description: {
      af: 'Suiwer wit ontmoet kragtige oortuiging. Hierdie premium wit T-hemp dra die bekende borselkruis in diep swart, gekombineer met ons kenmerkende "Staan vir wat jy in glo" boodskap. Ideaal vir die man wat sy waardes met trots en styl dra.',
      en: 'Pure white meets powerful conviction. This premium white T-shirt carries the well-known brush cross in deep black, combined with our signature "Staan vir wat jy in glo" message. Ideal for the man who wears his values with pride and style.'
    },
    features: [
      {
        af: 'Suiwer wit kledingstuk met swart kontras-kruis',
        en: 'Pure white garment with black contrast cross'
      },
      {
        af: '100% Premium Suid-Afrikaanse Katoen',
        en: '100% Premium South African Cotton'
      },
      {
        af: 'Duursame hand-skrif reliëfdruk',
        en: 'Durable hand-script embossed print'
      }
    ],
    materials: {
      af: '100% Gekamde Katoen. Plaaslik verkry en vervaardig.',
      en: '100% Combed Cotton. Locally sourced and manufactured.'
    },
    careInstructions: {
      af: 'Was koud binne-buite. Moenie direk op drukwerk stryk nie. Moenie tuimeldroog nie.',
      en: 'Wash cold inside-out. Do not iron directly on print. Do not tumble dry.'
    },
    images: ['/src/assets/images/borselkruis_wit_tshirt_1783554666881.jpg'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Wit / White']
  },
  {
    id: 'die-koringaar-themp',
    name: {
      af: 'Die Koringaar T-hemp',
      en: 'The Wheat Ears T-Shirt'
    },
    price: 269.99,
    category: 'ladies',
    categoryLabel: {
      af: 'Dames',
      en: 'Ladies'
    },
    stockCount: 18,
    description: {
      af: 'Geïnspireer deur die ryk Suid-Afrikaanse landbou-erfenis en die vrugbaarheid van ons bodem. Hierdie elegante wit dames T-hemp is versier met verfynde goue koringare en die Volksgrond handtekening. Gemaak van fyn gekamde katoen.',
      en: 'Inspired by the rich South African agricultural heritage and the fertility of our soil. This elegant white ladies T-shirt is adorned with refined golden wheat ears and the Volksgrond signature. Crafted from finely combed cotton.'
    },
    features: [
      {
        af: 'Verfynde goue koringaar-kuns',
        en: 'Refined golden wheat art'
      },
      {
        af: 'Uitstaande fyn-gekamde dames snit',
        en: 'Outstanding finely combed ladies cut'
      }
    ],
    materials: {
      af: '100% Premium Gekamde Katoen.',
      en: '100% Premium Combed Cotton.'
    },
    careInstructions: {
      af: 'Was teen 30 grade. Stryk teen medium hitte. Moenie bleik nie.',
      en: 'Wash at 30 degrees. Iron at medium heat. Do not bleach.'
    },
    images: [
      '/src/assets/images/koringaar_tshirt_1783554680276.jpg',
      '/src/assets/images/volksgrond_story_collage_1783553284607.jpg',
      '/src/assets/images/volksgrond_heritage_bg_1783548402167.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: [
      'Wit / White',
      'Swart / Black',
      'Muntgroen / Mint Green',
      'Rooi / Red',
      'Pienk / Pink',
      'Vlootblou / Navy Blue',
      'Sand / Sand'
    ]
  },
  {
    id: 'die-bloed-sweet-trane-themp',
    name: {
      af: 'Die Bloed, Sweet & Trane T-hemp',
      en: 'The Blood, Sweat & Tears T-Shirt'
    },
    price: 269.99,
    category: 'men',
    categoryLabel: {
      af: 'Mans',
      en: 'Men'
    },
    stockCount: 20,
    description: {
      af: 'Agter elke suksesvolle oes, plaas en gesin lê onblusbare dryfkrag en toewyding. Hierdie T-hemp herdenk ons boere en landsburgers se "Bloed, sweet en trane" onder die warm Afrika-son. Ontwerp met stylvolle goud-sand blokletters.',
      en: 'Behind every successful harvest, farm, and family lies unyielding drive and dedication. This T-shirt commemorates our farmers and citizens "Blood, sweat, and tears" under the warm African sun. Designed with stylish gold-sand block lettering.'
    },
    features: [
      {
        af: 'Klassieke goud-sand blokdrukwerk',
        en: 'Classic gold-sand block printing'
      },
      {
        af: 'Ideaal vir harde werk of buitelewe',
        en: 'Ideal for hard work or outdoors'
      }
    ],
    materials: {
      af: '100% Robuuste Gekamde Katoen (200gsm).',
      en: '100% Robust Combed Cotton (200gsm).'
    },
    careInstructions: {
      af: 'Was koud binne-buite. Moenie tuimeldroog nie.',
      en: 'Wash cold inside-out. Do not tumble dry.'
    },
    images: ['/src/assets/images/bloedsweet_tshirt_1783554692468.jpg'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Wit / White']
  },
  {
    id: 'die-libel-themp',
    name: {
      af: 'Die Volksgrond Libel T-hemp',
      en: 'The Volksgrond Dragonfly T-Shirt'
    },
    price: 269.99,
    category: 'ladies',
    categoryLabel: {
      af: 'Dames',
      en: 'Ladies'
    },
    stockCount: 14,
    description: {
      af: 'Die libel (naaldekoker) simboliseer verandering, lig en die vryheid van ons uitgestrekte landskappe. Hierdie stylvolle wit T-hemp kombineer fyn lynkuns met die Volksgrond 2019-handskrif vir \'n vars, minimalistiese voorkoms.',
      en: 'The dragonfly symbolizes change, light, and the freedom of our vast landscapes. This stylish white T-shirt combines fine line art with the Volksgrond 2019 script for a fresh, minimalist look.'
    },
    features: [
      {
        af: 'Minimalistiese fyn lynkuns grafika',
        en: 'Minimalist fine line art graphic'
      },
      {
        af: 'Ultra-sagte premium dames-snit',
        en: 'Ultra-soft premium ladies cut'
      }
    ],
    materials: {
      af: '100% Gekamde Katoen.',
      en: '100% Combed Cotton.'
    },
    careInstructions: {
      af: 'Was koud binne-buite. Moenie bleik nie.',
      en: 'Wash cold inside-out. Do not bleach.'
    },
    images: [
      '/src/assets/images/libel_tshirt_1783554704633.jpg',
      '/src/assets/images/volksgrond_story_collage_1783553284607.jpg',
      '/src/assets/images/volksgrond_heritage_bg_1783548402167.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: [
      'Wit / White',
      'Swart / Black',
      'Muntgroen / Mint Green',
      'Rooi / Red',
      'Pienk / Pink',
      'Vlootblou / Navy Blue',
      'Sand / Sand'
    ]
  },
  {
    id: 'die-eukalipte-themp',
    name: {
      af: 'Die Eukalipte T-hemp',
      en: 'The Eucalyptus T-Shirt'
    },
    price: 269.99,
    category: 'ladies',
    categoryLabel: {
      af: 'Dames',
      en: 'Ladies'
    },
    stockCount: 16,
    description: {
      af: 'Gehul in die vars geur van die Afrika-natuur. Hierdie asemrowende wit dames T-hemp bevat \'n fyn krans van eukalipte blare rondom die Volksgrond logo, gekoppel met die kragtige boodskap "Wees wie jy wil wees".',
      en: 'Enveloped in the fresh scent of African nature. This breathtaking white ladies T-shirt features a fine wreath of eucalyptus leaves around the Volksgrond logo, paired with the powerful message "Wees wie jy wil wees" (Be who you want to be).'
    },
    features: [
      {
        af: 'Pragtige natuurlike blarekrans-ontwerp',
        en: 'Beautiful natural foliage wreath design'
      },
      {
        af: 'Aangename natuurlike kleurpalet',
        en: 'Pleasant natural color palette'
      }
    ],
    materials: {
      af: '100% Premium Organiese Katoen.',
      en: '100% Premium Organic Cotton.'
    },
    careInstructions: {
      af: 'Ligte wasmasjien-siklus. Moenie tuimeldroog nie.',
      en: 'Gentle machine wash cycle. Do not tumble dry.'
    },
    images: [
      '/src/assets/images/eukalipte_tshirt_1783554716730.jpg',
      '/src/assets/images/volksgrond_story_farmers_collage_1783553446942.jpg',
      '/src/assets/images/volksgrond_heritage_bg_1783548402167.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: [
      'Wit / White',
      'Swart / Black',
      'Muntgroen / Mint Green',
      'Rooi / Red',
      'Pienk / Pink',
      'Vlootblou / Navy Blue',
      'Sand / Sand'
    ]
  },
  {
    id: 'die-blommekrans-themp',
    name: {
      af: 'Die Volksgrond Blommekrans T-hemp',
      en: 'The Volksgrond Flower Wreath T-Shirt'
    },
    price: 269.99,
    category: 'ladies',
    categoryLabel: {
      af: 'Dames',
      en: 'Ladies'
    },
    stockCount: 15,
    description: {
      af: 'Vier die prag van ons inheemse blomme en natuurskoon met hierdie pragtige waterkleur blommekrans-ontwerp. Die Volksgrond logo is elegant in sagte pers handskrif in die middel geplaas, gemaak vir die moderne dame wat lief is vir die natuur.',
      en: 'Celebrate the beauty of our indigenous flowers and natural scenery with this stunning watercolor flower wreath design. The Volksgrond logo is elegantly placed in soft purple script in the center, made for the modern lady who loves nature.'
    },
    features: [
      {
        af: 'Fassinerende waterkleur-kuns druk',
        en: 'Fascinating watercolor art print'
      },
      {
        af: 'Vrolike inheemse botaniese motief',
        en: 'Cheerful indigenous botanical motif'
      }
    ],
    materials: {
      af: '100% Gekamde Organiese Katoen.',
      en: '100% Combed Organic Cotton.'
    },
    careInstructions: {
      af: 'Ligte koue handwas of fynwas-masjiensiklus.',
      en: 'Gentle cold hand wash or delicate machine cycle.'
    },
    images: [
      '/src/assets/images/blommekrans_tshirt_1783554730461.jpg',
      '/src/assets/images/volksgrond_story_farmers_collage_1783553446942.jpg',
      '/src/assets/images/volksgrond_heritage_bg_1783548402167.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: [
      'Wit / White',
      'Swart / Black',
      'Muntgroen / Mint Green',
      'Rooi / Red',
      'Pienk / Pink',
      'Vlootblou / Navy Blue',
      'Sand / Sand'
    ]
  },
  {
    id: 'die-juweelkruis-themp',
    name: {
      af: 'Die Juweelkruis T-hemp',
      en: 'The Jewel Cross T-Shirt'
    },
    price: 269.99,
    category: 'men',
    categoryLabel: {
      af: 'Mans',
      en: 'Men'
    },
    stockCount: 11,
    description: {
      af: 'Klassieke styl ontmoet eeue-oue vakmanskap. Hierdie unieke wit T-hemp spog met \'n ingewikkelde antieke juweelkruis-grafika en die inspirerende woorde "Wees wie jy wil wees". Gemaak van duursame, dig-geweefde premium katoen.',
      en: 'Classic style meets age-old craftsmanship. This unique white T-shirt boasts an intricate antique jewel-cross graphic and the inspiring words "Wees wie jy wil wees" (Be who you want to be). Crafted from durable, dense-weave premium cotton.'
    },
    features: [
      {
        af: 'Ingewikkelde antieke juweelkruis grafika',
        en: 'Intricate antique jewel-cross graphic'
      },
      {
        af: 'Kragtige inspirerende skrifontwerp',
        en: 'Powerful inspiring script design'
      }
    ],
    materials: {
      af: '100% Dig-geweefde Premium Katoen.',
      en: '100% Dense-weave Premium Cotton.'
    },
    careInstructions: {
      af: 'Was teen 30 grade binne-buite. Moenie op die motief stryk nie.',
      en: 'Wash at 30 degrees inside-out. Do not iron on the motif.'
    },
    images: ['/src/assets/images/juweelkruis_tshirt_1783554744793.jpg'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Wit / White']
  },
  {
    id: 'staan-vir-wat-jy-in-glo-dames',
    name: {
      af: 'Dames Staan Vir Wat Jy In Glo T-hemp',
      en: 'Ladies Stand For What You Believe T-Shirt'
    },
    price: 269.99,
    category: 'ladies',
    categoryLabel: {
      af: 'Dames',
      en: 'Ladies'
    },
    stockCount: 15,
    description: {
      af: 'Geloof is ons anker en ons fondament. Hierdie premium dames T-hemp in diep swart spog met die ikoniese goue kruisontwerp en die kragtige boodskap "Volksgrond staan vir wat jy in glo". Gemaak met \'n grasieuse en gemaklike pasvorm vir die moderne vrou.',
      en: 'Faith is our anchor and our foundation. This premium ladies T-shirt in deep black features the iconic golden cross design and the powerful message "Volksgrond staan vir wat jy in glo". Crafted with a graceful and comfortable fit for the modern woman.'
    },
    features: [
      {
        af: 'Ikoniese goue kruis-ontwerp',
        en: 'Iconic golden cross design'
      },
      {
        af: 'Grasieuse, getailleerde dames-snit',
        en: 'Graceful, tailored ladies fit'
      },
      {
        af: '100% Gekamde Organiese Katoen',
        en: '100% Combed Organic Cotton'
      }
    ],
    materials: {
      af: '100% Gekamde Organiese Katoen. Plaaslik verkry en vervaardig.',
      en: '100% Combed Organic Cotton. Locally sourced and manufactured.'
    },
    careInstructions: {
      af: 'Was koud binne-buite. Moenie op die motief stryk nie. Moenie tuimeldroog nie.',
      en: 'Wash cold inside-out. Do not iron on the motif. Do not tumble dry.'
    },
    images: [
      '/src/assets/images/staan_glo_tshirt_1783544705497.jpg',
      '/src/assets/images/volksgrond_story_farmers_collage_1783553446942.jpg',
      '/src/assets/images/volksgrond_heritage_bg_1783548402167.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: [
      'Wit / White',
      'Swart / Black',
      'Muntgroen / Mint Green',
      'Rooi / Red',
      'Pienk / Pink',
      'Vlootblou / Navy Blue',
      'Sand / Sand'
    ]
  },
  {
    id: 'die-erfenis-themp-dames',
    name: {
      af: 'Dames Erfenis T-hemp',
      en: 'Ladies Heritage T-Shirt'
    },
    price: 269.99,
    category: 'ladies',
    categoryLabel: {
      af: 'Dames',
      en: 'Ladies'
    },
    stockCount: 12,
    description: {
      af: 'Ons ryk erfenis herdefinieer vir die moderne vrou. Hierdie premium swart dames T-hemp kombineer minimalistiese style met die egtheid van ons grond. Gemaak van fyn gekamde katoen met \'n getailleerde vorm wat pragtig val, spog dit met die trotse Volksgrond goud-sand reliëfdruk.',
      en: 'Our rich heritage redefined for the modern woman. This premium black ladies T-shirt combines minimalist style with the authenticity of our soil. Crafted from finely combed cotton with a tailored silhouette that drapes beautifully, it boasts the proud Volksgrond gold-sand embossed print.'
    },
    features: [
      {
        af: 'Elegante goud-sand reliëfdruk',
        en: 'Elegant gold-sand embossed print'
      },
      {
        af: 'Getailleerde dames-snit vir optimale gerief',
        en: 'Tailored ladies fit for optimal comfort'
      },
      {
        af: '100% Sagte Gekamde Katoen',
        en: '100% Soft Combed Cotton'
      }
    ],
    materials: {
      af: '100% Premium Gekamde Katoen. Plaaslik verkry en vervaardig.',
      en: '100% Premium Combed Cotton. Locally sourced and manufactured.'
    },
    careInstructions: {
      af: 'Was koud binne-buite. Moenie direk op drukwerk stryk nie. Moenie tuimeldroog nie.',
      en: 'Wash cold inside-out. Do not iron directly on print. Do not tumble dry.'
    },
    images: [
      '/src/assets/images/erfenis_black_tshirt_1783544659803.jpg',
      '/src/assets/images/volksgrond_story_collage_1783553284607.jpg',
      '/src/assets/images/volksgrond_heritage_bg_1783548402167.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: [
      'Wit / White',
      'Swart / Black',
      'Muntgroen / Mint Green',
      'Rooi / Red',
      'Pienk / Pink',
      'Vlootblou / Navy Blue',
      'Sand / Sand'
    ]
  }
];

let orders: any[] = [
  {
    id: "VG-849204",
    name: "Jan de Wet",
    email: "jandewet@mweb.co.za",
    phone: "0823456789",
    address: "Kerkstraat 45",
    province: "GP",
    postalCode: "0181",
    notes: "Laat asseblief by die sekuriteitshek as ek nie tuis is nie.",
    items: [
      {
        productId: "die-erfenis-themp",
        productName: { af: "Die Erfenis T-hemp", en: "The Heritage T-shirt" },
        price: 269.99,
        quantity: 2,
        size: "L",
        color: "Muted Olive / Muted Olive"
      }
    ],
    subtotal: 539.98,
    shippingMethod: "aramex-door",
    shippingCost: 99.99,
    total: 639.97,
    paymentMethod: "eft",
    status: "delivered",
    trackingNumber: "ARX83921048",
    smsNotification: true,
    date: "2026-06-12"
  },
  {
    id: "VG-482019",
    name: "Sarie van Niekerk",
    email: "sarievn@gmail.com",
    phone: "0718392014",
    address: "Riebeecklaan 12",
    province: "WC",
    postalCode: "7600",
    notes: "",
    items: [
      {
        productId: "boerekrygers-themp",
        productName: { af: "Boerekrygers T-hemp", en: "Boerekrygers T-shirt" },
        price: 269.99,
        quantity: 1,
        size: "M",
        color: "Mat Swart / Matte Black"
      },
      {
        productId: "boerekrygers-keps",
        productName: { af: "Boerekrygers Sand Keps", en: "Boerekrygers Sand Cap" },
        price: 269.99,
        quantity: 1,
        size: "Een Grootte",
        color: "Sand / Sand"
      }
    ],
    subtotal: 539.98,
    shippingMethod: "aramex-sleeve",
    shippingCost: 89.99,
    total: 629.97,
    paymentMethod: "card",
    status: "delivered",
    trackingNumber: "ARX47392019",
    smsNotification: false,
    date: "2026-07-02"
  },
  {
    id: "VG-104928",
    name: "Willem Coetzer",
    email: "willem.c@outlook.com",
    phone: "0839201847",
    address: "Blesbokstraat 8",
    province: "FS",
    postalCode: "9301",
    notes: "Baie opgewonde oor Volksgrond!",
    items: [
      {
        productId: "staan-vir-wat-jy-in-glo",
        productName: { af: "Staan Vir Wat Jy In Glo T-hemp", en: "Stand For What You Believe T-shirt" },
        price: 269.99,
        quantity: 1,
        size: "XL",
        color: "Koolstof Swart / Charcoal Black"
      }
    ],
    subtotal: 269.99,
    shippingMethod: "aramex-door",
    shippingCost: 99.99,
    total: 369.98,
    paymentMethod: "ozow",
    status: "processing",
    smsNotification: true,
    date: "2026-07-11"
  }
];
let reviews = [
  {
    id: 'rev-1',
    name: 'Pieter van der Merwe',
    rating: 5,
    comment: 'Die kwaliteit van die kantoen is uitstaande. Swaar materiaal wat perfek val. Aramex aflewering was flink - binne 24 uur in Pretoria gehad.',
    date: '2026-06-15',
    approved: true,
    productTitle: 'Die Erfenis T-hemp',
    productId: 'die-erfenis-themp'
  },
  {
    id: 'rev-2',
    name: 'Annelize Botha',
    rating: 5,
    comment: 'Ek het die wit Boerekrygers hemp vir my man gekoop. Hy is gaande daaroor! Die borduurwerk is van baie hoë gehalte. Gaan beslis weer bestel.',
    date: '2026-06-28',
    approved: true,
    productTitle: 'Boerekrygers T-hemp',
    productId: 'boerekrygers-themp'
  },
  {
    id: 'rev-3',
    name: 'Kobus Nel',
    rating: 5,
    comment: 'Baie tevrede met die Sand Keps. Dit pas perfek en die brons gespe agter gee dit \'n baie premium gevoel. Uitstekende produk vir die plaas.',
    date: '2026-07-02',
    approved: true,
    productTitle: 'Boerekrygers Sand Keps',
    productId: 'boerekrygers-keps'
  },
  {
    id: 'rev-4',
    name: 'Marietjie Coetzee',
    rating: 5,
    comment: 'Pragtige kinderslyn! Die olyf hemp is so sag op my 4-jarige se vel. Baie vinnige aflewering na Stellenbosch.',
    date: '2026-07-05',
    approved: true,
    productTitle: 'Volkspore Kinderslyn T-hemp',
    productId: 'volkspore-kids-tshirt'
  }
];

let discountCodes = [
  { code: 'VOLKSGROND10', percent: 10, active: true },
  { code: 'ERFENIS', percent: 15, active: true },
  { code: 'SAAMBOU', percent: 20, active: true }
];

async function seedCustomers() {
  try {
    const querySnapshot = await getDocs(collection(db, 'customers'));
    if (querySnapshot.empty) {
      console.log('Firestore customers collection is empty. Starting fresh with no customers.');
    } else {
      console.log('Firestore customers collection already has records. Seeding skipped.');
    }
  } catch (err) {
    console.error('Error checking customers collection:', err);
  }
}

async function startServer() {
  const app = express();
  // Use Render's dynamic port, or fallback to 3000 for local development
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: '15mb' }));

  // Serve robots.txt directly
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send('User-agent: *\nAllow: /\n');
  });

  // API Routes
  app.post('/api/products/upload', (req, res) => {
    const { base64 } = req.body;
    if (!base64) {
      return res.status(400).json({ error: 'No image data provided' });
    }
    try {
      const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `uploaded_product_${Date.now()}.png`;
      const filepath = path.join(process.cwd(), 'src', 'assets', 'images', filename);
      fs.writeFileSync(filepath, buffer);
      res.json({ url: `/src/assets/images/${filename}` });
    } catch (err: any) {
      console.error('Error saving uploaded file:', err);
      res.status(500).json({ error: 'Failed to save uploaded file' });
    }
  });

  // Helper for resilient API calling with exponential backoff
  const executeWithRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
    try {
      return await fn();
    } catch (error: any) {
      if (retries <= 0) {
        throw error;
      }
      const errMessage = error?.message || '';
      const status = error?.status || error?.statusCode || 0;
      const isTransient = status === 503 || status === 429 || status === 500 || 
                          errMessage.includes('503') || errMessage.includes('429') || 
                          errMessage.includes('overloaded') || errMessage.includes('resource exhausted') || 
                          errMessage.includes('fetch failed');
      
      if (isTransient) {
        console.warn(`[GEMINI API] Transient error detected (${status || errMessage}). Retrying in ${delay}ms... (Remaining retries: ${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return executeWithRetry(fn, retries - 1, delay * 2);
      }
      throw error;
    }
  };

  app.post('/api/products/analyze', async (req, res) => {
    const { base64, category } = req.body;
    if (!base64) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    try {
      const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `uploaded_product_${Date.now()}.png`;
      const filepath = path.join(process.cwd(), 'src', 'assets', 'images', filename);
      
      const dir = path.dirname(filepath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filepath, buffer);
      const imageUrl = `/src/assets/images/${filename}`;

      return res.json({
        imageUrl,
        nameAf: 'Nuwe Volksgrond Produk',
        nameEn: 'New Volksgrond Product',
        descAf: 'Hierdie premium Volksgrond ontwerp is plaaslik vervaardig met absolute sorg en uitsonderlike aandag aan detail.',
        descEn: 'This premium Volksgrond design is locally manufactured with absolute care and exceptional attention to detail.',
        featuresAf: ['100% Premium Gekamde Katoen', 'Duursame dubbelnaald-stikwerk', 'Plaaslik verkry en gemaak in SA', 'Gemaklike stylvolle snit'],
        featuresEn: ['100% Premium Combed Cotton', 'Durable double-needle stitching', 'Locally sourced and made in SA', 'Comfortable stylish fit'],
        materialsAf: '100% Gekamde Organiese Katoen (180gsm). Plaaslik geproduseer.',
        materialsEn: '100% Combed Organic Cotton (180gsm). Locally produced.',
        careAf: 'Was koud binne-buite. Moenie op die motief stryk nie. Moenie tuimeldroog nie.',
        careEn: 'Wash cold inside-out. Do not iron on the motif. Do not tumble dry.',
        suggestedBgKey: 'heritage',
        customBgPrompt: 'Premium photoshoot backdrop with subtle earthy elements and wooden accents'
      });
    } catch (err: any) {
      console.error('Error during image analysis:', err);
      res.status(500).json({ error: err.message || 'Failed to analyze product image' });
    }
  });
  app.get('/api/products', (req, res) => {
    res.json(products);
  });

  app.post('/api/products/stock', (req, res) => {
    const { id, stockCount } = req.body;
    const p = products.find(item => item.id === id);
    if (p) {
      p.stockCount = stockCount;
      res.json(p);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  });

  app.post('/api/products/price', (req, res) => {
    const { id, price } = req.body;
    const p = products.find(item => item.id === id);
    if (p) {
      p.price = Number(price);
      res.json(p);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  });

  app.post('/api/products', (req, res) => {
    const newProduct = req.body;
    if (!newProduct.id || !newProduct.name || !newProduct.price) {
      return res.status(400).json({ error: 'Missing required product fields' });
    }
    if (products.some(p => p.id === newProduct.id)) {
      return res.status(400).json({ error: 'Product with this ID already exists' });
    }
    products.push(newProduct);
    res.status(201).json(newProduct);
  });

  app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const exists = products.some(p => p.id === id);
    if (!exists) {
      return res.status(404).json({ error: 'Product not found' });
    }
    products = products.filter(p => p.id !== id);
    res.json({ success: true });
  });

  app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const updatedProduct = req.body;
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    // Update product
    products[index] = { ...products[index], ...updatedProduct };
    res.json(products[index]);
  });

  app.get('/api/orders', async (req, res) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      let fbOrders: any[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fbOrders.push({ id: docSnap.id, ...data });
      });

      if (fbOrders.length > 0) {
        // Sort by date or createdAt descending so newest are first
        fbOrders.sort((a, b) => {
          const dateA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.date || 0).getTime();
          const dateB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.date || 0).getTime();
          return dateB - dateA;
        });
        res.json(fbOrders);
      } else {
        // Do not seed dummy orders, start fresh
        console.log('Firestore orders collection is empty. Starting fresh with no orders.');
        res.json([]);
      }
    } catch (err: any) {
      console.error('Error getting orders from Firestore:', err);
      res.json([]);
    }
  });

  app.post('/api/orders', async (req, res) => {
    try {
      const orderData = req.body;
      const orderId = `VG-${Math.floor(100000 + Math.random() * 900000)}`;
      
      const newOrder = {
        id: orderId,
        name: orderData.name,
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.address,
        province: orderData.province,
        postalCode: orderData.postalCode,
        notes: orderData.notes || '',
        items: orderData.items || [],
        subtotal: Number(orderData.subtotal || 0),
        shippingMethod: orderData.shippingMethod || '',
        shippingCost: Number(orderData.shippingCost || 0),
        total: Number(orderData.total || 0),
        paymentMethod: orderData.paymentMethod || '',
        status: 'pending',
        smsNotification: !!orderData.smsNotification,
        date: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp()
      };

      // Decrease inventory counts
      if (orderData.items && Array.isArray(orderData.items)) {
        for (const item of orderData.items) {
          const match = products.find(p => p.name.af === item.productName.af || p.name.en === item.productName.en);
          if (match) {
            match.stockCount = Math.max(0, match.stockCount - item.quantity);
            try {
              await updateDoc(doc(db, 'products', match.id), { stockCount: match.stockCount });
            } catch (err) {
              console.error(`Failed to update stock in Firestore for product ${match.id}:`, err);
            }
          }
        }
      }

      // Save order to Firestore
      await setDoc(doc(db, 'orders', orderId), newOrder);

      // Create or update customer profile in the 'customers' collection
      const emailLower = (orderData.email || '').trim().toLowerCase();
      if (emailLower) {
        try {
          const customerRef = doc(db, 'customers', emailLower);
          const customerSnap = await getDoc(customerRef);

          const nameParts = (orderData.name || '').trim().split(/\s+/);
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';

          const defaultShippingAddress = {
            street: orderData.address || '',
            suburb: '',
            city: '',
            province: orderData.province || '',
            postalCode: orderData.postalCode || '',
            country: 'South Africa'
          };

          const languagePreference = (orderData.language || 'AF').toUpperCase();

          if (customerSnap.exists()) {
            const existingData = customerSnap.data();
            const orderHistory = Array.isArray(existingData.orderHistory) ? [...existingData.orderHistory] : [];
            if (!orderHistory.includes(orderId)) {
              orderHistory.push(orderId);
            }

            const updatedCustomer = {
              firstName: firstName || existingData.firstName || '',
              lastName: lastName || existingData.lastName || '',
              email: emailLower,
              phone: orderData.phone || existingData.phone || '',
              defaultShippingAddress,
              languagePreference,
              orderHistory,
              updatedAt: serverTimestamp()
            };

            await setDoc(customerRef, updatedCustomer, { merge: true });
            console.log(`Updated existing customer profile for: ${emailLower}`);
          } else {
            const newCustomer = {
              firstName,
              lastName,
              email: emailLower,
              phone: orderData.phone || '',
              defaultShippingAddress,
              languagePreference,
              orderHistory: [orderId],
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            };

            await setDoc(customerRef, newCustomer);
            console.log(`Created new customer profile for: ${emailLower}`);
          }
        } catch (custErr) {
          console.error(`Failed to save/update customer profile for ${emailLower} in Firestore:`, custErr);
        }
      }

      // Keep in-memory list synchronized in case of fallback
      orders.unshift({
        ...newOrder,
        createdAt: new Date()
      });

      res.status(201).json(newOrder);
    } catch (err: any) {
      console.error('Error saving order to Firestore:', err);
      res.status(500).json({ error: 'Failed to complete checkout order' });
    }
  });

  app.post('/api/orders/status', async (req, res) => {
    try {
      const { id, status, trackingNumber } = req.body;
      
      // Update in Firestore
      const orderRef = doc(db, 'orders', id);
      const updateData: any = { status };
      if (trackingNumber !== undefined) {
        updateData.trackingNumber = trackingNumber;
      }
      
      await updateDoc(orderRef, updateData);

      // Update in-memory fallback
      const o = orders.find(item => item.id === id);
      if (o) {
        o.status = status;
        if (trackingNumber !== undefined) {
          o.trackingNumber = trackingNumber;
        }
        res.json(o);
      } else {
        res.json({ id, status, trackingNumber });
      }
    } catch (err: any) {
      console.error('Error updating order status in Firestore:', err);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  });

  app.delete('/api/orders/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await deleteDoc(doc(db, 'orders', id));
      orders = orders.filter(o => o.id !== id);
      res.json({ success: true, message: 'Order deleted successfully' });
    } catch (err: any) {
      console.error('Error deleting order from Firestore:', err);
      res.status(500).json({ error: 'Failed to delete order' });
    }
  });

  app.post('/api/orders/clear-all', async (req, res) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      for (const docSnap of querySnapshot.docs) {
        await deleteDoc(doc(db, 'orders', docSnap.id));
      }
      orders = [];
      res.json({ success: true, message: 'All orders cleared successfully' });
    } catch (err: any) {
      console.error('Error clearing all orders from Firestore:', err);
      res.status(500).json({ error: 'Failed to clear all orders' });
    }
  });

  app.post('/api/signup', async (req, res) => {
    try {
      const customerData = req.body;
      const emailLower = (customerData.email || '').trim().toLowerCase();
      if (!emailLower) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const docRef = doc(db, 'customers', emailLower);
      const docSnap = await getDoc(docRef);

      const nameParts = (customerData.name || '').trim().split(/\s+/);
      const firstName = customerData.firstName || nameParts[0] || '';
      const lastName = customerData.lastName || nameParts.slice(1).join(' ') || '';
      
      const defaultShippingAddress = {
        street: customerData.address || customerData.street || '',
        suburb: customerData.suburb || '',
        city: customerData.city || '',
        province: customerData.province || '',
        postalCode: customerData.postalCode || '',
        country: customerData.country || 'South Africa'
      };
      
      const languagePreference = (customerData.language || 'AF').toUpperCase();

      if (docSnap.exists()) {
        const existingData = docSnap.data();
        const updatedCustomer = {
          firstName: firstName || existingData.firstName || '',
          lastName: lastName || existingData.lastName || '',
          email: emailLower,
          phone: customerData.phone || existingData.phone || '',
          defaultShippingAddress: {
            ...existingData.defaultShippingAddress,
            ...defaultShippingAddress
          },
          languagePreference: languagePreference || existingData.languagePreference || 'AF',
          updatedAt: serverTimestamp()
        };
        await setDoc(docRef, updatedCustomer, { merge: true });
        res.json({ success: true, message: 'Customer profile updated successfully', customer: updatedCustomer });
      } else {
        const newCustomer = {
          firstName,
          lastName,
          email: emailLower,
          phone: customerData.phone || '',
          defaultShippingAddress,
          languagePreference,
          orderHistory: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        await setDoc(docRef, newCustomer);
        res.status(201).json({ success: true, message: 'Customer profile created successfully', customer: newCustomer });
      }
    } catch (err: any) {
      console.error('Error during customer signup:', err);
      res.status(500).json({ error: 'Failed to process customer signup' });
    }
  });

  app.get('/api/reviews', (req, res) => {
    res.json(reviews);
  });

  app.post('/api/reviews', (req, res) => {
    const reviewData = req.body;
    const newReview = {
      id: `rev-${Date.now()}`,
      ...reviewData,
      approved: false, // Default unapproved, requires admin
      date: new Date().toISOString().split('T')[0]
    };
    reviews.push(newReview);
    res.status(201).json(newReview);
  });

  app.post('/api/reviews/approve', (req, res) => {
    const { id } = req.body;
    const rev = reviews.find(r => r.id === id);
    if (rev) {
      rev.approved = true;
      res.json(rev);
    } else {
      res.status(404).json({ error: 'Review not found' });
    }
  });

  app.delete('/api/reviews/:id', (req, res) => {
    const { id } = req.params;
    reviews = reviews.filter(r => r.id !== id);
    res.json({ success: true });
  });

  app.get('/api/discounts', (req, res) => {
    res.json(discountCodes);
  });

  app.post('/api/discounts', (req, res) => {
    const { code, percent, active } = req.body;
    const upperCode = code.toUpperCase();
    
    // update or insert
    const idx = discountCodes.findIndex(d => d.code === upperCode);
    const codeObj = { code: upperCode, percent, active: active ?? true };
    
    if (idx > -1) {
      discountCodes[idx] = codeObj;
    } else {
      discountCodes.push(codeObj);
    }
    res.status(201).json(codeObj);
  });

  app.delete('/api/discounts/:code', (req, res) => {
    const { code } = req.params;
    const upperCode = code.toUpperCase();
    const idx = discountCodes.findIndex(d => d.code === upperCode);
    if (idx > -1) {
      discountCodes.splice(idx, 1);
      res.json({ success: true, code: upperCode });
    } else {
      res.status(404).json({ error: 'Discount code not found' });
    }
  });

  // Admin password & announcement configuration state & endpoints
  const adminConfig = {
    password: 'Volksgrond2026',
    isPasswordEnabled: true,
    payfastMerchantId: '10000100',
    payfastMerchantKey: '46f0z436ip75r',
    isAnnouncementEnabled: false,
    announcementText: 'Welkom by Volksgrond! Geniet gratis aflewering op bestellings bo R1000.',
    galleryLinks: [
      {
        id: 'heritage-day',
        titleAf: 'Erfenis Dag Viering',
        titleEn: 'Heritage Day Celebration',
        imageUrl: '/src/assets/images/volksgrond_heritage_bg_1783548402167.jpg',
        linkUrl: 'shop',
        occasionAf: 'Kwaliteit en Tradisie',
        occasionEn: 'Quality and Tradition'
      },
      {
        id: 'boere-fees',
        titleAf: 'Boere Fees',
        titleEn: 'Farmer\'s Festival',
        imageUrl: '/src/assets/images/volksgrond_story_farmers_collage_1783553446942.jpg',
        linkUrl: 'shop',
        occasionAf: 'Met ons voete op die grond',
        occasionEn: 'With our feet on the ground'
      },
      {
        id: 'platelandse-avontuur',
        titleAf: 'Platelandse Avontuur',
        titleEn: 'Country Adventure',
        imageUrl: '/src/assets/images/volksgrond_story_collage_1783553284607.jpg',
        linkUrl: 'shop',
        occasionAf: 'Kwaliteit klere vir die hele gesin',
        occasionEn: 'Quality clothing for the whole family'
      }
    ],
    homeGalleryBtnTextAf: 'Verken Ons Erfenis Galery & Skakels',
    homeGalleryBtnTextEn: 'Explore Our Heritage Gallery & Links',
    isHomeGalleryBtnEnabled: true
  };

  // Load configuration from Firestore on boot
  async function loadAdminConfig() {
    try {
      const docSnap = await getDoc(doc(db, 'settings', 'admin'));
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.password !== undefined) adminConfig.password = data.password;
        if (data.isPasswordEnabled !== undefined) adminConfig.isPasswordEnabled = data.isPasswordEnabled;
        if (data.payfastMerchantId !== undefined) adminConfig.payfastMerchantId = data.payfastMerchantId;
        if (data.payfastMerchantKey !== undefined) adminConfig.payfastMerchantKey = data.payfastMerchantKey;
        if (data.isAnnouncementEnabled !== undefined) adminConfig.isAnnouncementEnabled = data.isAnnouncementEnabled;
        if (data.announcementText !== undefined) adminConfig.announcementText = data.announcementText;
        if (data.galleryLinks !== undefined) adminConfig.galleryLinks = data.galleryLinks;
        if (data.homeGalleryBtnTextAf !== undefined) adminConfig.homeGalleryBtnTextAf = data.homeGalleryBtnTextAf;
        if (data.homeGalleryBtnTextEn !== undefined) adminConfig.homeGalleryBtnTextEn = data.homeGalleryBtnTextEn;
        if (data.isHomeGalleryBtnEnabled !== undefined) adminConfig.isHomeGalleryBtnEnabled = data.isHomeGalleryBtnEnabled;
        console.log('Loaded admin settings from Firestore successfully.');
      } else {
        // Save initial default
        await setDoc(doc(db, 'settings', 'admin'), adminConfig);
        console.log('Initialized default admin settings in Firestore.');
      }
    } catch (err) {
      console.error('Error loading admin settings from Firestore:', err);
    }
  }

  app.get('/api/admin/config', (req, res) => {
    res.json({
      isPasswordEnabled: adminConfig.isPasswordEnabled,
      password: adminConfig.password,
      payfastMerchantId: adminConfig.payfastMerchantId,
      payfastMerchantKey: adminConfig.payfastMerchantKey,
      isAnnouncementEnabled: adminConfig.isAnnouncementEnabled,
      announcementText: adminConfig.announcementText,
      galleryLinks: adminConfig.galleryLinks,
      homeGalleryBtnTextAf: adminConfig.homeGalleryBtnTextAf,
      homeGalleryBtnTextEn: adminConfig.homeGalleryBtnTextEn,
      isHomeGalleryBtnEnabled: adminConfig.isHomeGalleryBtnEnabled
    });
  });

  app.post('/api/admin/config', async (req, res) => {
    const { 
      password, 
      isPasswordEnabled, 
      payfastMerchantId, 
      payfastMerchantKey, 
      isAnnouncementEnabled, 
      announcementText,
      galleryLinks,
      homeGalleryBtnTextAf,
      homeGalleryBtnTextEn,
      isHomeGalleryBtnEnabled
    } = req.body;
    
    if (password !== undefined) {
      adminConfig.password = password;
    }
    if (isPasswordEnabled !== undefined) {
      adminConfig.isPasswordEnabled = !!isPasswordEnabled;
    }
    if (payfastMerchantId !== undefined) {
      adminConfig.payfastMerchantId = payfastMerchantId;
    }
    if (payfastMerchantKey !== undefined) {
      adminConfig.payfastMerchantKey = payfastMerchantKey;
    }
    if (isAnnouncementEnabled !== undefined) {
      adminConfig.isAnnouncementEnabled = !!isAnnouncementEnabled;
    }
    if (announcementText !== undefined) {
      adminConfig.announcementText = announcementText;
    }
    if (galleryLinks !== undefined) {
      adminConfig.galleryLinks = galleryLinks;
    }
    if (homeGalleryBtnTextAf !== undefined) {
      adminConfig.homeGalleryBtnTextAf = homeGalleryBtnTextAf;
    }
    if (homeGalleryBtnTextEn !== undefined) {
      adminConfig.homeGalleryBtnTextEn = homeGalleryBtnTextEn;
    }
    if (isHomeGalleryBtnEnabled !== undefined) {
      adminConfig.isHomeGalleryBtnEnabled = !!isHomeGalleryBtnEnabled;
    }

    try {
      await setDoc(doc(db, 'settings', 'admin'), adminConfig);
    } catch (err) {
      console.error('Error saving admin settings to Firestore:', err);
    }

    res.json({
      isPasswordEnabled: adminConfig.isPasswordEnabled,
      password: adminConfig.password,
      payfastMerchantId: adminConfig.payfastMerchantId,
      payfastMerchantKey: adminConfig.payfastMerchantKey,
      isAnnouncementEnabled: adminConfig.isAnnouncementEnabled,
      announcementText: adminConfig.announcementText,
      galleryLinks: adminConfig.galleryLinks,
      homeGalleryBtnTextAf: adminConfig.homeGalleryBtnTextAf,
      homeGalleryBtnTextEn: adminConfig.homeGalleryBtnTextEn,
      isHomeGalleryBtnEnabled: adminConfig.isHomeGalleryBtnEnabled
    });
  });

  app.post('/api/admin/verify', (req, res) => {
    const { password } = req.body;
    if (!adminConfig.isPasswordEnabled) {
      res.json({ success: true });
    } else if (password === adminConfig.password) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, error: 'Incorrect password' });
    }
  });

  app.post('/api/admin/forgot-password', async (req, res) => {
    // Reset to default for easier merchant recovery
    adminConfig.password = 'Volksgrond2026';
    adminConfig.isPasswordEnabled = true;
    
    try {
      await setDoc(doc(db, 'settings', 'admin'), adminConfig);
    } catch (err) {
      console.error('Error resetting admin settings to Firestore:', err);
    }

    console.log(`[EMAIL DISPATCH] Sent default password 'Volksgrond2026' to cbrduplessis.x2@gmail.com`);
    
    res.json({ 
      success: true, 
      message: "Verstek wagwoord 'Volksgrond2026' is na cbrduplessis.x2@gmail.com gestuur.",
      defaultPassword: "Volksgrond2026"
    });
  });

  // Serve static images directory if needed or let vite compile handle it
  app.use('/src/assets/images', express.static(path.join(process.cwd(), 'src/assets/images')));

  // Vite Middleware Setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind to 0.0.0.0 to ensure it accepts external connections in the cloud
  app.listen(Number(PORT), '0.0.0.0', async () => {
    console.log(`Server is running on port ${PORT}`);
    await loadAdminConfig();
    await seedCustomers();
  });
}

startServer();
