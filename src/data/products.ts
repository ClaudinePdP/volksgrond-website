import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
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
      af: 'Niks spreek van ons ryk erfenis soos die vryheid van ons Suid-Afrikaanse bodem nie. Hierdie premium swart T-hemp is spesiaal ontwerp vir die moderne man wat trots is op sy tradisies en weier om sy waardes te kompromitteer. Dit dra die handelsmerk se handtekening en is gemaak van die hoogste gehalte, dig-geweefde katoen vir uiterste gerief en langdurige duursaamheid.',
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
        af: 'Hipoallergeen en natuurlik gekleur',
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
      af: 'Geloof is ons anker en ons fondament. Hierdie luukse swart T-hemp spog met \'n treffende goud-borsel kruisgrafika en die verheffende woorde "Staan vir wat jy in glo". Gemaak van hoë-gehalte katoen vir \'n ongeëwenaarde gemaklike pasvorm.',
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
      af: 'Ons ryk erfenis herdefinieer vir die moderne vrou. Hierdie premium swart dames T-hemp kombineer minimalistiese styl met die egtheid van ons grond. Gemaak van fyn gekamde katoen met \'n getailleerde vorm wat pragtig val, spog dit met die trotse Volksgrond goud-sand reliëfdruk.',
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
