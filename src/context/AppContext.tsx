import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, View, Product, CartItem, Order, Review, DiscountCode, GalleryLink } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  view: View;
  setView: (view: View) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, size: string, color: string) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  promoCode: string;
  appliedDiscount: DiscountCode | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  orders: Order[];
  submitOrder: (orderData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    province: string;
    postalCode: string;
    notes?: string;
    shippingMethod: 'aramex-door' | 'aramex-sleeve' | 'postnet' | 'courier-guy';
    shippingCost: number;
    paymentMethod: 'payfast' | 'eft';
    smsNotification: boolean;
  }) => Promise<Order>;
  reviews: Review[];
  addReview: (reviewData: {
    name: string;
    rating: number;
    comment: string;
    productId: string;
    productTitle: string;
  }) => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
  sizeFilter: string | null;
  setSizeFilter: (size: string | null) => void;
  products: Product[];
  isLoading: boolean;
  
  // Admin functions
  addProduct: (product: Product) => Promise<void>;
  editProduct: (id: string, product: Product) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  updateProductStock: (id: string, count: number) => Promise<void>;
  updateProductPrice: (id: string, price: number) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status'], tracking?: string) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  clearAllOrders: () => Promise<void>;
  discountCodes: DiscountCode[];
  createDiscountCode: (code: string, percent: number) => Promise<void>;
  removeDiscountCode: (code: string) => Promise<void>;
  approveReview: (reviewId: string) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  isUnlocked: boolean;
  setIsUnlocked: (unlocked: boolean) => void;
  adminPassword: string;
  isPasswordEnabled: boolean;
  verifyAdminPassword: (password: string) => Promise<boolean>;
  updateAdminConfig: (password: string, isPasswordEnabled: boolean) => Promise<void>;
  resetAdminPassword: () => Promise<string>;
  payfastMerchantId: string;
  payfastMerchantKey: string;
  updatePayfastConfig: (merchantId: string, merchantKey: string) => Promise<void>;
  isAnnouncementEnabled: boolean;
  announcementText: string;
  updateAnnouncementConfig: (enabled: boolean, text: string) => Promise<void>;
  galleryLinks: GalleryLink[];
  homeGalleryBtnTextAf: string;
  homeGalleryBtnTextEn: string;
  isHomeGalleryBtnEnabled: boolean;
  updateGalleryConfig: (links: GalleryLink[], btnTextAf: string, btnTextEn: string, enabled: boolean) => Promise<void>;
  globalSizeGuideOpen: boolean;
  setGlobalSizeGuideOpen: (open: boolean) => void;
  lastCalculatedSize: string | null;
  setLastCalculatedSize: (size: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_REVIEWS: Review[] = [
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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('af');
  const [view, setViewState] = useState<View>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  
  // Admin password lock states
  const [isUnlocked, setIsUnlockedState] = useState<boolean>(() => {
    return sessionStorage.getItem('vg_admin_unlocked') === 'true';
  });
  const [adminPassword, setAdminPassword] = useState<string>('Volksgrond2026');
  const [isPasswordEnabled, setIsPasswordEnabled] = useState<boolean>(true);
  
  // PayFast credentials states
  const [payfastMerchantId, setPayfastMerchantId] = useState<string>('10000100');
  const [payfastMerchantKey, setPayfastMerchantKey] = useState<string>('46f0z436ip75r');

  // Announcement states
  const [isAnnouncementEnabled, setIsAnnouncementEnabled] = useState<boolean>(false);
  const [announcementText, setAnnouncementText] = useState<string>('Welkom by Volksgrond! Geniet gratis aflewering op bestellings bo R1000.');

  // Gallery and Useful Links states
  const [galleryLinks, setGalleryLinks] = useState<GalleryLink[]>([]);
  const [homeGalleryBtnTextAf, setHomeGalleryBtnTextAf] = useState<string>('Verken Ons Erfenis Galery & Skakels');
  const [homeGalleryBtnTextEn, setHomeGalleryBtnTextEn] = useState<string>('Explore Our Heritage Gallery & Links');
  const [isHomeGalleryBtnEnabled, setIsHomeGalleryBtnEnabled] = useState<boolean>(true);

  const setIsUnlocked = (unlocked: boolean) => {
    setIsUnlockedState(unlocked);
    sessionStorage.setItem('vg_admin_unlocked', unlocked ? 'true' : 'false');
  };

  // Real or Fallback states
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>(DEFAULT_REVIEWS);
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([
    { code: 'VOLKSGROND10', percent: 10, active: true },
    { code: 'ERFENIS', percent: 15, active: true },
    { code: 'SAAMBOU', percent: 20, active: true }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [globalSizeGuideOpen, setGlobalSizeGuideOpen] = useState<boolean>(false);
  const [lastCalculatedSize, setLastCalculatedSize] = useState<string | null>(null);

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sizeFilter, setSizeFilter] = useState<string | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('vg_lang') as Language;
    if (savedLang) setLanguageState(savedLang);

    const savedCart = localStorage.getItem('vg_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart', e);
      }
    }

    const savedWish = localStorage.getItem('vg_wishlist');
    if (savedWish) {
      try {
        setWishlist(JSON.parse(savedWish));
      } catch (e) {
        console.error('Error loading wishlist', e);
      }
    }

    // Hydrate password settings locally too
    const savedPass = localStorage.getItem('vg_admin_password');
    if (savedPass) setAdminPassword(savedPass);
    const savedEnabled = localStorage.getItem('vg_admin_password_enabled');
    if (savedEnabled) setIsPasswordEnabled(savedEnabled === 'true');

    // Hydrate PayFast settings locally
    const savedMerchantId = localStorage.getItem('vg_payfast_merchant_id');
    if (savedMerchantId) setPayfastMerchantId(savedMerchantId);
    const savedMerchantKey = localStorage.getItem('vg_payfast_merchant_key');
    if (savedMerchantKey) setPayfastMerchantKey(savedMerchantKey);

    // Hydrate announcement settings locally
    const savedAnnouncementEnabled = localStorage.getItem('vg_announcement_enabled');
    if (savedAnnouncementEnabled) setIsAnnouncementEnabled(savedAnnouncementEnabled === 'true');
    const savedAnnouncementText = localStorage.getItem('vg_announcement_text');
    if (savedAnnouncementText) setAnnouncementText(savedAnnouncementText);

    // Hydrate gallery settings locally
    const savedGalleryLinks = localStorage.getItem('vg_gallery_links');
    if (savedGalleryLinks) {
      try {
        setGalleryLinks(JSON.parse(savedGalleryLinks));
      } catch (e) {
        console.error('Error loading gallery links from local storage', e);
      }
    }
    const savedHomeGalleryBtnTextAf = localStorage.getItem('vg_home_gallery_btn_text_af');
    if (savedHomeGalleryBtnTextAf) setHomeGalleryBtnTextAf(savedHomeGalleryBtnTextAf);
    const savedHomeGalleryBtnTextEn = localStorage.getItem('vg_home_gallery_btn_text_en');
    if (savedHomeGalleryBtnTextEn) setHomeGalleryBtnTextEn(savedHomeGalleryBtnTextEn);
    const savedHomeGalleryBtnEnabled = localStorage.getItem('vg_is_home_gallery_btn_enabled');
    if (savedHomeGalleryBtnEnabled) setIsHomeGalleryBtnEnabled(savedHomeGalleryBtnEnabled === 'true');
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('vg_lang', lang);
  };

  const setView = (v: View) => {
    setViewState(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Synchronize database states from Firestore for products, and Express server for other entities
  const fetchBackendData = async () => {
    try {
      setIsLoading(true);

      // Fetch products from Firebase Firestore 'products' collection
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const fbProducts: Product[] = [];
        querySnapshot.forEach((docSnap) => {
          fbProducts.push({ id: docSnap.id, ...docSnap.data() } as Product);
        });

        if (fbProducts.length > 0) {
          setProducts(fbProducts);
        } else {
          // If Firestore is empty, seed it with INITIAL_PRODUCTS
          console.log('Firestore products collection is empty. Seeding INITIAL_PRODUCTS to Firestore...');
          for (const prod of INITIAL_PRODUCTS) {
            await setDoc(doc(db, 'products', prod.id), prod);
          }
          setProducts(INITIAL_PRODUCTS);
        }
      } catch (firestoreError) {
        console.error('Error fetching products from Firestore, falling back to server API:', firestoreError);
        const prodRes = await fetch('/api/products');
        if (prodRes.ok) {
          const data = await prodRes.json();
          if (data && data.length > 0) setProducts(data);
        }
      }

      const ordersRes = await fetch('/api/orders');
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data);
      }

      const reviewsRes = await fetch('/api/reviews');
      if (reviewsRes.ok) {
        const data = await reviewsRes.json();
        if (data && data.length > 0) setReviews(data);
      }

      const discountsRes = await fetch('/api/discounts');
      if (discountsRes.ok) {
        const data = await discountsRes.json();
        if (data && data.length > 0) setDiscountCodes(data);
      }

      const configRes = await fetch('/api/admin/config');
      if (configRes.ok) {
        const config = await configRes.json();
        setAdminPassword(config.password);
        setIsPasswordEnabled(config.isPasswordEnabled);
        if (config.payfastMerchantId) setPayfastMerchantId(config.payfastMerchantId);
        if (config.payfastMerchantKey) setPayfastMerchantKey(config.payfastMerchantKey);
        if (config.isAnnouncementEnabled !== undefined) setIsAnnouncementEnabled(config.isAnnouncementEnabled);
        if (config.announcementText !== undefined) setAnnouncementText(config.announcementText);
        
        // Load gallery config
        if (config.galleryLinks) setGalleryLinks(config.galleryLinks);
        if (config.homeGalleryBtnTextAf) setHomeGalleryBtnTextAf(config.homeGalleryBtnTextAf);
        if (config.homeGalleryBtnTextEn) setHomeGalleryBtnTextEn(config.homeGalleryBtnTextEn);
        if (config.isHomeGalleryBtnEnabled !== undefined) setIsHomeGalleryBtnEnabled(config.isHomeGalleryBtnEnabled);
      }
    } catch (e) {
      console.warn('Backend not running or offline, using robust client state fallback.', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  // Save cart and wishlist changes
  const saveCartToStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('vg_cart', JSON.stringify(newCart));
  };

  const addToCart = (product: Product, quantity: number, size: string, color: string) => {
    const existingIndex = cart.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === size &&
        item.selectedColor === color
    );

    let newCart = [...cart];
    if (existingIndex > -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({ product, quantity, selectedSize: size, selectedColor: color });
    }
    saveCartToStorage(newCart);
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    const newCart = cart.filter(
      (item) =>
        !(
          item.product.id === productId &&
          item.selectedSize === size &&
          item.selectedColor === color
        )
    );
    saveCartToStorage(newCart);
  };

  const updateCartQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    const newCart = cart.map((item) => {
      if (
        item.product.id === productId &&
        item.selectedSize === size &&
        item.selectedColor === color
      ) {
        return { ...item, quantity };
      }
      return item;
    });
    saveCartToStorage(newCart);
  };

  const clearCart = () => {
    saveCartToStorage([]);
    setPromoCode('');
    setAppliedDiscount(null);
  };

  const toggleWishlist = (productId: string) => {
    let newWishlist = [...wishlist];
    if (wishlist.includes(productId)) {
      newWishlist = newWishlist.filter((id) => id !== productId);
    } else {
      newWishlist.push(productId);
    }
    setWishlist(newWishlist);
    localStorage.setItem('vg_wishlist', JSON.stringify(newWishlist));
  };

  const applyPromoCode = (code: string) => {
    const normalized = code.trim().toUpperCase();
    const discount = discountCodes.find((d) => d.code === normalized && d.active);
    
    if (discount) {
      setPromoCode(normalized);
      setAppliedDiscount(discount);
      return {
        success: true,
        message: language === 'af' 
          ? `Koepon ${normalized} suksesvol toegepas! (${discount.percent}% afslag)` 
          : `Coupon ${normalized} successfully applied! (${discount.percent}% off)`
      };
    } else {
      return {
        success: false,
        message: language === 'af'
          ? 'Ongeldige of vervalde koeponkode.'
          : 'Invalid or expired coupon code.'
      };
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setAppliedDiscount(null);
  };

  // Core API interactions
  const submitOrder = async (orderData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    province: string;
    postalCode: string;
    notes?: string;
    shippingMethod: 'aramex-door' | 'aramex-sleeve' | 'postnet' | 'courier-guy';
    shippingCost: number;
    paymentMethod: 'payfast' | 'eft';
    smsNotification: boolean;
  }) => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percent) / 100 : 0;
    const discountedSubtotal = subtotal - discountAmount;
    const total = discountedSubtotal + orderData.shippingCost;

    const items = cart.map((item) => ({
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      size: item.selectedSize,
      color: item.selectedColor
    }));

    const newOrderPayload = {
      ...orderData,
      items,
      subtotal: discountedSubtotal,
      total,
      status: 'pending' as const
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrderPayload)
      });

      if (response.ok) {
        const confirmedOrder = await response.json();
        setOrders((prev) => [confirmedOrder, ...prev]);
        
        // Update product stock counts locally too
        setProducts(prevProds => {
          return prevProds.map(p => {
            const cartItemForProduct = cart.filter(ci => ci.product.id === p.id);
            if (cartItemForProduct.length > 0) {
              const totalPurchased = cartItemForProduct.reduce((sum, ci) => sum + ci.quantity, 0);
              return { ...p, stockCount: Math.max(0, p.stockCount - totalPurchased) };
            }
            return p;
          });
        });

        clearCart();
        return confirmedOrder;
      }
    } catch (e) {
      console.error('Failed to submit order to server, using client-side fallback creation', e);
    }

    // Client-side fallback if server fails
    const fallbackOrder: Order = {
      id: `VG-${Math.floor(100000 + Math.random() * 900000)}`,
      ...newOrderPayload,
      date: new Date().toISOString().split('T')[0]
    };

    setOrders((prev) => [fallbackOrder, ...prev]);
    
    // Update local stock
    setProducts(prevProds => {
      return prevProds.map(p => {
        const cartItemForProduct = cart.filter(ci => ci.product.id === p.id);
        if (cartItemForProduct.length > 0) {
          const totalPurchased = cartItemForProduct.reduce((sum, ci) => sum + ci.quantity, 0);
          return { ...p, stockCount: Math.max(0, p.stockCount - totalPurchased) };
        }
        return p;
      });
    });

    clearCart();
    return fallbackOrder;
  };

  const addReview = async (reviewData: {
    name: string;
    rating: number;
    comment: string;
    productId: string;
    productTitle: string;
  }) => {
    const payload = {
      ...reviewData,
      approved: false // requires admin approval
    };

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const createdReview = await response.json();
        setReviews((prev) => [...prev, createdReview]);
        return;
      }
    } catch (e) {
      console.error('Failed to post review to server', e);
    }

    // Client-side fallback
    const fallbackReview: Review = {
      id: `rev-${Date.now()}`,
      ...payload,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews((prev) => [...prev, fallbackReview]);
  };

  // Admin Controls
  const addProduct = async (product: Product) => {
    try {
      // Sync to Firebase Firestore first
      await setDoc(doc(db, 'products', product.id), product);

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (response.ok) {
        const created = await response.json();
        setProducts(prev => [...prev.filter(p => p.id !== product.id), created]);
        return;
      }
    } catch (e) {
      console.error('Failed to add product on Firestore or server', e);
    }

    // Client fallback
    setProducts(prev => [...prev.filter(p => p.id !== product.id), product]);
  };

  const editProduct = async (id: string, product: Product) => {
    try {
      // Sync to Firebase Firestore first
      await setDoc(doc(db, 'products', id), product);

      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (response.ok) {
        const updated = await response.json();
        setProducts(prev => prev.map(p => p.id === id ? updated : p));
        return;
      }
    } catch (e) {
      console.error('Failed to edit product on Firestore or server', e);
    }

    // Client fallback
    setProducts(prev => prev.map(p => p.id === id ? product : p));
  };

  const removeProduct = async (id: string) => {
    try {
      // Sync to Firebase Firestore first
      await deleteDoc(doc(db, 'products', id));

      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        return;
      }
    } catch (e) {
      console.error('Failed to remove product on Firestore or server', e);
    }

    // Client fallback
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateProductStock = async (id: string, count: number) => {
    try {
      // Sync to Firebase Firestore first
      await updateDoc(doc(db, 'products', id), { stockCount: count });

      const response = await fetch('/api/products/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, stockCount: count })
      });
      if (response.ok) {
        const updated = await response.json();
        setProducts(prev => prev.map(p => p.id === id ? { ...p, stockCount: updated.stockCount } : p));
        return;
      }
    } catch (e) {
      console.error('Failed to update stock on Firestore or server', e);
    }

    // Client fallback
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stockCount: count } : p));
  };

  const updateProductPrice = async (id: string, price: number) => {
    try {
      // Sync to Firebase Firestore first
      await updateDoc(doc(db, 'products', id), { price });

      const response = await fetch('/api/products/price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, price })
      });
      if (response.ok) {
        const updated = await response.json();
        setProducts(prev => prev.map(p => p.id === id ? { ...p, price: updated.price } : p));
        return;
      }
    } catch (e) {
      console.error('Failed to update price on Firestore or server', e);
    }

    // Client fallback
    setProducts(prev => prev.map(p => p.id === id ? { ...p, price } : p));
  };

  const updateOrderStatus = async (id: string, status: Order['status'], tracking?: string) => {
    try {
      const response = await fetch('/api/orders/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, trackingNumber: tracking })
      });
      if (response.ok) {
        const updated = await response.json();
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: updated.status, trackingNumber: updated.trackingNumber } : o));
        return;
      }
    } catch (e) {
      console.error('Failed to update order status on server', e);
    }

    // Client fallback
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status, trackingNumber: tracking || o.trackingNumber } : o));
  };

  const createDiscountCode = async (code: string, percent: number) => {
    const payload = { code: code.toUpperCase(), percent, active: true };
    try {
      const response = await fetch('/api/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const created = await response.json();
        setDiscountCodes(prev => [...prev.filter(d => d.code !== code), created]);
        return;
      }
    } catch (e) {
      console.error('Failed to create discount on server', e);
    }

    // Client fallback
    setDiscountCodes(prev => [...prev.filter(d => d.code !== code), payload]);
  };

  const removeDiscountCode = async (code: string) => {
    try {
      const response = await fetch(`/api/discounts/${encodeURIComponent(code)}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setDiscountCodes(prev => prev.filter(d => d.code !== code));
        return;
      }
    } catch (e) {
      console.error('Failed to remove discount on server', e);
    }

    // Client fallback
    setDiscountCodes(prev => prev.filter(d => d.code !== code));
  };

  const approveReview = async (reviewId: string) => {
    try {
      const response = await fetch('/api/reviews/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reviewId })
      });
      if (response.ok) {
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, approved: true } : r));
        return;
      }
    } catch (e) {
      console.error('Failed to approve review on server', e);
    }

    // Client fallback
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, approved: true } : r));
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setReviews(prev => prev.filter(r => r.id !== reviewId));
        return;
      }
    } catch (e) {
      console.error('Failed to delete review on server', e);
    }

    // Client fallback
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  const deleteOrder = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setOrders(prev => prev.filter(o => o.id !== id));
        return;
      }
    } catch (e) {
      console.error('Failed to delete order on server', e);
    }
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const clearAllOrders = async () => {
    try {
      const response = await fetch('/api/orders/clear-all', {
        method: 'POST'
      });
      if (response.ok) {
        setOrders([]);
        return;
      }
    } catch (e) {
      console.error('Failed to clear all orders on server', e);
    }
    setOrders([]);
  };

  const verifyAdminPassword = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        setIsUnlocked(true);
        return true;
      }
    } catch (e) {
      console.warn('Backend verify offline, falling back to local check.', e);
    }
    
    // Client fallback
    if (!isPasswordEnabled || password === adminPassword) {
      setIsUnlocked(true);
      return true;
    }
    return false;
  };

  const updateAdminConfig = async (password: string, isPasswordEnabled: boolean) => {
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, isPasswordEnabled })
      });
      if (res.ok) {
        const config = await res.json();
        setAdminPassword(config.password);
        setIsPasswordEnabled(config.isPasswordEnabled);
        localStorage.setItem('vg_admin_password', config.password);
        localStorage.setItem('vg_admin_password_enabled', config.isPasswordEnabled ? 'true' : 'false');
        return;
      }
    } catch (e) {
      console.error('Failed to update config on server', e);
    }

    // Client fallback
    setAdminPassword(password);
    setIsPasswordEnabled(isPasswordEnabled);
    localStorage.setItem('vg_admin_password', password);
    localStorage.setItem('vg_admin_password_enabled', isPasswordEnabled ? 'true' : 'false');
  };

  const resetAdminPassword = async (): Promise<string> => {
    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setAdminPassword(data.defaultPassword);
        setIsPasswordEnabled(true);
        localStorage.setItem('vg_admin_password', data.defaultPassword);
        localStorage.setItem('vg_admin_password_enabled', 'true');
        return data.defaultPassword;
      }
    } catch (e) {
      console.error('Failed to reset password on server', e);
    }

    // Client fallback
    const defaultPass = 'Volksgrond2026';
    setAdminPassword(defaultPass);
    setIsPasswordEnabled(true);
    localStorage.setItem('vg_admin_password', defaultPass);
    localStorage.setItem('vg_admin_password_enabled', 'true');
    return defaultPass;
  };

  const updatePayfastConfig = async (merchantId: string, merchantKey: string) => {
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payfastMerchantId: merchantId, payfastMerchantKey: merchantKey })
      });
      if (res.ok) {
        const config = await res.json();
        if (config.payfastMerchantId) setPayfastMerchantId(config.payfastMerchantId);
        if (config.payfastMerchantKey) setPayfastMerchantKey(config.payfastMerchantKey);
        localStorage.setItem('vg_payfast_merchant_id', config.payfastMerchantId || merchantId);
        localStorage.setItem('vg_payfast_merchant_key', config.payfastMerchantKey || merchantKey);
        return;
      }
    } catch (e) {
      console.error('Failed to update PayFast config on server', e);
    }

    // Client fallback
    setPayfastMerchantId(merchantId);
    setPayfastMerchantKey(merchantKey);
    localStorage.setItem('vg_payfast_merchant_id', merchantId);
    localStorage.setItem('vg_payfast_merchant_key', merchantKey);
  };

  const updateAnnouncementConfig = async (enabled: boolean, text: string) => {
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAnnouncementEnabled: enabled, announcementText: text })
      });
      if (res.ok) {
        const config = await res.json();
        setIsAnnouncementEnabled(config.isAnnouncementEnabled);
        setAnnouncementText(config.announcementText);
        localStorage.setItem('vg_announcement_enabled', config.isAnnouncementEnabled ? 'true' : 'false');
        localStorage.setItem('vg_announcement_text', config.announcementText);
        return;
      }
    } catch (e) {
      console.error('Failed to update announcement config on server', e);
    }

    // Client fallback
    setIsAnnouncementEnabled(enabled);
    setAnnouncementText(text);
    localStorage.setItem('vg_announcement_enabled', enabled ? 'true' : 'false');
    localStorage.setItem('vg_announcement_text', text);
  };

  const updateGalleryConfig = async (
    links: GalleryLink[],
    btnTextAf: string,
    btnTextEn: string,
    enabled: boolean
  ) => {
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          galleryLinks: links,
          homeGalleryBtnTextAf: btnTextAf,
          homeGalleryBtnTextEn: btnTextEn,
          isHomeGalleryBtnEnabled: enabled
        })
      });
      if (res.ok) {
        const config = await res.json();
        if (config.galleryLinks) setGalleryLinks(config.galleryLinks);
        if (config.homeGalleryBtnTextAf) setHomeGalleryBtnTextAf(config.homeGalleryBtnTextAf);
        if (config.homeGalleryBtnTextEn) setHomeGalleryBtnTextEn(config.homeGalleryBtnTextEn);
        if (config.isHomeGalleryBtnEnabled !== undefined) setIsHomeGalleryBtnEnabled(config.isHomeGalleryBtnEnabled);
        
        localStorage.setItem('vg_gallery_links', JSON.stringify(config.galleryLinks || links));
        localStorage.setItem('vg_home_gallery_btn_text_af', config.homeGalleryBtnTextAf || btnTextAf);
        localStorage.setItem('vg_home_gallery_btn_text_en', config.homeGalleryBtnTextEn || btnTextEn);
        localStorage.setItem('vg_is_home_gallery_btn_enabled', (config.isHomeGalleryBtnEnabled !== undefined ? config.isHomeGalleryBtnEnabled : enabled) ? 'true' : 'false');
        return;
      }
    } catch (e) {
      console.error('Failed to update gallery config on server', e);
    }

    // Client fallback
    setGalleryLinks(links);
    setHomeGalleryBtnTextAf(btnTextAf);
    setHomeGalleryBtnTextEn(btnTextEn);
    setIsHomeGalleryBtnEnabled(enabled);
    localStorage.setItem('vg_gallery_links', JSON.stringify(links));
    localStorage.setItem('vg_home_gallery_btn_text_af', btnTextAf);
    localStorage.setItem('vg_home_gallery_btn_text_en', btnTextEn);
    localStorage.setItem('vg_is_home_gallery_btn_enabled', enabled ? 'true' : 'false');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        view,
        setView,
        selectedProductId,
        setSelectedProductId,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        promoCode,
        appliedDiscount,
        applyPromoCode,
        removePromoCode,
        orders,
        submitOrder,
        reviews,
        addReview,
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
        sizeFilter,
        setSizeFilter,
        products,
        isLoading,
        
        // Admin
        addProduct,
        editProduct,
        removeProduct,
        updateProductStock,
        updateProductPrice,
        updateOrderStatus,
        deleteOrder,
        clearAllOrders,
        discountCodes,
        createDiscountCode,
        removeDiscountCode,
        approveReview,
        deleteReview,
        isUnlocked,
        setIsUnlocked,
        adminPassword,
        isPasswordEnabled,
        verifyAdminPassword,
        updateAdminConfig,
        resetAdminPassword,
        payfastMerchantId,
        payfastMerchantKey,
        updatePayfastConfig,
        isAnnouncementEnabled,
        announcementText,
        updateAnnouncementConfig,
        galleryLinks,
        homeGalleryBtnTextAf,
        homeGalleryBtnTextEn,
        isHomeGalleryBtnEnabled,
        updateGalleryConfig,
        globalSizeGuideOpen,
        setGlobalSizeGuideOpen,
        lastCalculatedSize,
        setLastCalculatedSize
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
