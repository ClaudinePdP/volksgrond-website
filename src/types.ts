export type Language = 'af' | 'en';

export type View =
  | 'home'
  | 'shop'
  | 'product-details'
  | 'cart'
  | 'checkout'
  | 'about'
  | 'contact'
  | 'admin'
  | 'track-order'
  | 'shipping-policy'
  | 'returns-policy'
  | 'privacy-policy'
  | 'terms-and-conditions'
  | 'gallery-links';

export interface TranslationSet {
  af: string;
  en: string;
}

export interface Product {
  id: string;
  name: TranslationSet;
  price: number;
  originalPrice?: number;
  category: 'men' | 'ladies' | 'volkspore' | 'caps';
  categoryLabel: TranslationSet;
  stockCount: number;
  description: TranslationSet;
  features: TranslationSet[];
  materials: TranslationSet;
  careInstructions: TranslationSet;
  images: string[];
  sizes: string[];
  colors: string[];
  costPrice?: number;
  isPromo?: boolean;
  promoText?: TranslationSet;
  displayLocation?: 'home_featured' | 'home_collection' | 'categories' | 'shop_only';
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Order {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  province: string;
  postalCode: string;
  notes?: string;
  items: {
    productName: TranslationSet;
    price: number;
    quantity: number;
    size: string;
    color: string;
  }[];
  subtotal: number;
  shippingMethod: 'aramex-door' | 'aramex-sleeve' | 'postnet' | 'courier-guy';
  shippingCost: number;
  total: number;
  paymentMethod: 'payfast' | 'eft';
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  trackingNumber?: string;
  smsNotification: boolean;
  date: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
  productTitle: string;
  productId: string;
}

export interface DiscountCode {
  code: string;
  percent: number;
  active: boolean;
}

export interface GalleryLink {
  id: string;
  titleAf: string;
  titleEn: string;
  imageUrl: string;
  linkUrl: string;
  occasionAf?: string;
  occasionEn?: string;
}

