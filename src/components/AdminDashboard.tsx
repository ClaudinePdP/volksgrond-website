import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, TrendingUp, DollarSign, ShoppingCart, Percent, Star, ArrowUpRight, Check, Package, MessageSquare, Plus, RefreshCw, AlertCircle, Eye, EyeOff, Lock, Unlock, Key, Mail, Settings, Trash2, Upload, Edit, Sparkles, Megaphone, Calendar, Link as LinkIcon } from 'lucide-react';
import { motion } from 'motion/react';

const compressAndResizeImage = (file: File, maxWidth = 800, maxHeight = 800): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => {
        resolve(event.target?.result as string);
      };
    };
    reader.onerror = () => {
      resolve('');
    };
  });
};

export const AdminDashboard: React.FC = () => {
  const {
    language,
    orders,
    products,
    reviews,
    discountCodes,
    addProduct,
    editProduct,
    removeProduct,
    updateProductStock,
    updateProductPrice,
    updateOrderStatus,
    deleteOrder,
    clearAllOrders,
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
    updateGalleryConfig
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory' | 'reviews' | 'coupons' | 'settings' | 'gallery'>('overview');
  
  // Inventory Stock change
  const [stockInputs, setStockInputs] = useState<Record<string, number>>({});
  
  // Inventory Price change
  const [priceInputs, setPriceInputs] = useState<Record<string, number>>({});

  // New Product States
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProdId, setNewProdId] = useState('');
  const [newProdNameAf, setNewProdNameAf] = useState('');
  const [newProdNameEn, setNewProdNameEn] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(269.99);
  const [newProdCategory, setNewProdCategory] = useState<'men' | 'ladies' | 'volkspore' | 'caps'>('men');
  const [newProdStock, setNewProdStock] = useState(20);
  const [newProdDescAf, setNewProdDescAf] = useState('');
  const [newProdDescEn, setNewProdDescEn] = useState('');
  const [newProdFeaturesAf, setNewProdFeaturesAf] = useState('100% Gekamde Organiese Katoen\nPlaaslik vervaardig vir premium gehalte');
  const [newProdFeaturesEn, setNewProdFeaturesEn] = useState('100% Combed Organic Cotton\nLocally manufactured for premium quality');
  const [newProdMaterialsAf, setNewProdMaterialsAf] = useState('100% Gekamde Organiese Katoen. Plaaslik verkry en vervaardig.');
  const [newProdMaterialsEn, setNewProdMaterialsEn] = useState('100% Combed Organic Cotton. Locally sourced and manufactured.');
  const [newProdCareAf, setNewProdCareAf] = useState('Was koud binne-buite. Moenie op die motief stryk nie.');
  const [newProdCareEn, setNewProdCareEn] = useState('Wash cold inside-out. Do not iron on the motif.');
  const [newProdImageUrl, setNewProdImageUrl] = useState('/src/assets/images/volksgrond_heritage_bg_1783548402167.jpg');
  const [newProdCostPrice, setNewProdCostPrice] = useState(110.00);
  
  // Editing Product States
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editProdNameAf, setEditProdNameAf] = useState('');
  const [editProdNameEn, setEditProdNameEn] = useState('');
  const [editProdPrice, setEditProdPrice] = useState(269.99);
  const [editProdCategory, setEditProdCategory] = useState<'men' | 'ladies' | 'volkspore' | 'caps'>('men');
  const [editProdStock, setEditProdStock] = useState(20);
  const [editProdDescAf, setEditProdDescAf] = useState('');
  const [editProdDescEn, setEditProdDescEn] = useState('');
  const [editProdFeaturesAf, setEditProdFeaturesAf] = useState('');
  const [editProdFeaturesEn, setEditProdFeaturesEn] = useState('');
  const [editProdMaterialsAf, setEditProdMaterialsAf] = useState('');
  const [editProdMaterialsEn, setEditProdMaterialsEn] = useState('');
  const [editProdCareAf, setEditProdCareAf] = useState('');
  const [editProdCareEn, setEditProdCareEn] = useState('');
  const [editProdImageUrl, setEditProdImageUrl] = useState('');
  const [editProdCostPrice, setEditProdCostPrice] = useState(110.00);

  // Promotional & Display Location States for New Product
  const [newProdIsPromo, setNewProdIsPromo] = useState(false);
  const [newProdPromoTextAf, setNewProdPromoTextAf] = useState('');
  const [newProdPromoTextEn, setNewProdPromoTextEn] = useState('');
  const [newProdDisplayLocation, setNewProdDisplayLocation] = useState<'home_featured' | 'home_collection' | 'categories' | 'shop_only'>('shop_only');
  const [newProdGallery, setNewProdGallery] = useState<string[]>(['', '', '', '', '']);

  // Promotional & Display Location States for Editing Product
  const [editProdIsPromo, setEditProdIsPromo] = useState(false);
  const [editProdPromoTextAf, setEditProdPromoTextAf] = useState('');
  const [editProdPromoTextEn, setEditProdPromoTextEn] = useState('');
  const [editProdDisplayLocation, setEditProdDisplayLocation] = useState<'home_featured' | 'home_collection' | 'categories' | 'shop_only'>('shop_only');
  const [editProdGallery, setEditProdGallery] = useState<string[]>(['', '', '', '', '']);

  // Loading states for each of the 5 gallery placeholder uploads
  const [galleryUploadingIdx, setGalleryUploadingIdx] = useState<number | null>(null);
  
  // Coupon Creation
  const [newCode, setNewCode] = useState('');
  const [newPercent, setNewPercent] = useState(10);
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [editingCouponCode, setEditingCouponCode] = useState<string | null>(null);
  const [editCouponPercent, setEditCouponPercent] = useState<number>(10);

  // Tracking numbers typing
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  // Financial Management States
  const [cogsPerItem, setCogsPerItem] = useState(110.00); // Default COGS per clothing item (R110.00 ZAR)
  const [monthlySalesTarget, setMonthlySalesTarget] = useState(30000.00); // Default monthly target of R30,000.00 ZAR
  const [showFinancialSettings, setShowFinancialSettings] = useState(false);

  // Date Filter States
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Password Lock Gate States
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');

  // Password Config States
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [isLockEnabled, setIsLockEnabled] = useState(isPasswordEnabled);
  const [settingsMessage, setSettingsMessage] = useState('');

  // PayFast settings states
  const [merchantIdInput, setMerchantIdInput] = useState(payfastMerchantId);
  const [merchantKeyInput, setMerchantKeyInput] = useState(payfastMerchantKey);
  const [showMerchantKey, setShowMerchantKey] = useState(false);

  // Announcement settings states
  const [announcementTextVal, setAnnouncementTextVal] = useState(announcementText);
  const [announcementEnabledVal, setAnnouncementEnabledVal] = useState(isAnnouncementEnabled);
  const [announcementMessage, setAnnouncementMessage] = useState('');

  // Gallery and Useful Links configuration states
  const [galleryLinksVal, setGalleryLinksVal] = useState<any[]>([]);
  const [homeGalleryBtnTextAfVal, setHomeGalleryBtnTextAfVal] = useState('');
  const [homeGalleryBtnTextEnVal, setHomeGalleryBtnTextEnVal] = useState('');
  const [isHomeGalleryBtnEnabledVal, setIsHomeGalleryBtnEnabledVal] = useState(true);
  const [galleryMessage, setGalleryMessage] = useState('');

  // Individual new gallery link item states
  const [newGalleryTitleAf, setNewGalleryTitleAf] = useState('');
  const [newGalleryTitleEn, setNewGalleryTitleEn] = useState('');
  const [newGalleryImageUrl, setNewGalleryImageUrl] = useState('');
  const [newGalleryLinkUrl, setNewGalleryLinkUrl] = useState('shop');
  const [newGalleryOccasionAf, setNewGalleryOccasionAf] = useState('');
  const [newGalleryOccasionEn, setNewGalleryOccasionEn] = useState('');

  useEffect(() => {
    setMerchantIdInput(payfastMerchantId);
    setMerchantKeyInput(payfastMerchantKey);
  }, [payfastMerchantId, payfastMerchantKey]);

  useEffect(() => {
    setAnnouncementTextVal(announcementText);
    setAnnouncementEnabledVal(isAnnouncementEnabled);
  }, [announcementText, isAnnouncementEnabled]);

  useEffect(() => {
    if (galleryLinks) setGalleryLinksVal(galleryLinks);
    if (homeGalleryBtnTextAf) setHomeGalleryBtnTextAfVal(homeGalleryBtnTextAf);
    if (homeGalleryBtnTextEn) setHomeGalleryBtnTextEnVal(homeGalleryBtnTextEn);
    if (isHomeGalleryBtnEnabled !== undefined) setIsHomeGalleryBtnEnabledVal(isHomeGalleryBtnEnabled);
  }, [galleryLinks, homeGalleryBtnTextAf, homeGalleryBtnTextEn, isHomeGalleryBtnEnabled]);

  const handleUpdateGalleryGateway = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateGalleryConfig(
        galleryLinksVal,
        homeGalleryBtnTextAfVal,
        homeGalleryBtnTextEnVal,
        isHomeGalleryBtnEnabledVal
      );
      setGalleryMessage(language === 'af' ? 'Galery-knoppie instellings suksesvol opgedateer!' : 'Gallery button settings updated successfully!');
      setTimeout(() => setGalleryMessage(''), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryTitleAf || !newGalleryTitleEn || !newGalleryImageUrl) return;

    const newItem = {
      id: 'gallery-' + Date.now(),
      titleAf: newGalleryTitleAf,
      titleEn: newGalleryTitleEn,
      imageUrl: newGalleryImageUrl,
      linkUrl: newGalleryLinkUrl,
      occasionAf: newGalleryOccasionAf || undefined,
      occasionEn: newGalleryOccasionEn || undefined
    };

    const updatedLinks = [...galleryLinksVal, newItem];
    setGalleryLinksVal(updatedLinks);

    try {
      await updateGalleryConfig(
        updatedLinks,
        homeGalleryBtnTextAfVal,
        homeGalleryBtnTextEnVal,
        isHomeGalleryBtnEnabledVal
      );
      
      // Reset form fields
      setNewGalleryTitleAf('');
      setNewGalleryTitleEn('');
      setNewGalleryImageUrl('');
      setNewGalleryLinkUrl('shop');
      setNewGalleryOccasionAf('');
      setNewGalleryOccasionEn('');

      setGalleryMessage(language === 'af' ? 'Nuwe geleentheid suksesvol bygevoeg!' : 'New occasion added successfully!');
      setTimeout(() => setGalleryMessage(''), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGalleryItem = async (itemId: string) => {
    const updatedLinks = galleryLinksVal.filter(item => item.id !== itemId);
    setGalleryLinksVal(updatedLinks);

    try {
      await updateGalleryConfig(
        updatedLinks,
        homeGalleryBtnTextAfVal,
        homeGalleryBtnTextEnVal,
        isHomeGalleryBtnEnabledVal
      );
      setGalleryMessage(language === 'af' ? 'Item suksesvol verwyder!' : 'Item successfully deleted!');
      setTimeout(() => setGalleryMessage(''), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  // Upload state and helpers for new product image
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // AI-powered product generation states
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuccess, setAiSuccess] = useState(false);
  const [customBgPrompt, setCustomBgPrompt] = useState('');
  const [suggestedBgKey, setSuggestedBgKey] = useState('');
  const [aiUploadedImageUrl, setAiUploadedImageUrl] = useState<string | null>(null);
  const [editAiUploadedImageUrl, setEditAiUploadedImageUrl] = useState<string | null>(null);

  // Custom confirm modal state
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    onConfirm: () => void | Promise<void>;
  } | null>(null);
  
  // Custom toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleAiAnalysis = async (file: File) => {
    if (!file) return;
    setIsAiGenerating(true);
    setAiError(null);
    setAiSuccess(false);

    try {
      const base64String = await compressAndResizeImage(file);
      if (!base64String) {
        throw new Error(language === 'af' ? 'Kon nie die afbeelding saampers nie.' : 'Failed to compress the image.');
      }
      
      const response = await fetch('/api/products/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          base64: base64String,
          category: newProdCategory
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.error) {
          setAiError(data.error);
        }
          
          // Populate fields
          setNewProdId(data.nameEn ? data.nameEn.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : '');
          setNewProdNameAf(data.nameAf || '');
          setNewProdNameEn(data.nameEn || '');
          setNewProdDescAf(data.descAf || '');
          setNewProdDescEn(data.descEn || '');
          
          if (Array.isArray(data.featuresAf)) {
            setNewProdFeaturesAf(data.featuresAf.join('\n'));
          } else {
            setNewProdFeaturesAf('100% Gekamde Organiese Katoen\nPlaaslik vervaardig vir premium gehalte');
          }
          
          if (Array.isArray(data.featuresEn)) {
            setNewProdFeaturesEn(data.featuresEn.join('\n'));
          } else {
            setNewProdFeaturesEn('100% Combed Organic Cotton\nLocally manufactured for premium quality');
          }

          setNewProdMaterialsAf(data.materialsAf || '100% Gekamde Organiese Katoen. Plaaslik verkry en vervaardig.');
          setNewProdMaterialsEn(data.materialsEn || '100% Combed Organic Cotton. Locally sourced and manufactured.');
          setNewProdCareAf(data.careAf || 'Was koud binne-buite. Moenie op die motief stryk nie.');
          setNewProdCareEn(data.careEn || 'Wash cold inside-out. Do not iron on the motif.');
          setCustomBgPrompt(data.customBgPrompt || '');
          setSuggestedBgKey(data.suggestedBgKey || '');

          // Map suggestedBgKey to default backgrounds if appropriate
          const bgMap: Record<string, string> = {
            heritage: '/src/assets/images/volksgrond_heritage_bg_1783548402167.jpg',
            farmers: '/src/assets/images/volksgrond_story_farmers_collage_1783553446942.jpg',
            black_flatlay: '/src/assets/images/erfenis_black_tshirt_1783544659803.jpg',
            white_flatlay: '/src/assets/images/boerekrygers_white_tshirt_1783544674183.jpg',
            sand_flatlay: '/src/assets/images/boerekrygers_sand_cap_1783544687518.jpg'
          };

          if (data.suggestedBgKey && bgMap[data.suggestedBgKey]) {
            setNewProdImageUrl(bgMap[data.suggestedBgKey]);
          } else {
            setNewProdImageUrl(data.imageUrl || '/src/assets/images/volksgrond_heritage_bg_1783548402167.jpg');
          }
          
          if (data.imageUrl) {
            setAiUploadedImageUrl(data.imageUrl);
          }

          setAiSuccess(true);
        } else {
          const errData = await response.json();
          setAiError(errData.error || (language === 'af' ? 'Kon nie beeld ontleed nie.' : 'Failed to analyze product image.'));
        }
        setIsAiGenerating(false);
    } catch (err) {
      console.error('Error in handleAiAnalysis:', err);
      setAiError(language === 'af' ? 'Kon nie verbinding met AI bediener maak nie.' : 'Failed to connect to AI server.');
      setIsAiGenerating(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setUploadError(language === 'af' ? 'Slegs beelde word toegelaat.' : 'Only images are allowed.');
      return;
    }

    // Check size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError(language === 'af' ? 'Beeld is te groot (maks 10MB).' : 'Image is too large (max 10MB).');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        const response = await fetch('/api/products/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64: base64String })
        });

        if (response.ok) {
          const data = await response.json();
          if (editingProductId) {
            setEditProdImageUrl(data.url);
          } else {
            setNewProdImageUrl(data.url);
          }
        } else {
          const errData = await response.json();
          setUploadError(errData.error || (language === 'af' ? 'Kon nie beeld oplaai nie.' : 'Failed to upload image.'));
        }
        setIsUploading(false);
      };
    } catch (err) {
      console.error('Error in handleFileUpload:', err);
      setUploadError(language === 'af' ? 'Kon nie beeld oplaai nie.' : 'Failed to upload image.');
      setIsUploading(false);
    }
  };

  const handleGalleryUpload = async (file: File, index: number, isEdit: boolean) => {
    if (!file.type.startsWith('image/')) {
      alert(language === 'af' ? 'Slegs beelde word toegelaat.' : 'Only images are allowed.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert(language === 'af' ? 'Beeld is te groot (maks 10MB).' : 'Image is too large (max 10MB).');
      return;
    }

    setGalleryUploadingIdx(index);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const response = await fetch('/api/products/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64: base64String })
        });
        if (response.ok) {
          const data = await response.json();
          if (isEdit) {
            setEditProdGallery(prev => {
              const copy = [...prev];
              copy[index] = data.url;
              return copy;
            });
          } else {
            setNewProdGallery(prev => {
              const copy = [...prev];
              copy[index] = data.url;
              return copy;
            });
          }
        } else {
          alert(language === 'af' ? 'Kon nie beeld oplaai nie.' : 'Failed to upload image.');
        }
        setGalleryUploadingIdx(null);
      };
    } catch (err) {
      console.error(err);
      alert(language === 'af' ? 'Kon nie beeld oplaai nie.' : 'Failed to upload image.');
      setGalleryUploadingIdx(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // Sync settings checkbox on load
  useEffect(() => {
    setIsLockEnabled(isPasswordEnabled);
  }, [isPasswordEnabled]);

  const handleSetPreset = (preset: 'today' | '7days' | '30days' | 'clear') => {
    const now = new Date();
    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    
    if (preset === 'today') {
      const todayStr = formatDate(now);
      setFilterStartDate(todayStr);
      setFilterEndDate(todayStr);
    } else if (preset === '7days') {
      const past = new Date();
      past.setDate(now.getDate() - 7);
      setFilterStartDate(formatDate(past));
      setFilterEndDate(formatDate(now));
    } else if (preset === '30days') {
      const past = new Date();
      past.setDate(now.getDate() - 30);
      setFilterStartDate(formatDate(past));
      setFilterEndDate(formatDate(now));
    } else {
      setFilterStartDate('');
      setFilterEndDate('');
    }
  };

  // Filtered orders based on selected date range
  const filteredOrdersForFinancials = useMemo(() => {
    return orders.filter(order => {
      if (filterStartDate && order.date < filterStartDate) {
        return false;
      }
      if (filterEndDate && order.date > filterEndDate) {
        return false;
      }
      return true;
    });
  }, [orders, filterStartDate, filterEndDate]);

  // Real or simulated analytics computations
  const analytics = useMemo(() => {
    const totalSales = filteredOrdersForFinancials.reduce((sum, o) => sum + o.total, 0);
    const orderCount = filteredOrdersForFinancials.length;
    const aov = orderCount > 0 ? totalSales / orderCount : 0;
    
    // Count actual items sold if orders exist
    const realItemsCount = filteredOrdersForFinancials.reduce((sum, o) => {
      const itemsSum = o.items?.reduce((iSum: number, item: any) => iSum + (item.quantity || 1), 0) || 0;
      return sum + itemsSum;
    }, 0);

    const displaySales = totalSales;
    const displayOrders = orderCount;
    const displayAOV = aov;
    const displayCR = orderCount > 0 ? ((orderCount / 350) * 100).toFixed(2) : '0.00';
    const displayItemsCount = realItemsCount;
    
    // Gateway transaction fee (typically ~2.5% for Ozow/Debit/Credit in SA)
    const gatewayFees = displaySales * 0.025;
    
    // Total COGS (Cost of Goods Sold)
    const totalCogs = filteredOrdersForFinancials.reduce((sum, o) => {
      const orderCogs = o.items?.reduce((iSum: number, item: any) => {
        const prod = products.find(p => 
          p.name.af === item.productName?.af || 
          p.name.en === item.productName?.en || 
          p.id === item.productId
        );
        const itemCost = prod?.costPrice ?? cogsPerItem;
        return iSum + (itemCost * (item.quantity || 1));
      }, 0) || 0;
      return sum + orderCogs;
    }, 0);

    // Total shipping costs paid out to Aramex (in-and-out offset)
    const totalShipping = filteredOrdersForFinancials.reduce((sum, o) => sum + (o.shippingCost || 0), 0);
    
    // Net profit (excluding courier fee since it's an in-and-out expense offset by customer shipping payment)
    const netProfit = displaySales - totalCogs - gatewayFees - totalShipping;
    
    // Profit margin percentage
    const margin = displaySales > 0 ? (netProfit / displaySales) * 100 : 0;

    return {
      sales: displaySales,
      orders: displayOrders,
      aov: displayAOV,
      cr: displayCR,
      itemsCount: displayItemsCount,
      gatewayFees,
      cogs: totalCogs,
      netProfit,
      margin
    };
  }, [filteredOrdersForFinancials, cogsPerItem, products]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdId || !newProdNameAf || !newProdNameEn || !newProdPrice) {
      alert(language === 'af' ? 'Vul asseblief alle verpligte velde in.' : 'Please fill in all required fields.');
      return;
    }

    const formattedId = newProdId.trim().toLowerCase().replace(/\s+/g, '-');

    if (products.some(p => p.id === formattedId)) {
      alert(language === 'af' ? 'N produk met hierdie ID bestaan reeds.' : 'A product with this ID already exists.');
      return;
    }

    const featuresArray = newProdFeaturesAf.split('\n').filter(Boolean).map((feat, idx) => {
      const featEn = newProdFeaturesEn.split('\n')[idx] || feat;
      return {
        af: feat.trim(),
        en: featEn.trim()
      };
    });

    const categoryLabels = {
      men: { af: 'Mans', en: 'Men' },
      ladies: { af: 'Dames', en: 'Ladies' },
      volkspore: { af: 'Volkspore Kinders', en: 'Volkspore Kids' },
      caps: { af: 'Kepse', en: 'Caps' }
    };

    const imagesList = [
      newProdImageUrl,
      ...newProdGallery.filter(Boolean)
    ].filter(Boolean);

    const newProductObj = {
      id: formattedId,
      name: { af: newProdNameAf, en: newProdNameEn },
      price: Number(newProdPrice),
      costPrice: Number(newProdCostPrice),
      category: newProdCategory,
      categoryLabel: categoryLabels[newProdCategory],
      stockCount: Number(newProdStock),
      description: { af: newProdDescAf, en: newProdDescEn },
      features: featuresArray,
      materials: { af: newProdMaterialsAf, en: newProdMaterialsEn },
      careInstructions: { af: newProdCareAf, en: newProdCareEn },
      images: imagesList,
      sizes: newProdCategory === 'caps' ? ['Adjustable / Verstelbaar'] : ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Swart / Black', 'Wit / White'],
      isPromo: newProdIsPromo,
      promoText: { af: newProdPromoTextAf, en: newProdPromoTextEn },
      displayLocation: newProdDisplayLocation
    };

    await addProduct(newProductObj);
    showToast(language === 'af' ? 'Produk suksesvol bygevoeg!' : 'Product successfully added!');
    
    // Reset Form
    setNewProdId('');
    setNewProdNameAf('');
    setNewProdNameEn('');
    setNewProdPrice(269.99);
    setNewProdCostPrice(110.00);
    setNewProdStock(20);
    setNewProdDescAf('');
    setNewProdDescEn('');
    setNewProdIsPromo(false);
    setNewProdPromoTextAf('');
    setNewProdPromoTextEn('');
    setNewProdDisplayLocation('shop_only');
    setNewProdGallery(['', '', '', '', '']);
    setAiUploadedImageUrl(null);
    setShowAddForm(false);
  };

  const startEditingProduct = (product: any) => {
    setEditingProductId(product.id);
    setEditProdNameAf(product.name?.af || '');
    setEditProdNameEn(product.name?.en || '');
    setEditProdPrice(product.price || 269.99);
    setEditProdCostPrice(product.costPrice || 110.00);
    setEditProdCategory(product.category || 'men');
    setEditProdStock(product.stockCount || 0);
    setEditProdDescAf(product.description?.af || '');
    setEditProdDescEn(product.description?.en || '');
    
    // Join features with newlines for the textarea
    const featsAf = product.features?.map((f: any) => f.af).join('\n') || '';
    const featsEn = product.features?.map((f: any) => f.en).join('\n') || '';
    setEditProdFeaturesAf(featsAf);
    setEditProdFeaturesEn(featsEn);
    
    setEditProdMaterialsAf(product.materials?.af || '');
    setEditProdMaterialsEn(product.materials?.en || '');
    setEditProdCareAf(product.careInstructions?.af || '');
    setEditProdCareEn(product.careInstructions?.en || '');
    setEditProdImageUrl(product.images?.[0] || '');
    
    setEditProdIsPromo(product.isPromo || false);
    setEditProdPromoTextAf(product.promoText?.af || '');
    setEditProdPromoTextEn(product.promoText?.en || '');
    setEditProdDisplayLocation(product.displayLocation || 'shop_only');
    
    const existingGallery = product.images?.slice(1) || [];
    const paddedGallery = [...existingGallery, '', '', '', '', ''].slice(0, 5);
    setEditProdGallery(paddedGallery);
    
    // Hide add form if open
    setShowAddForm(false);
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductId || !editProdNameAf || !editProdNameEn || !editProdPrice) {
      alert(language === 'af' ? 'Vul asseblief alle verpligte velde in.' : 'Please fill in all required fields.');
      return;
    }

    const featuresArray = editProdFeaturesAf.split('\n').filter(Boolean).map((feat, idx) => {
      const featEn = editProdFeaturesEn.split('\n')[idx] || feat;
      return {
        af: feat.trim(),
        en: featEn.trim()
      };
    });

    const categoryLabels = {
      men: { af: 'Mans', en: 'Men' },
      ladies: { af: 'Dames', en: 'Ladies' },
      volkspore: { af: 'Volkspore Kinders', en: 'Volkspore Kids' },
      caps: { af: 'Kepse', en: 'Caps' }
    };

    // Keep rest of properties from original product if we have them
    const originalProd = products.find(p => p.id === editingProductId);
    const editedImagesList = [
      editProdImageUrl,
      ...editProdGallery.filter(Boolean)
    ].filter(Boolean);
    
    const updatedProductObj = {
      ...originalProd,
      id: editingProductId,
      name: { af: editProdNameAf, en: editProdNameEn },
      price: Number(editProdPrice),
      costPrice: Number(editProdCostPrice),
      category: editProdCategory,
      categoryLabel: categoryLabels[editProdCategory],
      stockCount: Number(editProdStock),
      description: { af: editProdDescAf, en: editProdDescEn },
      features: featuresArray,
      materials: { af: editProdMaterialsAf, en: editProdMaterialsEn },
      careInstructions: { af: editProdCareAf, en: editProdCareEn },
      images: editedImagesList,
      sizes: editProdCategory === 'caps' ? ['Adjustable / Verstelbaar'] : ['S', 'M', 'L', 'XL', 'XXL'],
      colors: originalProd?.colors || ['Swart / Black', 'Wit / White'],
      isPromo: editProdIsPromo,
      promoText: { af: editProdPromoTextAf, en: editProdPromoTextEn },
      displayLocation: editProdDisplayLocation
    };

    await editProduct(editingProductId, updatedProductObj as any);
    showToast(language === 'af' ? 'Produk suksesvol opgedateer!' : 'Product successfully updated!');
    setEditingProductId(null);
    setEditAiUploadedImageUrl(null);
  };

  const handleDeleteProduct = (id: string, nameAf: string, nameEn?: string) => {
    setConfirmModal({
      title: language === 'af' ? 'Verwyder produk?' : 'Delete product?',
      message: language === 'af' 
        ? `Is jy seker jy wil die produk "${nameAf}" permanent verwyder?`
        : `Are you sure you want to permanently remove the product "${nameEn || nameAf}"?`,
      onConfirm: async () => {
        await removeProduct(id);
        showToast(language === 'af' ? 'Produk suksesvol verwyder!' : 'Product successfully removed!');
      }
    });
  };

  const handleStockUpdate = async (id: string) => {
    const count = stockInputs[id];
    if (count === undefined || count < 0) return;
    await updateProductStock(id, count);
    showToast(language === 'af' ? 'Voorraad suksesvol opgedateer!' : 'Inventory successfully updated!');
  };

  const handlePriceUpdate = async (id: string) => {
    const price = priceInputs[id];
    if (price === undefined || price < 0) return;
    await updateProductPrice(id, price);
    showToast(language === 'af' ? 'Prys suksesvol opgedateer!' : 'Price successfully updated!');
  };

  const handleStatusUpdate = async (id: string, status: any) => {
    const tracking = trackingInputs[id] || '';
    await updateOrderStatus(id, status, tracking);
    showToast(language === 'af' ? 'Bestellings-status suksesvol verander!' : 'Order status successfully updated!');
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;
    await createDiscountCode(newCode, newPercent);
    setCouponSuccess(true);
    setNewCode('');
    setNewPercent(10);
    setTimeout(() => setCouponSuccess(false), 3000);
  };

  const startEditingCoupon = (code: string, percent: number) => {
    setEditingCouponCode(code);
    setEditCouponPercent(percent);
  };

  const handleUpdateCoupon = async (code: string) => {
    if (editCouponPercent < 5 || editCouponPercent > 90) {
      showToast(language === 'af' ? 'Persentasie moet tussen 5% en 90% wees.' : 'Percentage must be between 5% and 90%.');
      return;
    }
    await createDiscountCode(code, editCouponPercent);
    showToast(language === 'af' ? 'Promosiekode suksesvol opgedateer!' : 'Promo code successfully updated!');
    setEditingCouponCode(null);
  };

  const handleRemoveCoupon = async (code: string) => {
    setConfirmModal({
      title: language === 'af' ? 'Verwyder promosiekode?' : 'Delete promo code?',
      message: language === 'af' 
        ? `Is jy seker jy wil promosiekode "${code}" permanent verwyder?`
        : `Are you sure you want to permanently remove promo code "${code}"?`,
      onConfirm: async () => {
        await removeDiscountCode(code);
        showToast(language === 'af' ? 'Promosiekode suksesvol verwyder!' : 'Promo code successfully removed!');
      }
    });
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    setIsVerifying(true);
    setLoginError('');
    
    // Slight simulated delay for ultra-premium UX
    setTimeout(async () => {
      const success = await verifyAdminPassword(passwordInput);
      setIsVerifying(false);
      if (success) {
        setPasswordInput('');
        setLoginError('');
      } else {
        setLoginError(
          language === 'af' 
            ? 'Ongeldige wagwoord. Probeer asseblief weer.' 
            : 'Invalid password. Please try again.'
        );
      }
    }, 400);
  };

  const handleForgot = async () => {
    setForgotLoading(true);
    setForgotSuccess('');
    setLoginError('');
    
    setTimeout(async () => {
      await resetAdminPassword();
      setForgotLoading(false);
      setForgotSuccess(
        language === 'af'
          ? "Sukses! Verstek wagwoord ('Volksgrond2026') is na cbrduplessis.x2@gmail.com gestuur."
          : "Success! Default password ('Volksgrond2026') has been sent back to cbrduplessis.x2@gmail.com."
      );
    }, 1200);
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalPass = newPasswordInput.trim() || adminPassword;
    await updateAdminConfig(finalPass, isLockEnabled);
    await updatePayfastConfig(merchantIdInput.trim(), merchantKeyInput.trim());
    setSettingsMessage(
      language === 'af'
        ? 'Instellings suksesvol gestoor!'
        : 'Settings successfully saved!'
    );
    setNewPasswordInput('');
    setTimeout(() => setSettingsMessage(''), 3000);
  };

  const handleUpdateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateAnnouncementConfig(announcementEnabledVal, announcementTextVal);
    setAnnouncementMessage(
      language === 'af'
        ? 'Aankondiging suksesvol gestoor!'
        : 'Announcement successfully saved!'
    );
    setTimeout(() => setAnnouncementMessage(''), 3000);
  };

  if (isPasswordEnabled && !isUnlocked) {
    return (
      <div 
        className="min-h-[calc(100vh-80px)] flex items-center justify-center py-16 px-6 relative overflow-hidden"
        style={{
          backgroundImage: 'url(/src/assets/images/volksgrond_heritage_bg_1783548402167.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Subtle premium dark overlay */}
        <div className="absolute inset-0 bg-black/75 backdrop-blur-[4px] pointer-events-none" />

        <div className="absolute inset-0 opacity-20 pointer-events-none" 
          style={{
            backgroundImage: `radial-gradient(#C5A059 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md bg-[#1A1A1A]/90 border border-[#E0DBCF]/30 rounded-xl p-8 shadow-2xl backdrop-blur-md space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#C5A059]/5">
              <Lock size={28} className="animate-pulse" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#C5A059]">
              {language === 'af' ? 'TOEGANGSBEHEER' : 'ACCESS CONTROL'}
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
              {language === 'af' ? 'Handelaarsportaal' : 'Merchant Portal'}
            </h2>
            <div className="w-12 h-[2px] bg-[#C5A059] mx-auto mt-2"></div>
          </div>

          <p className="text-center text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
            {language === 'af' 
              ? 'Hierdie afdeling is beskerm. Voer asseblief jou administrasie-wagwoord in om toegang te verkry.'
              : 'This portal is restricted. Please provide your merchant administration credentials to gain access.'}
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-widest text-gray-400 font-black block">
                {language === 'af' ? 'ADMIN WAGWOORD' : 'ADMIN PASSWORD'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-black/40 border border-[#E0DBCF]/30 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#C5A059] pr-10 font-mono transition-colors"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="bg-red-950/40 border border-red-500/40 text-red-200 text-[11px] p-3 rounded-lg flex items-center gap-2 font-bold">
                <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {forgotSuccess && (
              <div className="bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-[11px] p-3 rounded-lg flex items-start gap-2 font-bold leading-relaxed">
                <Check size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-[#C5A059] hover:bg-[#B38F48] disabled:bg-gray-700 text-[#1A1A1A] font-black uppercase text-[10px] tracking-[0.2em] py-3.5 rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-lg shadow-[#C5A059]/10"
            >
              {isVerifying ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>{language === 'af' ? 'VERIFIEER...' : 'VERIFYING...'}</span>
                </>
              ) : (
                <>
                  <Unlock size={14} />
                  <span>{language === 'af' ? 'ONTGRENDEL PORTAAL' : 'AUTHORIZE ENTRY'}</span>
                </>
              )}
            </button>
          </form>

          <div className="border-t border-[#E0DBCF]/10 pt-4 flex justify-between text-[10px] text-gray-400 uppercase tracking-wider">
            <button
              type="button"
              disabled={forgotLoading}
              onClick={handleForgot}
              className="hover:text-[#C5A059] transition-colors cursor-pointer flex items-center gap-1.5 text-left disabled:opacity-50"
            >
              {forgotLoading ? (
                <RefreshCw size={12} className="animate-spin" />
              ) : (
                <Key size={12} />
              )}
              <span>{language === 'af' ? 'Wagwoord vergeet?' : 'Forgot password?'}</span>
            </button>
            <span className="text-[9px] text-[#C5A059]/60 font-mono">EST. 2019</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
      {/* Title Header */}
      <div className="border-b border-[#E0DBCF] pb-6 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] font-black text-[#8B4513] mb-2 block flex items-center gap-1.5">
            <Shield size={12} />
            <span>Volksgrond Administrasie Bestuurspaneel</span>
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#1A1A1A]">
            {language === 'af' ? 'Handelaarsportaal' : 'Merchant Portal'}
          </h1>
        </div>

        {/* Tab Selection Row */}
        <div className="flex flex-wrap gap-2">
          {([
            { key: 'overview', label: { af: 'Oorsig', en: 'Overview' } },
            { key: 'orders', label: { af: 'Bestellings', en: 'Orders' } },
            { key: 'inventory', label: { af: 'Voorraad', en: 'Inventory' } },
            { key: 'reviews', label: { af: 'Resensies', en: 'Reviews' } },
            { key: 'coupons', label: { af: 'Koepons', en: 'Coupons' } },
            { key: 'gallery', label: { af: 'Galery & Skakels', en: 'Gallery & Links' } },
            { key: 'settings', label: { af: 'Instellings ⚙️', en: 'Settings ⚙️' } }
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all cursor-pointer rounded ${
                activeTab === tab.key
                  ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-sm'
                  : 'border-[#E0DBCF] hover:bg-gray-50 text-gray-500 hover:text-[#1A1A1A]'
              }`}
            >
              {language === 'af' ? tab.label.af : tab.label.en}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-10">
          {/* Date Filter Bar */}
          <div className="bg-[#F5F2ED]/40 border border-[#E0DBCF] rounded-lg p-5 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-[0.2em] font-black text-[#8B4513] block">
                  {language === 'af' ? 'FINANSIËLE TYDPERK FILTREERDERS' : 'FINANCIAL PERIOD FILTERS'}
                </span>
                <h3 className="text-sm font-bold text-[#1A1A1A]">
                  {language === 'af' ? 'Filtreer Finansiële State volgens Datum' : 'Filter Financial Statements by Date'}
                </h3>
                <p className="text-[10px] text-gray-500 font-mono">
                  {language === 'af' 
                    ? `Wys state vanaf ${filterStartDate || 'begin'} tot ${filterEndDate || 'nou'} (${filteredOrdersForFinancials.length} bestellings gevind)`
                    : `Showing statements from ${filterStartDate || 'inception'} to ${filterEndDate || 'now'} (${filteredOrdersForFinancials.length} orders found)`}
                </p>
              </div>

              {/* Date Inputs & Preset Buttons */}
              <div className="flex flex-wrap items-end gap-3 sm:gap-4">
                {/* Start Date */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                    {language === 'af' ? 'Vanaf Datum' : 'Start Date'}
                  </label>
                  <input
                    type="date"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    className="bg-white border border-[#E0DBCF] rounded px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-[#8B4513] text-[#1A1A1A] w-full sm:w-auto"
                  />
                </div>

                {/* End Date */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                    {language === 'af' ? 'Tot Datum' : 'End Date'}
                  </label>
                  <input
                    type="date"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    className="bg-white border border-[#E0DBCF] rounded px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-[#8B4513] text-[#1A1A1A] w-full sm:w-auto"
                  />
                </div>

                {/* Preset Controls */}
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    onClick={() => handleSetPreset('today')}
                    className={`px-3 py-1.5 rounded text-[9px] uppercase tracking-wider font-bold border transition-all cursor-pointer ${
                      filterStartDate === new Date().toISOString().split('T')[0] && filterEndDate === new Date().toISOString().split('T')[0]
                        ? 'bg-[#8B4513] border-[#8B4513] text-white'
                        : 'border-[#E0DBCF] bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {language === 'af' ? 'Vandag' : 'Today'}
                  </button>
                  <button
                    onClick={() => handleSetPreset('7days')}
                    className="px-3 py-1.5 rounded text-[9px] uppercase tracking-wider font-bold border border-[#E0DBCF] bg-white text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    {language === 'af' ? 'Laaste 7 Dae' : 'Last 7 Days'}
                  </button>
                  <button
                    onClick={() => handleSetPreset('30days')}
                    className="px-3 py-1.5 rounded text-[9px] uppercase tracking-wider font-bold border border-[#E0DBCF] bg-white text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    {language === 'af' ? 'Laaste 30 Dae' : 'Last 30 Days'}
                  </button>
                  {(filterStartDate || filterEndDate) && (
                    <button
                      onClick={() => handleSetPreset('clear')}
                      className="px-3 py-1.5 rounded text-[9px] uppercase tracking-wider font-bold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-all cursor-pointer flex items-center gap-1"
                    >
                      {language === 'af' ? 'Skoonmaak ✕' : 'Clear ✕'}
                    </button>
                  )}
                  {orders.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm(language === 'af' ? 'Is jy seker jy wil ALLE bestellings skoonmaak om vars te begin?' : 'Are you sure you want to clear ALL orders to start fresh?')) {
                          clearAllOrders();
                        }
                      }}
                      className="px-3 py-1.5 rounded text-[9px] uppercase tracking-wider font-bold bg-amber-50 text-[#8B4513] border border-[#8B4513]/20 hover:bg-amber-100 transition-all cursor-pointer flex items-center gap-1"
                    >
                      {language === 'af' ? 'Skoonmaak Nuut ✕' : 'Clear All Orders ✕'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Sales Card */}
            <div className="bg-white border border-[#E0DBCF] p-6 rounded shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Total Sales (ZAR)</span>
                <p className="text-2xl font-black text-[#1A1A1A]">R{analytics.sales.toFixed(2)}</p>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <ArrowUpRight size={10} /> +12% this month
                </span>
              </div>
              <div className="w-12 h-12 bg-[#8B4513]/10 text-[#8B4513] rounded-full flex items-center justify-center">
                <DollarSign size={20} />
              </div>
            </div>

            {/* Orders Card */}
            <div className="bg-white border border-[#E0DBCF] p-6 rounded shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Total Orders</span>
                <p className="text-2xl font-black text-[#1A1A1A]">{analytics.orders}</p>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <ArrowUpRight size={10} /> +8% new signups
                </span>
              </div>
              <div className="w-12 h-12 bg-[#C5A059]/10 text-[#C5A059] rounded-full flex items-center justify-center">
                <ShoppingCart size={20} />
              </div>
            </div>

            {/* AOV Card */}
            <div className="bg-white border border-[#E0DBCF] p-6 rounded shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Avg Order Value (AOV)</span>
                <p className="text-2xl font-black text-[#1A1A1A]">R{analytics.aov.toFixed(2)}</p>
                <span className="text-[10px] text-gray-400 font-bold">Aramex fees excluded</span>
              </div>
              <div className="w-12 h-12 bg-gray-100 text-[#1A1A1A] rounded-full flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
            </div>

            {/* CR Card */}
            <div className="bg-white border border-[#E0DBCF] p-6 rounded shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Conversion Rate (CR)</span>
                <p className="text-2xl font-black text-[#1A1A1A]">{analytics.cr}%</p>
                <span className="text-[10px] text-[#8B4513] font-bold">Industry High</span>
              </div>
              <div className="w-12 h-12 bg-[#8B4513]/10 text-[#8B4513] rounded-full flex items-center justify-center">
                <Percent size={20} />
              </div>
            </div>

          </div>

          {/* ADVANCED FINANCIAL MANAGEMENT SECTION (OPTION A) */}
          <div className="bg-white border border-[#E0DBCF] rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-[#E0DBCF] bg-[#F5F2ED] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] font-black text-[#1A1A1A] flex items-center gap-1.5">
                  <DollarSign size={14} className="text-[#8B4513]" />
                  <span>{language === 'af' ? 'FINANSIËLE BESTUUR & ONTLEDING' : 'FINANCIAL MANAGEMENT & ANALYTICS'}</span>
                </h3>
                <p className="text-[10px] text-gray-500 font-mono mt-1">
                  {language === 'af' ? 'Koste-van-goedere, poortfooie en winsgrens berekeninge' : 'Cost-of-goods, transaction fees and net margin analytics'}
                </p>
              </div>

              <button
                onClick={() => setShowFinancialSettings(!showFinancialSettings)}
                className="px-3.5 py-1.5 bg-[#8B4513] hover:bg-[#72380F] text-white rounded text-[9px] uppercase tracking-wider font-black transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Settings size={12} />
                <span>
                  {showFinancialSettings 
                    ? (language === 'af' ? 'Verberg Parameters' : 'Hide Parameters')
                    : (language === 'af' ? 'Pas Parameters Pas' : 'Adjust Parameters')}
                </span>
              </button>
            </div>

            {/* Editable Financial Settings Block */}
            {showFinancialSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="p-6 bg-[#F5F2ED]/30 border-b border-[#E0DBCF] grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">
                    {language === 'af' ? 'Vervaardigingskoste per eenheid (ZAR)' : 'Manufacturing cost per unit (ZAR)'}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-gray-400">R</span>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      max="269"
                      value={cogsPerItem}
                      onChange={(e) => setCogsPerItem(Number(e.target.value))}
                      className="bg-white border border-[#E0DBCF] rounded px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-[#8B4513] w-32"
                    />
                    <span className="text-[10px] text-gray-400">
                      ({language === 'af' ? 'bv. T-hemp drukkoste + materiaal' : 'e.g. T-shirt print + fabric cost'})
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">
                    {language === 'af' ? 'Maandelikse Bruto Inkomste Teiken (ZAR)' : 'Monthly Gross Revenue Target (ZAR)'}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-gray-400">R</span>
                    <input
                      type="number"
                      step="1000"
                      min="5000"
                      value={monthlySalesTarget}
                      onChange={(e) => setMonthlySalesTarget(Number(e.target.value))}
                      className="bg-white border border-[#E0DBCF] rounded px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-[#8B4513] w-40"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div className="p-6 md:p-8 space-y-8">
              {/* Detailed Ledger Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Cost of Goods Sold Ledger */}
                <div className="border border-[#E0DBCF]/80 rounded p-5 bg-gray-50/50 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">
                      {language === 'af' ? 'Koste van Verkope (COGS)' : 'Cost of Goods Sold'}
                    </span>
                    <span className="text-[9px] font-mono text-gray-400">
                      {analytics.itemsCount} {language === 'af' ? 'items verkoop' : 'items sold'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xl font-bold font-mono text-red-700">-R{analytics.cogs.toFixed(2)}</p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {language === 'af' ? `Bereken teen R${cogsPerItem.toFixed(2)} per eenheid` : `Calculated at R${cogsPerItem.toFixed(2)} per unit`}
                    </p>
                  </div>
                </div>

                {/* Gateway / Transaction Fees */}
                <div className="border border-[#E0DBCF]/80 rounded p-5 bg-gray-50/50 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">
                      {language === 'af' ? 'Transaksie- & EFT-fooie' : 'Gateway & Card Fees'}
                    </span>
                    <span className="text-[9px] font-mono text-gray-400">2.5% Avg</span>
                  </div>
                  <div>
                    <p className="text-xl font-bold font-mono text-red-700">-R{analytics.gatewayFees.toFixed(2)}</p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {language === 'af' ? 'Ozow Instant EFT & Kaart verwerking' : 'Ozow Instant EFT & Card payment routing'}
                    </p>
                  </div>
                </div>

                {/* Net Profit Margin Card */}
                <div className="border border-[#8B4513]/20 rounded p-5 bg-[#8B4513]/5 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] uppercase tracking-widest text-[#8B4513] font-bold">
                      {language === 'af' ? 'Netto Wins & Winsgrens' : 'Net Profit & Margin'}
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                      analytics.margin >= 50 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {analytics.margin.toFixed(1)}% Margin
                    </span>
                  </div>
                  <div>
                    <p className="text-xl font-black font-mono text-emerald-800">R{analytics.netProfit.toFixed(2)}</p>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {language === 'af' ? 'Netto wins oorblywend na alle direkte kostes' : 'Remaining net profit after all direct variables'}
                    </p>
                  </div>
                </div>

              </div>

              {/* Progress towards Monthly Target Meter */}
              <div className="border border-[#E0DBCF] rounded-lg p-6 bg-amber-50/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-black text-[#1A1A1A]">
                      {language === 'af' ? 'MAANDELIKSE INKOMSTE TEIKEN VORDERING' : 'MONTHLY REVENUE TARGET PROGRESS'}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                      {language === 'af' ? `Teiken: R${monthlySalesTarget.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}` : `Target: R${monthlySalesTarget.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black font-mono text-[#8B4513]">
                      {Math.min(100, (analytics.sales / monthlySalesTarget) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full bg-[#E0DBCF]/40 rounded-full h-3.5 overflow-hidden border border-[#E0DBCF]/80 p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (analytics.sales / monthlySalesTarget) * 100)}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="bg-gradient-to-r from-[#C5A059] to-[#8B4513] h-full rounded-full"
                  />
                </div>

                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>R0.00</span>
                  <span className="text-[#8B4513] font-bold">
                    {analytics.sales >= monthlySalesTarget 
                      ? (language === 'af' ? '🏆 TEIKEN BEREIK!' : '🏆 TARGET ACHIEVED!') 
                      : (language === 'af' ? `R${(monthlySalesTarget - analytics.sales).toFixed(2)} kort om teiken te bereik` : `R${(monthlySalesTarget - analytics.sales).toFixed(2)} remaining to hit target`)}
                  </span>
                  <span>R{monthlySalesTarget.toLocaleString('en-ZA')}</span>
                </div>
              </div>

              {/* Utility / Copy Ledger Text Block */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#E0DBCF]/60">
                <span className="text-[10px] text-gray-400 italic font-mono text-center sm:text-left">
                  {language === 'af' 
                    ? '* Alle finansiële state hierbo is geskoei op geselekteerde veranderlikes.' 
                    : '* All financial statements above are based on chosen variables.'}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    const text = `
========================================
VOLKSGROND HANDELAAR FINANSIËLE STAAT DRAFT
Datum: ${new Date().toLocaleDateString('af-ZA')}
========================================
Bruto Verkope (Gross Revenue): R${analytics.sales.toFixed(2)}
Aantal Bestellings (Total Orders): ${analytics.orders}
Gemiddelde Bestelwaarde (AOV): R${analytics.aov.toFixed(2)}
Produkte Verkoop (Estimated Qty): ${analytics.itemsCount}

-- DIREKTE VERANDERLIKE UTGAWES --
Koste van Goedere Verkoop (COGS): -R${analytics.cogs.toFixed(2)} (R${cogsPerItem.toFixed(2)} p/u)
Kaart- & Poortfooie (Gateway Fees): -R${analytics.gatewayFees.toFixed(2)} (2.5%)

-- NETTO RESULTATE --
Netto Wins (Estimated Net Profit): R${analytics.netProfit.toFixed(2)}
Winsgrens (Net Margin %): ${analytics.margin.toFixed(2)}%
Maandelikse Teiken Vordering: ${((analytics.sales / monthlySalesTarget) * 100).toFixed(1)}%
========================================`;
                    navigator.clipboard.writeText(text);
                    alert(language === 'af' ? 'Finansiële staat gekopieer na knipbord!' : 'Financial statement copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1A1A1A] rounded text-[9px] uppercase tracking-wider font-black transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {language === 'af' ? 'Kopieer Finansiële Verslag' : 'Copy Financial Statement'}
                </button>
              </div>

            </div>
          </div>

          {/* Quick Informational Notice */}
          <div className="bg-[#E0DBCF]/30 border border-[#E0DBCF] p-6 rounded-lg text-xs flex items-start space-x-3 max-w-4xl">
            <AlertCircle className="text-[#8B4513] flex-shrink-0" size={18} />
            <div>
              <p className="font-bold text-[#1A1A1A] uppercase tracking-wider text-[11px]">Bestuurspaneel Inligting</p>
              <p className="text-gray-600 mt-1 leading-relaxed">
                As admin besit jy volle magte oor die Volksgrond databasis. Bestel logs wys intydse aankoop-data direk van die Express bediener. Jy kan die Aramex opspoor-kodes byvoeg om kliënte op hoogte te hou deur hul Aramex selfoonnommers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-[#E0DBCF] rounded shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E0DBCF] bg-[#F5F2ED]">
            <h3 className="text-xs uppercase tracking-wider font-black text-[#1A1A1A]">
              Kliënte Bestelling Logs ({orders.length})
            </h3>
          </div>

          {orders.length === 0 ? (
            <div className="p-16 text-center text-xs text-gray-400 italic">
              Geen bestellings is tans op hierdie sessie geplaas nie. Plaas asseblief \'n toets-bestelling in die winkel!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F5F2ED]/50 text-gray-500 border-b border-[#E0DBCF] uppercase font-black tracking-wider text-[9px]">
                    <th className="p-4">ID</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Details</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status & Tracking</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0DBCF]/70">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#8B4513]">{ord.id}</td>
                      <td className="p-4 text-gray-400 font-mono">{ord.date}</td>
                      <td className="p-4 font-bold">
                        <div>{ord.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">{ord.phone}</div>
                      </td>
                      <td className="p-4">
                        <ul className="space-y-1">
                          {ord.items.map((item: any, idx: number) => (
                            <li key={idx} className="text-[10px]">
                              - <span className="font-bold">{item.productName.af}</span> x{item.quantity} ({item.size})
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-4 font-mono font-bold">R{ord.total.toFixed(2)}</td>
                      <td className="p-4">
                        <div className="space-y-1.5">
                          <span className={`inline-block text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                            ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                            ord.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            ord.status === 'processing' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {ord.status}
                          </span>
                          
                          {/* Tracking number display or update */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder={
                                ord.shippingMethod === 'postnet' ? 'PostNet Waybill #' :
                                ord.shippingMethod === 'courier-guy' ? 'Courier Guy #' :
                                'Aramex Waybill #'
                              }
                              value={trackingInputs[ord.id] ?? ord.trackingNumber ?? ''}
                              onChange={(e) => setTrackingInputs(prev => ({ ...prev, [ord.id]: e.target.value }))}
                              className="bg-[#F5F2ED] border border-[#E0DBCF] rounded px-2 py-1 text-[10px] w-36 focus:outline-none focus:border-[#8B4513]"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleStatusUpdate(ord.id, 'processing')}
                            className="bg-amber-500 hover:bg-amber-600 text-white text-[9px] font-bold uppercase tracking-wider py-1 px-2 rounded cursor-pointer text-center"
                          >
                            Process
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(ord.id, 'shipped')}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-[9px] font-bold uppercase tracking-wider py-1 px-2 rounded cursor-pointer text-center"
                          >
                            Ship / Versend
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(ord.id, 'delivered')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold uppercase tracking-wider py-1 px-2 rounded cursor-pointer text-center"
                          >
                            Deliver
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(language === 'af' ? `Is jy seker jy wil bestelling ${ord.id} uitvee?` : `Are you sure you want to delete order ${ord.id}?`)) {
                                deleteOrder(ord.id);
                              }
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white text-[9px] font-bold uppercase tracking-wider py-1 px-2 rounded cursor-pointer text-center flex items-center justify-center gap-1"
                          >
                            <Trash2 size={10} />
                            <span>{language === 'af' ? 'Skrap' : 'Delete'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* INVENTORY TAB */}
      {activeTab === 'inventory' && (
        <div className="bg-white border border-[#E0DBCF] rounded shadow-sm overflow-hidden">
          {/* Header Action Row */}
          <div className="px-6 py-4 border-b border-[#E0DBCF] bg-[#F5F2ED] flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-xs uppercase tracking-wider font-black text-[#1A1A1A]">
              {language === 'af' ? 'Voorraad & Variant Bestuurspaneel' : 'Inventory & Variant Control Panel'} ({products.length})
            </h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[#8B4513] hover:bg-[#72380F] text-white px-4 py-2 rounded text-[10px] uppercase tracking-wider font-black cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={14} />
              <span>{showAddForm ? (language === 'af' ? 'Kanselleer' : 'Cancel') : (language === 'af' ? 'Nuwe Ontwerp' : 'New Design')}</span>
            </button>
          </div>

          {/* Add Product Form Section */}
          {showAddForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="border-b border-[#E0DBCF] bg-[#F5F2ED]/30 p-6 md:p-8"
            >
              <form onSubmit={handleAddProduct} className="space-y-6 max-w-4xl">
                <div className="border-b border-[#E0DBCF]/60 pb-3">
                  <h4 className="text-xs uppercase tracking-widest font-black text-[#8B4513]">
                    {language === 'af' ? 'VOEG NUWE PRODUK BY' : 'ADD NEW LAUNCH PRODUCT'}
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {language === 'af' ? 'Vul asseblief die produk besonderhede in beide Afrikaans en Engels in vir die taalwisselaar.' : 'Please provide product details in both Afrikaans and English for the language switcher.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* ID Field */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Unieke ID (Slug)' : 'Unique ID (Slug)'} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="bv. vryheid-themp"
                      value={newProdId}
                      onChange={(e) => setNewProdId(e.target.value)}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513] font-mono"
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Prys (ZAR)' : 'Price (ZAR)'} *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(Number(e.target.value))}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513] font-mono"
                    />
                  </div>

                  {/* Stock */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Begin Voorraad' : 'Initial Stock'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(Number(e.target.value))}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513] font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Kategorie' : 'Category'} *
                    </label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value as any)}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513]"
                    >
                      <option value="men">{language === 'af' ? 'Mans / Men' : 'Men'}</option>
                      <option value="ladies">{language === 'af' ? 'Dames / Ladies' : 'Ladies'}</option>
                      <option value="volkspore">{language === 'af' ? 'Volkspore Kinders / Volkspore Kids' : 'Volkspore Kids'}</option>
                      <option value="caps">{language === 'af' ? 'Kepse / Caps' : 'Caps'}</option>
                    </select>
                  </div>

                  {/* Cost Price */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Kosprys (ZAR)' : 'Cost Price (ZAR)'} *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={newProdCostPrice}
                      onChange={(e) => setNewProdCostPrice(Number(e.target.value))}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513] font-mono"
                    />
                  </div>
                </div>

                {/* Dual Image Option - Presets + Upload */}
                <div className="border border-[#E0DBCF] rounded p-4 bg-white space-y-4">
                  <div className="border-b border-[#E0DBCF]/60 pb-2">
                    <h5 className="text-[10px] uppercase tracking-wider font-black text-[#8B4513]">
                      {language === 'af' ? 'PRODUK AFBEELDING BRON' : 'PRODUCT IMAGE SOURCE'}
                    </h5>
                    <p className="text-[9px] text-gray-500">
                      {language === 'af' ? 'Kies \'n bestaande premium agtergrond of laai jou eie hoë-resolusie produkfoto op.' : 'Choose an existing premium preset background or upload your own high-resolution product photo.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Preset Option */}
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                        {language === 'af' ? 'Metode 1: Kies \'n Premium Voorinstelling' : 'Method 1: Choose a Premium Preset'}
                      </label>
                      <select
                        value={newProdImageUrl}
                        onChange={(e) => {
                          setNewProdImageUrl(e.target.value);
                          setUploadError(null);
                        }}
                        className="w-full bg-white border border-[#E0DBCF] rounded p-2.5 text-xs focus:outline-none focus:border-[#8B4513]"
                      >
                        <option value="/src/assets/images/volksgrond_heritage_bg_1783548402167.jpg">Premium Heritage Dark Model Background</option>
                        <option value="/src/assets/images/volksgrond_story_collage_1783553284607.jpg">Traditional Story Collage Style</option>
                        <option value="/src/assets/images/volksgrond_story_farmers_collage_1783553446942.jpg">South African Farming/Earthy Background</option>
                        <option value="/src/assets/images/erfenis_black_tshirt_1783544659803.jpg">Heritage Black T-Shirt Flatlay</option>
                        <option value="/src/assets/images/boerekrygers_white_tshirt_1783544674183.jpg">Boerekrygers White T-Shirt Flatlay</option>
                        <option value="/src/assets/images/boerekrygers_sand_cap_1783544687518.jpg">Boerekrygers Sand Cap Flatlay</option>
                        <option value="/src/assets/images/bloedsweet_tshirt_1783554692468.jpg">Bloedsweet Swart T-hemp</option>
                        <option value="/src/assets/images/blommekrans_tshirt_1783554730461.jpg">Blommekrans Wit T-hemp</option>
                        <option value="/src/assets/images/borselkruis_wit_tshirt_1783554666881.jpg">Borselkruis Wit T-hemp</option>
                        <option value="/src/assets/images/eukalipte_tshirt_1783554716730.jpg">Eukalipte Groen T-hemp</option>
                        <option value="/src/assets/images/goue_kruis_tshirt_1783554648467.jpg">Goue Kruis Swart T-hemp</option>
                        <option value="/src/assets/images/juweelkruis_tshirt_1783554744793.jpg">Juweelkruis Wit T-hemp</option>
                        <option value="/src/assets/images/koringaar_tshirt_1783554680276.jpg">Koringaar Swart T-hemp</option>
                        <option value="/src/assets/images/libel_tshirt_1783554704633.jpg">Libel Groen T-hemp</option>
                      </select>

                      <div className="mt-4 border border-[#E0DBCF]/60 rounded p-2 bg-[#F5F2ED]/20 flex items-center gap-3">
                        <img 
                          src={newProdImageUrl} 
                          alt="Live Preview" 
                          className="w-16 h-16 object-cover rounded border border-[#E0DBCF] bg-white shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-bold">
                            {language === 'af' ? 'Huidige Keuse' : 'Current Selection'}
                          </span>
                          <span className="text-[10px] text-gray-700 font-mono break-all line-clamp-2">
                            {newProdImageUrl.split('/').pop()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Drag & Drop Upload Option */}
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                        {language === 'af' ? 'Metode 2: Sleep en Drop of Kies \'n Beeld' : 'Method 2: Drag & Drop or Choose an Image'}
                      </label>
                      
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[140px] ${
                          dragActive 
                            ? 'border-[#8B4513] bg-[#8B4513]/5' 
                            : 'border-[#E0DBCF] hover:border-[#8B4513]/60 bg-[#F5F2ED]/10 hover:bg-[#F5F2ED]/20'
                        }`}
                        onClick={() => document.getElementById('product-image-upload')?.click()}
                        type="button"
                      >
                        <input
                          id="product-image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />

                        {isUploading ? (
                          <div className="flex flex-col items-center space-y-2">
                            <RefreshCw className="animate-spin text-[#8B4513]" size={24} />
                            <span className="text-[10px] uppercase tracking-widest font-bold text-[#8B4513]">
                              {language === 'af' ? 'Besig om op te laai...' : 'Uploading image...'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center space-y-1">
                            <Upload className="text-[#8B4513] mb-1" size={24} />
                            <span className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
                              {language === 'af' ? 'Laai Nuwe Beeld Op' : 'Upload New Image'}
                            </span>
                            <span className="text-[9px] text-gray-400">
                              {language === 'af' ? 'Sleep beeld hierheen of kliek om te blaaier' : 'Drag image here or click to browse'}
                            </span>
                            <span className="text-[8px] text-gray-400 font-mono mt-0.5">
                              PNG, JPG, WEBP (MAX 10MB)
                            </span>
                          </div>
                        )}
                      </div>

                      {uploadError && (
                        <div className="text-[10px] text-red-600 bg-red-50 p-2 rounded border border-red-100 flex items-center gap-1.5 mt-2">
                          <AlertCircle size={14} className="shrink-0" />
                          <span>{uploadError}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Promo & Display Location Box */}
                <div className="border border-[#E0DBCF] rounded p-4 bg-white space-y-4">
                  <div className="border-b border-[#E0DBCF]/60 pb-2">
                    <h5 className="text-[10px] uppercase tracking-wider font-black text-[#8B4513]">
                      {language === 'af' ? 'SPESIALE PROMOSIE & TUISBLAD VERTOON-OPSIES' : 'SPECIAL PROMOTION & HOMEPAGE DISPLAY OPTIONS'}
                    </h5>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tickbox and Description */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 bg-[#F5F2ED]/30 p-2.5 rounded border border-[#E0DBCF]/40">
                        <input
                          id="new-prod-promo-cb"
                          type="checkbox"
                          checked={newProdIsPromo}
                          onChange={(e) => setNewProdIsPromo(e.target.checked)}
                          className="h-4.5 w-4.5 text-[#8B4513] border-gray-300 rounded focus:ring-[#8B4513]"
                        />
                        <label htmlFor="new-prod-promo-cb" className="text-xs font-black text-gray-700 select-none cursor-pointer">
                          {language === 'af' ? 'Aktiveer Spesiale Promosie Aanbod' : 'Enable Special Promotion Offer'}
                        </label>
                      </div>

                      {newProdIsPromo && (
                        <div className="space-y-3 p-3 bg-amber-50/40 rounded border border-amber-200/50 animate-fadeIn">
                          <div>
                            <label className="text-[9px] uppercase tracking-wider text-amber-800 font-bold block mb-1">
                              {language === 'af' ? 'Promosie Beskrywing (Afrikaans)' : 'Promotion Description (Afrikaans)'} *
                            </label>
                            <input
                              type="text"
                              required={newProdIsPromo}
                              placeholder={language === 'af' ? 'bv. Koop 2 en kry 10% afslag op jou hele bestelling!' : 'e.g. Buy 2 and get 10% off your entire order!'}
                              value={newProdPromoTextAf}
                              onChange={(e) => setNewProdPromoTextAf(e.target.value)}
                              className="w-full bg-white border border-amber-200 rounded p-2 text-xs focus:outline-none focus:border-[#8B4513]"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] uppercase tracking-wider text-amber-800 font-bold block mb-1">
                              {language === 'af' ? 'Promosie Beskrywing (Engels)' : 'Promotion Description (English)'} *
                            </label>
                            <input
                              type="text"
                              required={newProdIsPromo}
                              placeholder={language === 'af' ? 'bv. Buy 2 and get 10% off your entire order!' : 'e.g. Buy 2 and get 10% off your entire order!'}
                              value={newProdPromoTextEn}
                              onChange={(e) => setNewProdPromoTextEn(e.target.value)}
                              className="w-full bg-white border border-amber-200 rounded p-2 text-xs focus:outline-none focus:border-[#8B4513]"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Display Location */}
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                        {language === 'af' ? 'Waar moet hierdie produk vertoon word?' : 'Where should this product be displayed?'}
                      </label>
                      <select
                        value={newProdDisplayLocation}
                        onChange={(e) => setNewProdDisplayLocation(e.target.value as any)}
                        className="w-full bg-white border border-[#E0DBCF] rounded p-2.5 text-xs focus:outline-none focus:border-[#8B4513]"
                      >
                        <option value="shop_only">{language === 'af' ? 'Net in Winkel / Katalogus' : 'Only in Shop / Catalog'}</option>
                        <option value="home_featured">{language === 'af' ? 'Gewildste Kampioene (Tuisblad Hoogtepunt)' : 'Featured Favorites (Homepage Highlight)'}</option>
                        <option value="categories">{language === 'af' ? 'Gewone Kategorieë Slegs' : 'Normal Categories Only'}</option>
                      </select>
                      <p className="text-[9px] text-gray-400">
                        {language === 'af' 
                          ? 'Kies "Gewildste Kampioene" om hierdie produk prominent bo-aan die tuisblad te plaas.' 
                          : 'Select "Featured Favorites" to place this product prominently at the top of the homepage.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Placeholders Gallery Box */}
                <div className="border border-[#E0DBCF] rounded p-4 bg-white space-y-4">
                  <div className="border-b border-[#E0DBCF]/60 pb-2">
                    <h5 className="text-[10px] uppercase tracking-wider font-black text-[#8B4513]">
                      {language === 'af' ? 'PRODUK GALERY BEELDE (MAKS 5 SUBS)' : 'PRODUCT GALLERY IMAGES (MAX 5 SUBS)'}
                    </h5>
                    <p className="text-[9px] text-gray-500">
                      {language === 'af' ? 'Laai tot 5 addisionele beelde of placeholders op wat kliënte in die produkblad kan sien.' : 'Upload up to 5 additional images or placeholders that customers can see on the product page.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {newProdGallery.map((imgUrl, idx) => (
                      <div key={idx} className="border border-[#E0DBCF] rounded p-3 bg-[#F5F2ED]/10 flex flex-col space-y-2 relative">
                        <div className="flex items-center justify-between border-b border-[#E0DBCF]/40 pb-1.5">
                          <span className="text-[9px] font-black uppercase text-[#8B4513]">
                            {language === 'af' ? `Beeld #${idx + 1}` : `Image #${idx + 1}`}
                          </span>
                          {imgUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                setNewProdGallery(prev => {
                                  const copy = [...prev];
                                  copy[idx] = '';
                                  return copy;
                                });
                              }}
                              className="text-[9px] font-bold text-red-600 hover:underline cursor-pointer"
                            >
                              {language === 'af' ? 'Verwyder' : 'Remove'}
                            </button>
                          )}
                        </div>

                        {/* Thumbnail or Empty State */}
                        <div className="aspect-square bg-white border border-[#E0DBCF] rounded overflow-hidden flex items-center justify-center relative">
                          {imgUrl ? (
                            <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="flex flex-col items-center text-center p-2">
                              <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">
                                {language === 'af' ? 'Leeg' : 'Empty'}
                              </span>
                            </div>
                          )}
                          {galleryUploadingIdx === idx && (
                            <div className="absolute inset-0 bg-white/85 flex items-center justify-center">
                              <RefreshCw className="animate-spin text-[#8B4513]" size={16} />
                            </div>
                          )}
                        </div>

                        {/* Preset Select or File Upload */}
                        <div className="space-y-1">
                          <select
                            value={imgUrl}
                            onChange={(e) => {
                              setNewProdGallery(prev => {
                                const copy = [...prev];
                                copy[idx] = e.target.value;
                                return copy;
                              });
                            }}
                            className="w-full bg-white border border-[#E0DBCF]/80 rounded p-1 text-[9px] focus:outline-none"
                          >
                            <option value="">-- {language === 'af' ? 'Voorinstelling' : 'Preset'} --</option>
                            <option value="/src/assets/images/volksgrond_heritage_bg_1783548402167.jpg">Heritage Dark Background</option>
                            <option value="/src/assets/images/volksgrond_story_collage_1783553284607.jpg">Story Collage Style</option>
                            <option value="/src/assets/images/volksgrond_story_farmers_collage_1783553446942.jpg">South African Farming/Earthy</option>
                            <option value="/src/assets/images/erfenis_black_tshirt_1783544659803.jpg">Heritage Black T-Shirt</option>
                            <option value="/src/assets/images/boerekrygers_white_tshirt_1783544674183.jpg">Boerekrygers White T-Shirt</option>
                            <option value="/src/assets/images/boerekrygers_sand_cap_1783544687518.jpg">Boerekrygers Sand Cap</option>
                            <option value="/src/assets/images/bloedsweet_tshirt_1783554692468.jpg">Bloedsweet Swart T-hemp</option>
                            <option value="/src/assets/images/blommekrans_tshirt_1783554730461.jpg">Blommekrans Wit T-hemp</option>
                            <option value="/src/assets/images/borselkruis_wit_tshirt_1783554666881.jpg">Borselkruis Wit T-hemp</option>
                            <option value="/src/assets/images/eukalipte_tshirt_1783554716730.jpg">Eukalipte Groen T-hemp</option>
                            <option value="/src/assets/images/goue_kruis_tshirt_1783554648467.jpg">Goue Kruis Swart T-hemp</option>
                            <option value="/src/assets/images/juweelkruis_tshirt_1783554744793.jpg">Juweelkruis Wit T-hemp</option>
                            <option value="/src/assets/images/koringaar_tshirt_1783554680276.jpg">Koringaar Swart T-hemp</option>
                            <option value="/src/assets/images/libel_tshirt_1783554704633.jpg">Libel Groen T-hemp</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => document.getElementById(`gallery-upload-add-${idx}`)?.click()}
                            className="w-full py-1 border border-[#8B4513]/40 rounded hover:bg-[#8B4513]/5 text-[#8B4513] text-[9px] font-black uppercase tracking-wider cursor-pointer font-sans"
                          >
                            {language === 'af' ? 'Laai Lêer op' : 'Upload File'}
                          </button>
                          <input
                            id={`gallery-upload-add-${idx}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleGalleryUpload(e.target.files[0], idx, false);
                              }
                            }}
                            className="hidden"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name AF */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Produknaam (Afrikaans)' : 'Product Name (Afrikaans)'} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="bv. Vryheid Goue Kruis T-hemp"
                      value={newProdNameAf}
                      onChange={(e) => setNewProdNameAf(e.target.value)}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513]"
                    />
                  </div>

                  {/* Name EN */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Produknaam (Engels)' : 'Product Name (English)'} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="bv. Freedom Golden Cross T-Shirt"
                      value={newProdNameEn}
                      onChange={(e) => setNewProdNameEn(e.target.value)}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Description AF */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Beskrywing (Afrikaans)' : 'Description (Afrikaans)'}
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Hierdie premium hemp herdenk..."
                      value={newProdDescAf}
                      onChange={(e) => setNewProdDescAf(e.target.value)}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513]"
                    />
                  </div>

                  {/* Description EN */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Beskrywing (Engels)' : 'Description (English)'}
                    </label>
                    <textarea
                      rows={3}
                      placeholder="This premium t-shirt celebrates..."
                      value={newProdDescEn}
                      onChange={(e) => setNewProdDescEn(e.target.value)}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Features AF */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Kenmerke (Een per reël)' : 'Features (One per line)'}
                    </label>
                    <textarea
                      rows={3}
                      value={newProdFeaturesAf}
                      onChange={(e) => setNewProdFeaturesAf(e.target.value)}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513] font-mono text-[11px]"
                    />
                  </div>

                  {/* Features EN */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Kenmerke Engels (Een per reël)' : 'Features English (One per line)'}
                    </label>
                    <textarea
                      rows={3}
                      value={newProdFeaturesEn}
                      onChange={(e) => setNewProdFeaturesEn(e.target.value)}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513] font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Material AF */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Materiale (Afrikaans)' : 'Materials (Afrikaans)'}
                    </label>
                    <input
                      type="text"
                      value={newProdMaterialsAf}
                      onChange={(e) => setNewProdMaterialsAf(e.target.value)}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513]"
                    />
                  </div>

                  {/* Material EN */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Materiale (Engels)' : 'Materials (English)'}
                    </label>
                    <input
                      type="text"
                      value={newProdMaterialsEn}
                      onChange={(e) => setNewProdMaterialsEn(e.target.value)}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Care AF */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Sorg-Instruksies (Afrikaans)' : 'Care Instructions (Afrikaans)'}
                    </label>
                    <input
                      type="text"
                      value={newProdCareAf}
                      onChange={(e) => setNewProdCareAf(e.target.value)}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513]"
                    />
                  </div>

                  {/* Care EN */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Sorg-Instruksies (Engels)' : 'Care Instructions (English)'}
                    </label>
                    <input
                      type="text"
                      value={newProdCareEn}
                      onChange={(e) => setNewProdCareEn(e.target.value)}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="border border-[#E0DBCF] hover:bg-gray-50 text-gray-600 px-5 py-2.5 rounded text-[10px] uppercase tracking-wider font-black cursor-pointer transition-all"
                  >
                    {language === 'af' ? 'Kanselleer' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="bg-[#1A1A1A] hover:bg-black text-white px-6 py-2.5 rounded text-[10px] uppercase tracking-wider font-black cursor-pointer transition-all shadow-md"
                  >
                    {language === 'af' ? 'Stoor Nuwe Produk' : 'Save New Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Edit Product Form Section */}
          {editingProductId && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="border-b-2 border-[#8B4513] bg-[#8B4513]/5 p-6 md:p-8"
            >
              <form onSubmit={handleEditProduct} className="space-y-6 max-w-4xl">
                <div className="border-b border-[#E0DBCF]/80 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-black text-[#8B4513]">
                      {language === 'af' ? 'WYSIG PRODUK REËL' : 'EDIT PRODUCT LINE'}
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-0.5 font-mono">
                      ID: {editingProductId}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingProductId(null)}
                    className="text-xs text-gray-400 hover:text-gray-600 font-bold"
                  >
                    {language === 'af' ? 'Toemaak' : 'Close'} [X]
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Read-only ID */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">
                      {language === 'af' ? 'Produk ID (Lees-Alleen)' : 'Product ID (Read-Only)'}
                    </label>
                    <input
                      type="text"
                      disabled
                      value={editingProductId}
                      className="w-full bg-gray-100 border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none font-mono text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Prys (ZAR)' : 'Price (ZAR)'} *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editProdPrice}
                      onChange={(e) => setEditProdPrice(Number(e.target.value))}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513] font-mono"
                    />
                  </div>

                  {/* Stock */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Huidige Voorraad' : 'Current Stock'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editProdStock}
                      onChange={(e) => setEditProdStock(Number(e.target.value))}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513] font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Kategorie' : 'Category'} *
                    </label>
                    <select
                      value={editProdCategory}
                      onChange={(e) => setEditProdCategory(e.target.value as any)}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513]"
                    >
                      <option value="men">{language === 'af' ? 'Mans / Men' : 'Men'}</option>
                      <option value="ladies">{language === 'af' ? 'Dames / Ladies' : 'Ladies'}</option>
                      <option value="volkspore">{language === 'af' ? 'Volkspore Kinders / Volkspore Kids' : 'Volkspore Kids'}</option>
                      <option value="caps">{language === 'af' ? 'Kepse / Caps' : 'Caps'}</option>
                    </select>
                  </div>

                  {/* Cost Price */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Kosprys (ZAR)' : 'Cost Price (ZAR)'} *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={editProdCostPrice}
                      onChange={(e) => setEditProdCostPrice(Number(e.target.value))}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513] font-mono"
                    />
                  </div>
                </div>

                {/* Image selector & uploader */}
                <div className="border border-[#E0DBCF] rounded p-4 bg-white space-y-4">
                  <div className="border-b border-[#E0DBCF]/60 pb-2">
                    <h5 className="text-[10px] uppercase tracking-wider font-black text-[#8B4513]">
                      {language === 'af' ? 'PRODUK AFBEELDING BRON' : 'PRODUCT IMAGE SOURCE'}
                    </h5>
                    <p className="text-[9px] text-gray-500">
                      {language === 'af' ? 'Kies \'n bestaande agtergrond of laai \'n nuwe foto op vir hierdie produk.' : 'Choose an existing background or upload a new photo for this product.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Preset Option */}
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                        {language === 'af' ? 'Wysig Voorinstelling' : 'Edit Preset Selection'}
                      </label>
                      <select
                        value={editProdImageUrl}
                        onChange={(e) => setEditProdImageUrl(e.target.value)}
                        className="w-full bg-white border border-[#E0DBCF] rounded p-2.5 text-xs focus:outline-none focus:border-[#8B4513]"
                      >
                        <option value="/src/assets/images/volksgrond_heritage_bg_1783548402167.jpg">Premium Heritage Dark Model Background</option>
                        <option value="/src/assets/images/volksgrond_story_collage_1783553284607.jpg">Traditional Story Collage Style</option>
                        <option value="/src/assets/images/volksgrond_story_farmers_collage_1783553446942.jpg">South African Farming/Earthy Background</option>
                        <option value="/src/assets/images/erfenis_black_tshirt_1783544659803.jpg">Heritage Black T-Shirt Flatlay</option>
                        <option value="/src/assets/images/boerekrygers_white_tshirt_1783544674183.jpg">Boerekrygers White T-Shirt Flatlay</option>
                        <option value="/src/assets/images/boerekrygers_sand_cap_1783544687518.jpg">Boerekrygers Sand Cap Flatlay</option>
                        <option value="/src/assets/images/bloedsweet_tshirt_1783554692468.jpg">Bloedsweet Swart T-hemp</option>
                        <option value="/src/assets/images/blommekrans_tshirt_1783554730461.jpg">Blommekrans Wit T-hemp</option>
                        <option value="/src/assets/images/borselkruis_wit_tshirt_1783554666881.jpg">Borselkruis Wit T-hemp</option>
                        <option value="/src/assets/images/eukalipte_tshirt_1783554716730.jpg">Eukalipte Groen T-hemp</option>
                        <option value="/src/assets/images/goue_kruis_tshirt_1783554648467.jpg">Goue Kruis Swart T-hemp</option>
                        <option value="/src/assets/images/juweelkruis_tshirt_1783554744793.jpg">Juweelkruis Wit T-hemp</option>
                        <option value="/src/assets/images/koringaar_tshirt_1783554680276.jpg">Koringaar Swart T-hemp</option>
                        <option value="/src/assets/images/libel_tshirt_1783554704633.jpg">Libel Groen T-hemp</option>
                      </select>

                      <div className="mt-4 border border-[#E0DBCF]/60 rounded p-2 bg-[#F5F2ED]/20 flex items-center gap-3">
                        <img 
                          src={editProdImageUrl} 
                          alt="Edit Live Preview" 
                          className="w-16 h-16 object-cover rounded border border-[#E0DBCF] bg-white shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-bold">
                            {language === 'af' ? 'Huidige Beeld' : 'Current Image'}
                          </span>
                          <span className="text-[10px] text-gray-700 font-mono break-all line-clamp-2">
                            {editProdImageUrl.split('/').pop()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Drag & Drop Upload Option */}
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                        {language === 'af' ? 'Laai Nuwe Beeld Op vir hierdie produk' : 'Upload New Image for this product'}
                      </label>
                      
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[140px] ${
                          dragActive 
                            ? 'border-[#8B4513] bg-[#8B4513]/5' 
                            : 'border-[#E0DBCF] hover:border-[#8B4513]/60 bg-[#F5F2ED]/10 hover:bg-[#F5F2ED]/20'
                        }`}
                        onClick={() => document.getElementById('product-image-edit-upload')?.click()}
                        type="button"
                      >
                        <input
                          id="product-image-edit-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />

                        {isUploading ? (
                          <div className="flex flex-col items-center space-y-2">
                            <RefreshCw className="animate-spin text-[#8B4513]" size={24} />
                            <span className="text-[10px] uppercase tracking-widest font-bold text-[#8B4513]">
                              {language === 'af' ? 'Besig om op te laai...' : 'Uploading image...'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center space-y-1">
                            <Upload className="text-[#8B4513] mb-1" size={24} />
                            <span className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
                              {language === 'af' ? 'Laai Nuwe Beeld Op' : 'Upload New Image'}
                            </span>
                            <span className="text-[9px] text-gray-400">
                              {language === 'af' ? 'Sleep nuwe beeld hierheen of kliek' : 'Drag new image here or click'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Promo & Display Location Box for Editing */}
                <div className="border border-[#E0DBCF] rounded p-4 bg-white space-y-4">
                  <div className="border-b border-[#E0DBCF]/60 pb-2">
                    <h5 className="text-[10px] uppercase tracking-wider font-black text-[#8B4513]">
                      {language === 'af' ? 'SPESIALE PROMOSIE & TUISBLAD VERTOON-OPSIES' : 'SPECIAL PROMOTION & HOMEPAGE DISPLAY OPTIONS'}
                    </h5>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tickbox and Description */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 bg-[#F5F2ED]/30 p-2.5 rounded border border-[#E0DBCF]/40">
                        <input
                          id="edit-prod-promo-cb"
                          type="checkbox"
                          checked={editProdIsPromo}
                          onChange={(e) => setEditProdIsPromo(e.target.checked)}
                          className="h-4.5 w-4.5 text-[#8B4513] border-gray-300 rounded focus:ring-[#8B4513]"
                        />
                        <label htmlFor="edit-prod-promo-cb" className="text-xs font-black text-gray-700 select-none cursor-pointer">
                          {language === 'af' ? 'Aktiveer Spesiale Promosie Aanbod' : 'Enable Special Promotion Offer'}
                        </label>
                      </div>

                      {editProdIsPromo && (
                        <div className="space-y-3 p-3 bg-amber-50/40 rounded border border-amber-200/50 animate-fadeIn">
                          <div>
                            <label className="text-[9px] uppercase tracking-wider text-amber-800 font-bold block mb-1">
                              {language === 'af' ? 'Promosie Beskrywing (Afrikaans)' : 'Promotion Description (Afrikaans)'} *
                            </label>
                            <input
                              type="text"
                              required={editProdIsPromo}
                              placeholder={language === 'af' ? 'bv. Koop 2 en kry 10% afslag op jou hele bestelling!' : 'e.g. Buy 2 and get 10% off your entire order!'}
                              value={editProdPromoTextAf}
                              onChange={(e) => setEditProdPromoTextAf(e.target.value)}
                              className="w-full bg-white border border-amber-200 rounded p-2 text-xs focus:outline-none focus:border-[#8B4513]"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] uppercase tracking-wider text-amber-800 font-bold block mb-1">
                              {language === 'af' ? 'Promosie Beskrywing (Engels)' : 'Promotion Description (English)'} *
                            </label>
                            <input
                              type="text"
                              required={editProdIsPromo}
                              placeholder={language === 'af' ? 'bv. Buy 2 and get 10% off your entire order!' : 'e.g. Buy 2 and get 10% off your entire order!'}
                              value={editProdPromoTextEn}
                              onChange={(e) => setEditProdPromoTextEn(e.target.value)}
                              className="w-full bg-white border border-amber-200 rounded p-2 text-xs focus:outline-none focus:border-[#8B4513]"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Display Location */}
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                        {language === 'af' ? 'Waar moet hierdie produk vertoon word?' : 'Where should this product be displayed?'}
                      </label>
                      <select
                        value={editProdDisplayLocation}
                        onChange={(e) => setEditProdDisplayLocation(e.target.value as any)}
                        className="w-full bg-white border border-[#E0DBCF] rounded p-2.5 text-xs focus:outline-none focus:border-[#8B4513]"
                      >
                        <option value="shop_only">{language === 'af' ? 'Net in Winkel / Katalogus' : 'Only in Shop / Catalog'}</option>
                        <option value="home_featured">{language === 'af' ? 'Gewildste Kampioene (Tuisblad Hoogtepunt)' : 'Featured Favorites (Homepage Highlight)'}</option>
                        <option value="categories">{language === 'af' ? 'Gewone Kategorieë Slegs' : 'Normal Categories Only'}</option>
                      </select>
                      <p className="text-[9px] text-gray-400">
                        {language === 'af' 
                          ? 'Kies "Gewildste Kampioene" om hierdie produk prominent bo-aan die tuisblad te plaas.' 
                          : 'Select "Featured Favorites" to place this product prominently at the top of the homepage.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Placeholders Gallery Box for Editing */}
                <div className="border border-[#E0DBCF] rounded p-4 bg-white space-y-4">
                  <div className="border-b border-[#E0DBCF]/60 pb-2">
                    <h5 className="text-[10px] uppercase tracking-wider font-black text-[#8B4513]">
                      {language === 'af' ? 'PRODUK GALERY BEELDE (MAKS 5 SUBS)' : 'PRODUCT GALLERY IMAGES (MAX 5 SUBS)'}
                    </h5>
                    <p className="text-[9px] text-gray-500">
                      {language === 'af' ? 'Laai tot 5 addisionele beelde of placeholders op wat kliënte in die produkblad kan sien.' : 'Upload up to 5 additional images or placeholders that customers can see on the product page.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {editProdGallery.map((imgUrl, idx) => (
                      <div key={idx} className="border border-[#E0DBCF] rounded p-3 bg-[#F5F2ED]/10 flex flex-col space-y-2 relative">
                        <div className="flex items-center justify-between border-b border-[#E0DBCF]/40 pb-1.5">
                          <span className="text-[9px] font-black uppercase text-[#8B4513]">
                            {language === 'af' ? `Beeld #${idx + 1}` : `Image #${idx + 1}`}
                          </span>
                          {imgUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditProdGallery(prev => {
                                  const copy = [...prev];
                                  copy[idx] = '';
                                  return copy;
                                });
                              }}
                              className="text-[9px] font-bold text-red-600 hover:underline cursor-pointer"
                            >
                              {language === 'af' ? 'Verwyder' : 'Remove'}
                            </button>
                          )}
                        </div>

                        {/* Thumbnail or Empty State */}
                        <div className="aspect-square bg-white border border-[#E0DBCF] rounded overflow-hidden flex items-center justify-center relative">
                          {imgUrl ? (
                            <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="flex flex-col items-center text-center p-2">
                              <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">
                                {language === 'af' ? 'Leeg' : 'Empty'}
                              </span>
                            </div>
                          )}
                          {galleryUploadingIdx === idx && (
                            <div className="absolute inset-0 bg-white/85 flex items-center justify-center">
                              <RefreshCw className="animate-spin text-[#8B4513]" size={16} />
                            </div>
                          )}
                        </div>

                        {/* Preset Select or File Upload */}
                        <div className="space-y-1">
                          <select
                            value={imgUrl}
                            onChange={(e) => {
                              setEditProdGallery(prev => {
                                const copy = [...prev];
                                copy[idx] = e.target.value;
                                return copy;
                              });
                            }}
                            className="w-full bg-white border border-[#E0DBCF]/80 rounded p-1 text-[9px] focus:outline-none"
                          >
                            <option value="">-- {language === 'af' ? 'Voorinstelling' : 'Preset'} --</option>
                            <option value="/src/assets/images/volksgrond_heritage_bg_1783548402167.jpg">Heritage Dark Background</option>
                            <option value="/src/assets/images/volksgrond_story_collage_1783553284607.jpg">Story Collage Style</option>
                            <option value="/src/assets/images/volksgrond_story_farmers_collage_1783553446942.jpg">South African Farming/Earthy</option>
                            <option value="/src/assets/images/erfenis_black_tshirt_1783544659803.jpg">Heritage Black T-Shirt</option>
                            <option value="/src/assets/images/boerekrygers_white_tshirt_1783544674183.jpg">Boerekrygers White T-Shirt</option>
                            <option value="/src/assets/images/boerekrygers_sand_cap_1783544687518.jpg">Boerekrygers Sand Cap</option>
                            <option value="/src/assets/images/bloedsweet_tshirt_1783554692468.jpg">Bloedsweet Swart T-hemp</option>
                            <option value="/src/assets/images/blommekrans_tshirt_1783554730461.jpg">Blommekrans Wit T-hemp</option>
                            <option value="/src/assets/images/borselkruis_wit_tshirt_1783554666881.jpg">Borselkruis Wit T-hemp</option>
                            <option value="/src/assets/images/eukalipte_tshirt_1783554716730.jpg">Eukalipte Groen T-hemp</option>
                            <option value="/src/assets/images/goue_kruis_tshirt_1783554648467.jpg">Goue Kruis Swart T-hemp</option>
                            <option value="/src/assets/images/juweelkruis_tshirt_1783554744793.jpg">Juweelkruis Wit T-hemp</option>
                            <option value="/src/assets/images/koringaar_tshirt_1783554680276.jpg">Koringaar Swart T-hemp</option>
                            <option value="/src/assets/images/libel_tshirt_1783554704633.jpg">Libel Groen T-hemp</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => document.getElementById(`gallery-upload-edit-${idx}`)?.click()}
                            className="w-full py-1 border border-[#8B4513]/40 rounded hover:bg-[#8B4513]/5 text-[#8B4513] text-[9px] font-black uppercase tracking-wider cursor-pointer font-sans"
                          >
                            {language === 'af' ? 'Laai Lêer op' : 'Upload File'}
                          </button>
                          <input
                            id={`gallery-upload-edit-${idx}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleGalleryUpload(e.target.files[0], idx, true);
                              }
                            }}
                            className="hidden"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name AF */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Produknaam (Afrikaans)' : 'Product Name (Afrikaans)'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={editProdNameAf}
                      onChange={(e) => setEditProdNameAf(e.target.value)}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513]"
                    />
                  </div>

                  {/* Name EN */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Produknaam (Engels)' : 'Product Name (English)'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={editProdNameEn}
                      onChange={(e) => setEditProdNameEn(e.target.value)}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Description AF */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Beskrywing (Afrikaans)' : 'Description (Afrikaans)'}
                    </label>
                    <textarea
                      rows={3}
                      value={editProdDescAf}
                      onChange={(e) => setEditProdDescAf(e.target.value)}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513]"
                    />
                  </div>

                  {/* Description EN */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Beskrywing (Engels)' : 'Description (English)'}
                    </label>
                    <textarea
                      rows={3}
                      value={editProdDescEn}
                      onChange={(e) => setEditProdDescEn(e.target.value)}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Features AF */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Kenmerke (Een per reël)' : 'Features (One per line)'}
                    </label>
                    <textarea
                      rows={3}
                      value={editProdFeaturesAf}
                      onChange={(e) => setEditProdFeaturesAf(e.target.value)}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513] font-mono text-[11px]"
                    />
                  </div>

                  {/* Features EN */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Kenmerke Engels (Een per reël)' : 'Features English (One per line)'}
                    </label>
                    <textarea
                      rows={3}
                      value={editProdFeaturesEn}
                      onChange={(e) => setEditProdFeaturesEn(e.target.value)}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513] font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Material AF */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Materiale (Afrikaans)' : 'Materials (Afrikaans)'}
                    </label>
                    <input
                      type="text"
                      value={editProdMaterialsAf}
                      onChange={(e) => setEditProdMaterialsAf(e.target.value)}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513]"
                    />
                  </div>

                  {/* Material EN */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Materiale (Engels)' : 'Materials (English)'}
                    </label>
                    <input
                      type="text"
                      value={editProdMaterialsEn}
                      onChange={(e) => setEditProdMaterialsEn(e.target.value)}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Care AF */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Sorg-Instruksies (Afrikaans)' : 'Care Instructions (Afrikaans)'}
                    </label>
                    <input
                      type="text"
                      value={editProdCareAf}
                      onChange={(e) => setEditProdCareAf(e.target.value)}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513]"
                    />
                  </div>

                  {/* Care EN */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                      {language === 'af' ? 'Sorg-Instruksies (Engels)' : 'Care Instructions (English)'}
                    </label>
                    <input
                      type="text"
                      value={editProdCareEn}
                      onChange={(e) => setEditProdCareEn(e.target.value)}
                      className="w-full bg-white border border-[#E0DBCF] rounded p-2 text-xs focus:outline-none focus:border-[#8B4513]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingProductId(null)}
                    className="border border-[#E0DBCF] hover:bg-gray-50 text-gray-600 px-5 py-2.5 rounded text-[10px] uppercase tracking-wider font-black cursor-pointer transition-all"
                  >
                    {language === 'af' ? 'Kanselleer' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="bg-[#8B4513] hover:bg-[#72380F] text-white px-6 py-2.5 rounded text-[10px] uppercase tracking-wider font-black cursor-pointer transition-all shadow-md"
                  >
                    {language === 'af' ? 'Stoor Wysigings' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F5F2ED]/50 text-gray-500 border-b border-[#E0DBCF] uppercase font-black tracking-wider text-[9px]">
                  <th className="p-4">Thumbnail</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">{language === 'af' ? 'Kosprys' : 'Cost Price'}</th>
                  <th className="p-4">Update Price</th>
                  <th className="p-4">Current Stock</th>
                  <th className="p-4">Update Stock</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0DBCF]/70">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <img src={prod.images[0]} alt={prod.name.af} className="w-10 h-10 object-cover rounded border border-[#E0DBCF]" />
                    </td>
                    <td className="p-4 font-bold">{prod.name.af} <span className="text-[9px] text-gray-400 font-mono block">{prod.id}</span></td>
                    <td className="p-4 uppercase tracking-wider text-[9px] font-black text-gray-400">{prod.category}</td>
                    
                    {/* PRICE CELL */}
                    <td className="p-4 font-mono font-bold text-[#1A1A1A]">R{prod.price.toFixed(2)}</td>
                    <td className="p-4 font-mono text-gray-500">R{(prod.costPrice ?? 110.00).toFixed(2)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder={language === 'af' ? 'Prys' : 'Price'}
                          value={priceInputs[prod.id] ?? ''}
                          onChange={(e) => setPriceInputs(prev => ({ ...prev, [prod.id]: Number(e.target.value) }))}
                          className="bg-[#F5F2ED] border border-[#E0DBCF] rounded p-1.5 text-xs w-24 focus:outline-none font-mono"
                        />
                        <button
                          onClick={() => handlePriceUpdate(prod.id)}
                          className="bg-[#8B4513] hover:bg-[#72380F] text-white text-[9px] font-bold uppercase tracking-wider py-1.5 px-2.5 rounded cursor-pointer whitespace-nowrap"
                        >
                          {language === 'af' ? 'Stoor' : 'Save'}
                        </button>
                      </div>
                    </td>

                    {/* STOCK CELL */}
                    <td className="p-4 font-bold font-mono">
                      <span className={prod.stockCount <= 5 ? 'text-red-600' : 'text-[#1A1A1A]'}>
                        {prod.stockCount} {language === 'af' ? 'eenhede' : 'units'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          placeholder={language === 'af' ? 'Telling' : 'Count'}
                          value={stockInputs[prod.id] ?? ''}
                          onChange={(e) => setStockInputs(prev => ({ ...prev, [prod.id]: Number(e.target.value) }))}
                          className="bg-[#F5F2ED] border border-[#E0DBCF] rounded p-1.5 text-xs w-24 focus:outline-none font-mono"
                        />
                        <button
                          onClick={() => handleStockUpdate(prod.id)}
                          className="bg-[#1A1A1A] hover:bg-[#333] text-white text-[9px] font-bold uppercase tracking-wider py-1.5 px-2.5 rounded cursor-pointer whitespace-nowrap"
                        >
                          {language === 'af' ? 'Stoor' : 'Save'}
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => startEditingProduct(prod)}
                          className="p-1.5 text-[#8B4513] hover:text-[#72380F] hover:bg-[#8B4513]/10 rounded transition-all cursor-pointer flex items-center justify-center"
                          title={language === 'af' ? 'Wysig produk' : 'Edit product'}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name.af, prod.name.en)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-all cursor-pointer flex items-center justify-center"
                          title={language === 'af' ? 'Verwyder produk' : 'Delete product'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REVIEWS APPROVAL TAB */}
      {activeTab === 'reviews' && (
        <div className="bg-white border border-[#E0DBCF] rounded shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E0DBCF] bg-[#F5F2ED]">
            <h3 className="text-xs uppercase tracking-wider font-black text-[#1A1A1A]">
              Kliënte Resensie-Moderering ({reviews.length})
            </h3>
          </div>

          {reviews.length === 0 ? (
            <div className="p-16 text-center text-xs text-gray-400 italic">
              Geen resensies gevind nie.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F5F2ED]/50 text-gray-500 border-b border-[#E0DBCF] uppercase font-black tracking-wider text-[9px]">
                    <th className="p-4">Product</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Review comment</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0DBCF]/70">
                  {reviews.map((rev) => (
                    <tr key={rev.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold">{rev.productTitle}</td>
                      <td className="p-4">{rev.name} <span className="text-[9px] text-gray-400 font-mono block">{rev.date}</span></td>
                      <td className="p-4 text-gray-500 italic max-w-sm truncate">"{rev.comment}"</td>
                      <td className="p-4 text-[#C5A059] font-mono font-bold">{'★'.repeat(rev.rating)}</td>
                      <td className="p-4">
                        <span className={`inline-block text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                          rev.approved ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {rev.approved ? 'Goedgekeur' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {!rev.approved && (
                            <button
                              onClick={() => approveReview(rev.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold uppercase tracking-wider py-1 px-2 rounded cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => deleteReview(rev.id)}
                            className="bg-red-600 hover:bg-red-700 text-white text-[9px] font-bold uppercase tracking-wider py-1 px-2 rounded cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* COUPONS TAB */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create Coupon form */}
          <div className="bg-white border border-[#E0DBCF] rounded p-6 shadow-sm h-fit space-y-4">
            <h3 className="text-xs uppercase tracking-wider font-black text-[#1A1A1A] border-b border-[#E0DBCF]/70 pb-3">
              Skep Nuwe Koeponkode
            </h3>

            {couponSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] p-4 rounded font-bold">
                Koeponkode suksesvol geskep en geaktiveer!
              </div>
            )}

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="text-[9px] uppercase font-black tracking-widest text-gray-400 mb-1.5 block">
                  Koepon Kode (Bv. ERFENIS25)
                </label>
                <input
                  type="text"
                  required
                  placeholder="ERFENIS25"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#F5F2ED]/60 border border-[#E0DBCF] rounded p-2.5 text-xs focus:outline-none focus:border-[#8B4513]"
                />
              </div>

              <div>
                <label className="text-[9px] uppercase font-black tracking-widest text-gray-400 mb-1.5 block">
                  Persentasie Afslag (%)
                </label>
                <input
                  type="number"
                  required
                  min="5"
                  max="90"
                  value={newPercent}
                  onChange={(e) => setNewPercent(Number(e.target.value))}
                  className="w-full bg-[#F5F2ED]/60 border border-[#E0DBCF] rounded p-2.5 text-xs focus:outline-none focus:border-[#8B4513]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1A1A1A] hover:bg-[#333] text-white py-3 uppercase text-[9px] font-black tracking-widest rounded transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Plus size={12} />
                <span>Skep Koepon</span>
              </button>
            </form>
          </div>

          {/* Existing Coupons table */}
          <div className="lg:col-span-2 bg-white border border-[#E0DBCF] rounded shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E0DBCF] bg-[#F5F2ED]">
              <h3 className="text-xs uppercase tracking-wider font-black text-[#1A1A1A]">
                Aktiewe Promosiekodes ({discountCodes.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F5F2ED]/50 text-gray-500 border-b border-[#E0DBCF] uppercase font-black tracking-wider text-[9px]">
                    <th className="p-4">Promo Code</th>
                    <th className="p-4">Discount Percent</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0DBCF]/70 font-mono">
                  {discountCodes.map((d) => {
                    const isEditing = editingCouponCode === d.code;
                    return (
                      <tr key={d.code} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-bold text-[#8B4513]">{d.code}</td>
                        <td className="p-4 font-bold">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min="5"
                                max="90"
                                value={editCouponPercent}
                                onChange={(e) => setEditCouponPercent(Number(e.target.value))}
                                className="w-16 bg-white border border-[#E0DBCF] rounded px-1.5 py-0.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#8B4513] font-mono text-center font-bold"
                              />
                              <span className="text-gray-400 font-bold">%</span>
                            </div>
                          ) : (
                            `${d.percent}% off`
                          )}
                        </td>
                        <td className="p-4">
                          {isEditing ? (
                            <span className="inline-block text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                              {language === 'af' ? 'Wysig' : 'Editing'}
                            </span>
                          ) : (
                            <span className="inline-block text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateCoupon(d.code)}
                                  className="p-1 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded transition-all cursor-pointer flex items-center justify-center"
                                  title={language === 'af' ? 'Stoor' : 'Save'}
                                >
                                  <Check size={15} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingCouponCode(null)}
                                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all cursor-pointer flex items-center justify-center text-[10px] font-bold"
                                  title={language === 'af' ? 'Kanselleer' : 'Cancel'}
                                >
                                  [X]
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => startEditingCoupon(d.code, d.percent)}
                                  className="p-1 text-[#8B4513] hover:text-[#72380F] hover:bg-[#8B4513]/10 rounded transition-all cursor-pointer flex items-center justify-center"
                                  title={language === 'af' ? 'Wysig promosiekode' : 'Edit promo code'}
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCoupon(d.code)}
                                  className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-all cursor-pointer flex items-center justify-center"
                                  title={language === 'af' ? 'Verwyder promosiekode' : 'Delete promo code'}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="space-y-8 max-w-2xl">
          {/* Card Frame */}
          <div className="bg-white border border-[#E0DBCF] rounded p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A] mb-4 flex items-center gap-2">
              <Settings size={20} className="text-[#8B4513]" />
              <span>{language === 'af' ? 'Wagwoord en Sekuriteit' : 'Password and Security'}</span>
            </h2>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              {language === 'af' 
                ? 'Pas jou sekuriteit-instellings aan vir die Handelaarsportaal. As die wagwoord geaktiveer is, moet gebruikers die korrekte wagwoord invoer om die administrasie-koppelvlak te betree.'
                : 'Modify your access control preferences for the Merchant Portal. When enabled, users must supply the configured password to enter the administration workspace.'}
            </p>

            <form onSubmit={handleUpdateSettings} className="space-y-6">
              {/* Checkbox to enable/disable password lock */}
              <div className="flex items-start gap-3 p-4 bg-[#F5F2ED]/60 rounded border border-[#E0DBCF]/60">
                <input
                  type="checkbox"
                  id="enable-lock-checkbox"
                  checked={isLockEnabled}
                  onChange={(e) => setIsLockEnabled(e.target.checked)}
                  className="mt-1 accent-[#8B4513] cursor-pointer"
                />
                <div className="space-y-1">
                  <label htmlFor="enable-lock-checkbox" className="text-xs font-black uppercase tracking-wider text-[#1A1A1A] cursor-pointer">
                    {language === 'af' ? 'Aktiveer Wagwoordbeskerming' : 'Enable Password Protection'}
                  </label>
                  <p className="text-[11px] text-gray-400 leading-normal">
                    {language === 'af'
                      ? 'Vereis administratiewe magtiging om hierdie portaal te bekyk.'
                      : 'Force password authorization before revealing this panel.'}
                  </p>
                </div>
              </div>

              {/* Password change input */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black block">
                  {language === 'af' ? 'Nuwe Bestuurswagwoord' : 'New Merchant Password'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'af' ? "Verstek is 'Volksgrond2026'" : "Default is 'Volksgrond2026'"}
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full bg-[#F5F2ED]/30 border border-[#E0DBCF] rounded p-3 text-xs focus:outline-none focus:border-[#8B4513] font-mono"
                />
                <p className="text-[10px] text-gray-400">
                  {language === 'af' 
                    ? `Huidige aktiewe wagwoord op bediener: "${adminPassword}"`
                    : `Currently active server-side password: "${adminPassword}"`}
                </p>
              </div>

              {settingsMessage && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] p-3 rounded flex items-center gap-2 font-bold">
                  <Check size={14} className="text-emerald-600 flex-shrink-0" />
                  <span>{settingsMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="bg-[#1A1A1A] hover:bg-black text-white text-[10px] uppercase tracking-widest font-black px-6 py-3.5 rounded shadow transition-all cursor-pointer"
              >
                {language === 'af' ? 'Stoor Sekuriteit-instellings' : 'Save Security Settings'}
              </button>
            </form>
          </div>

          {/* PayFast Integration Settings */}
          <div className="bg-white border border-[#E0DBCF] rounded p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A] mb-4 flex items-center gap-2">
              <Key size={20} className="text-[#8B4513]" />
              <span>{language === 'af' ? 'PayFast Betalingspoort' : 'PayFast Payment Gateway'}</span>
            </h2>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              {language === 'af' 
                ? 'Konfigureer jou PayFast-integreersleutels. Vir toetsing kan jy jou eie unieke sandbox-ID en handelaarsleutel invoer wat jy van sandbox.payfast.co.za kry, of jou lewendige produksiesleutels invoer om regte betalings te begin aanvaar.'
                : 'Configure your PayFast integration keys. For testing, you can input your unique sandbox ID and key obtained from sandbox.payfast.co.za, or supply your live production keys to start accepting real payments.'}
            </p>

            <form onSubmit={handleUpdateSettings} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Merchant ID */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black block">
                    {language === 'af' ? 'Handelaar ID (Merchant ID)' : 'Merchant ID'}
                  </label>
                  <input
                    type="text"
                    required
                    value={merchantIdInput}
                    onChange={(e) => setMerchantIdInput(e.target.value)}
                    className="w-full bg-[#F5F2ED]/30 border border-[#E0DBCF] rounded p-3 text-xs focus:outline-none focus:border-[#8B4513] font-mono"
                    placeholder="Bv. 10000100"
                  />
                </div>

                {/* Merchant Key */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black block">
                    {language === 'af' ? 'Handelaar Sleutel (Merchant Key)' : 'Merchant Key'}
                  </label>
                  <div className="relative">
                    <input
                      type={showMerchantKey ? 'text' : 'password'}
                      required
                      value={merchantKeyInput}
                      onChange={(e) => setMerchantKeyInput(e.target.value)}
                      className="w-full bg-[#F5F2ED]/30 border border-[#E0DBCF] rounded p-3 pr-10 text-xs focus:outline-none focus:border-[#8B4513] font-mono"
                      placeholder="Bv. 46f0z436ip75r"
                    />
                    <button
                      type="button"
                      onClick={() => setShowMerchantKey(!showMerchantKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showMerchantKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {settingsMessage && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] p-3 rounded flex items-center gap-2 font-bold animate-fade-in">
                  <Check size={14} className="text-emerald-600 flex-shrink-0" />
                  <span>{settingsMessage}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <button
                  type="submit"
                  className="bg-[#1A1A1A] hover:bg-black text-white text-[10px] uppercase tracking-widest font-black px-6 py-3.5 rounded shadow transition-all cursor-pointer"
                >
                  {language === 'af' ? 'Stoor PayFast Instellings' : 'Save PayFast Settings'}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setMerchantIdInput('10000100');
                    setMerchantKeyInput('46f0z436ip75r');
                  }}
                  className="text-[10px] text-gray-500 hover:text-black uppercase tracking-wider font-bold transition-all cursor-pointer"
                >
                  {language === 'af' ? 'Herstel na Verstek' : 'Reset to Default Sandbox'}
                </button>
              </div>
            </form>
          </div>

          {/* Announcement Settings */}
          <div className="bg-white border border-[#E0DBCF] rounded p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A] mb-4 flex items-center gap-2">
              <Megaphone size={20} className="text-[#8B4513]" />
              <span>{language === 'af' ? 'Kliënte-aankondiging (Pop-up)' : 'Customer Announcement (Pop-up)'}</span>
            </h2>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              {language === 'af' 
                ? 'Stel \'n aankondiging op wat as \'n elegante klein pop-up aan kliënte gewys sal word wanneer hulle die tuisblad besoek. Jy kan dit aktiveer, deaktiveer of die teks wysig.'
                : 'Set up an announcement that will be shown as an elegant small pop-up to customers when they visit the home page. You can activate, deactivate, or edit the text.'}
            </p>

            <form onSubmit={handleUpdateAnnouncement} className="space-y-6">
              {/* Active Toggle Switch */}
              <div className="flex items-center gap-3 bg-[#F5F2ED]/30 border border-[#E0DBCF] p-4 rounded">
                <input
                  type="checkbox"
                  id="announcementEnabledVal"
                  checked={announcementEnabledVal}
                  onChange={(e) => setAnnouncementEnabledVal(e.target.checked)}
                  className="w-4 h-4 text-[#8B4513] border-gray-300 rounded focus:ring-[#8B4513] cursor-pointer"
                />
                <label htmlFor="announcementEnabledVal" className="text-xs font-black uppercase tracking-wider text-gray-700 cursor-pointer select-none">
                  {language === 'af' ? 'Aktiveer pop-up aankondigingskassie op tuisblad' : 'Activate pop-up announcement box on home screen'}
                </label>
              </div>

              {/* Message Textbox */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black block">
                  {language === 'af' ? 'Aankondigingsteks (Afrikaans of Engels)' : 'Announcement Text'}
                </label>
                <textarea
                  required
                  rows={3}
                  maxLength={300}
                  value={announcementTextVal}
                  onChange={(e) => setAnnouncementTextVal(e.target.value)}
                  className="w-full bg-[#F5F2ED]/30 border border-[#E0DBCF] rounded p-3 text-xs focus:outline-none focus:border-[#8B4513] font-sans font-medium text-gray-800 leading-relaxed"
                  placeholder={language === 'af' ? 'Skryf jou boodskap hier...' : 'Write your message here...'}
                />
                <span className="text-[10px] text-gray-400 block text-right font-mono">
                  {announcementTextVal.length}/300 {language === 'af' ? 'karakters' : 'characters'}
                </span>
              </div>

              {announcementMessage && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] p-3 rounded flex items-center gap-2 font-bold animate-fade-in">
                  <Check size={14} className="text-emerald-600 flex-shrink-0" />
                  <span>{announcementMessage}</span>
                </div>
              )}

              <div className="flex justify-start">
                <button
                  type="submit"
                  className="bg-[#1A1A1A] hover:bg-[#8B4513] text-white text-[10px] uppercase tracking-widest font-black px-6 py-3.5 rounded shadow transition-all cursor-pointer border border-[#1A1A1A] hover:border-[#8B4513]"
                >
                  {language === 'af' ? 'Stoor Aankondiging' : 'Save Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GALLERY & USEFUL LINKS TAB */}
      {activeTab === 'gallery' && (
        <div className="space-y-10 animate-fade-in">
          {/* Section 1: Customize Homepage Gallery Gateway Box */}
          <div className="bg-white border border-[#E0DBCF] rounded p-6 md:p-8 shadow-sm max-w-2xl">
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A] mb-4 flex items-center gap-2">
              <Megaphone size={20} className="text-[#8B4513]" />
              <span>{language === 'af' ? 'Tuisblad Galery-Knoppie Bestuur' : 'Home Screen Gallery Gateway'}</span>
            </h2>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              {language === 'af' 
                ? 'Bestuur die sigbaarheid en bewoording van die spesiale aankondigingskassie / galery-knoppie wat direk onder "Ontdek Winkel" op die tuisblad verskyn.'
                : 'Manage the visibility and text of the special announcement box / gallery button that appears directly below "Explore Shop" on the home screen.'}
            </p>

            <form onSubmit={handleUpdateGalleryGateway} className="space-y-6">
              {/* Active Toggle Switch */}
              <div className="flex items-center gap-3 bg-[#F5F2ED]/30 border border-[#E0DBCF] p-4 rounded">
                <input
                  type="checkbox"
                  id="isHomeGalleryBtnEnabledVal"
                  checked={isHomeGalleryBtnEnabledVal}
                  onChange={(e) => setIsHomeGalleryBtnEnabledVal(e.target.checked)}
                  className="w-4 h-4 text-[#8B4513] border-gray-300 rounded focus:ring-[#8B4513] cursor-pointer"
                />
                <label htmlFor="isHomeGalleryBtnEnabledVal" className="text-xs font-black uppercase tracking-wider text-gray-700 cursor-pointer select-none">
                  {language === 'af' ? 'Wys galery-aankondiging op tuisblad' : 'Show gallery announcement gateway on home screen'}
                </label>
              </div>

              {/* Text Input (Afrikaans) */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black block">
                  {language === 'af' ? 'Aankondigingsteks (Afrikaans)' : 'Announcement Text (Afrikaans)'}
                </label>
                <input
                  type="text"
                  required
                  value={homeGalleryBtnTextAfVal}
                  onChange={(e) => setHomeGalleryBtnTextAfVal(e.target.value)}
                  className="w-full bg-[#F5F2ED]/30 border border-[#E0DBCF] rounded p-3 text-xs focus:outline-none focus:border-[#8B4513] font-sans font-medium text-gray-800"
                  placeholder="Bv: Verken Ons Erfenis Galery & Skakels"
                />
              </div>

              {/* Text Input (English) */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black block">
                  {language === 'af' ? 'Aankondigingsteks (Engels)' : 'Announcement Text (English)'}
                </label>
                <input
                  type="text"
                  required
                  value={homeGalleryBtnTextEnVal}
                  onChange={(e) => setHomeGalleryBtnTextEnVal(e.target.value)}
                  className="w-full bg-[#F5F2ED]/30 border border-[#E0DBCF] rounded p-3 text-xs focus:outline-none focus:border-[#8B4513] font-sans font-medium text-gray-800"
                  placeholder="e.g. Explore Our Heritage Gallery & Links"
                />
              </div>

              {galleryMessage && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] p-3 rounded flex items-center gap-2 font-bold animate-fade-in">
                  <Check size={14} className="text-emerald-600 flex-shrink-0" />
                  <span>{galleryMessage}</span>
                </div>
              )}

              <div className="flex justify-start">
                <button
                  type="submit"
                  className="bg-[#1A1A1A] hover:bg-[#8B4513] text-white text-[10px] uppercase tracking-widest font-black px-6 py-3.5 rounded shadow transition-all cursor-pointer border border-[#1A1A1A] hover:border-[#8B4513]"
                >
                  {language === 'af' ? 'Stoor Tuisblad Knoppie' : 'Save Home Button Settings'}
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Add New Occasion Link */}
          <div className="bg-white border border-[#E0DBCF] rounded p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A] mb-4 flex items-center gap-2">
              <Plus size={20} className="text-[#8B4513]" />
              <span>{language === 'af' ? 'Voeg Nuwe Geleentheid of Skakel By' : 'Add New Occasion or Useful Link'}</span>
            </h2>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              {language === 'af' 
                ? 'Laai nuwe foto\'s en skakels op na spesiale geleenthede soos veilings, feeste, of kunsversamelings.'
                : 'Upload new photos and links to special occasions like auctions, festivals, or art collections.'}
            </p>

            <form onSubmit={handleAddGalleryItem} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column Fields */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black block">
                    {language === 'af' ? 'Titel van Geleentheid (Afrikaans) *' : 'Event Title (Afrikaans) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newGalleryTitleAf}
                    onChange={(e) => setNewGalleryTitleAf(e.target.value)}
                    className="w-full bg-[#F5F2ED]/30 border border-[#E0DBCF] rounded p-3 text-xs focus:outline-none focus:border-[#8B4513] font-sans font-medium text-gray-800"
                    placeholder="Bv: Boere Fees Viering"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black block">
                    {language === 'af' ? 'Titel van Geleentheid (Engels) *' : 'Event Title (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newGalleryTitleEn}
                    onChange={(e) => setNewGalleryTitleEn(e.target.value)}
                    className="w-full bg-[#F5F2ED]/30 border border-[#E0DBCF] rounded p-3 text-xs focus:outline-none focus:border-[#8B4513] font-sans font-medium text-gray-800"
                    placeholder="e.g. Farmer's Festival Celebration"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black block">
                    {language === 'af' ? 'Geleentheid Tag / Subtitel (Afrikaans)' : 'Occasion Tag / Subtitle (Afrikaans)'}
                  </label>
                  <input
                    type="text"
                    value={newGalleryOccasionAf}
                    onChange={(e) => setNewGalleryOccasionAf(e.target.value)}
                    className="w-full bg-[#F5F2ED]/30 border border-[#E0DBCF] rounded p-3 text-xs focus:outline-none focus:border-[#8B4513] font-sans font-medium text-gray-800"
                    placeholder="Bv: Plaaslewe"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black block">
                    {language === 'af' ? 'Geleentheid Tag / Subtitel (Engels)' : 'Occasion Tag / Subtitle (English)'}
                  </label>
                  <input
                    type="text"
                    value={newGalleryOccasionEn}
                    onChange={(e) => setNewGalleryOccasionEn(e.target.value)}
                    className="w-full bg-[#F5F2ED]/30 border border-[#E0DBCF] rounded p-3 text-xs focus:outline-none focus:border-[#8B4513] font-sans font-medium text-gray-800"
                    placeholder="e.g. Farm Life"
                  />
                </div>
              </div>

              {/* Right Column Fields */}
              <div className="space-y-4">
                {/* Destination URL Field - fully editable text input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black block">
                      {language === 'af' ? 'Bestemming Skakel / URL *' : 'Link Destination / URL *'}
                    </label>
                    <span className="text-[9px] text-gray-400 font-bold uppercase">
                      {language === 'af' ? 'Enige skakel is toelaatbaar (veiling, liedjie, ens.)' : 'Any URL is acceptable (auction, song, etc.)'}
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={newGalleryLinkUrl}
                    onChange={(e) => setNewGalleryLinkUrl(e.target.value)}
                    className="w-full bg-[#F5F2ED]/30 border border-[#E0DBCF] rounded p-3 text-xs focus:outline-none focus:border-[#8B4513] font-sans font-medium text-gray-800"
                    placeholder="e.g. https://my-auction-page.co.za or shop"
                  />
                  
                  {/* Quick Preset Buttons for Destination */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-[8px] uppercase tracking-wider text-gray-400 font-black self-center">
                      {language === 'af' ? 'Snel-keuses:' : 'Quick options:'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setNewGalleryLinkUrl('shop')}
                      className={`text-[8px] uppercase tracking-wider px-2 py-1 rounded font-black border transition-all ${newGalleryLinkUrl === 'shop' ? 'bg-[#8B4513] text-white border-[#8B4513]' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-600'}`}
                    >
                      {language === 'af' ? 'Winkel' : 'Shop'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewGalleryLinkUrl('about')}
                      className={`text-[8px] uppercase tracking-wider px-2 py-1 rounded font-black border transition-all ${newGalleryLinkUrl === 'about' ? 'bg-[#8B4513] text-white border-[#8B4513]' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-600'}`}
                    >
                      {language === 'af' ? 'Ons Storie' : 'About'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewGalleryLinkUrl('contact')}
                      className={`text-[8px] uppercase tracking-wider px-2 py-1 rounded font-black border transition-all ${newGalleryLinkUrl === 'contact' ? 'bg-[#8B4513] text-white border-[#8B4513]' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-600'}`}
                    >
                      {language === 'af' ? 'Kontak' : 'Contact'}
                    </button>
                  </div>
                </div>

                {/* Editable Foto URL with helper presets dropdown */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black block">
                      {language === 'af' ? 'Foto URL *' : 'Image URL *'}
                    </label>
                    <span className="text-[9px] text-gray-400 font-bold uppercase">
                      {language === 'af' ? 'Enige prent skakel of gelaaide foto' : 'Any picture link or uploaded photo'}
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={newGalleryImageUrl}
                    onChange={(e) => setNewGalleryImageUrl(e.target.value)}
                    className="w-full bg-[#F5F2ED]/30 border border-[#E0DBCF] rounded p-3 text-xs focus:outline-none focus:border-[#8B4513] font-sans font-medium text-gray-800"
                    placeholder="e.g. /src/assets/images/... or https://..."
                  />

                  {/* Dropdown helper to quickly load a preset into the text input */}
                  <div className="pt-1">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          setNewGalleryImageUrl(e.target.value);
                        }
                      }}
                      className="w-full bg-white border border-[#E0DBCF] rounded px-3 py-1.5 text-[10px] focus:outline-none focus:border-[#8B4513] font-sans font-black text-gray-600 uppercase tracking-wider animate-none"
                    >
                      <option value="">-- {language === 'af' ? 'KIES PRAGTIGE BRAND FOTO (PRESET)' : 'CHOOSE BRAND PHOTO PRESET'} --</option>
                      <option value="/src/assets/images/volksgrond_heritage_bg_1783548402167.jpg">{language === 'af' ? 'Erfenis Agtergrond (Groot)' : 'Heritage Day Background'}</option>
                      <option value="/src/assets/images/volksgrond_story_farmers_collage_1783553446942.jpg">{language === 'af' ? 'Boere Collage (Masjien & Grond)' : 'Farmers Collage'}</option>
                      <option value="/src/assets/images/volksgrond_story_collage_1783553284607.jpg">{language === 'af' ? 'Volksgrond Storie Collage (Kwaliteit)' : 'Story Collage'}</option>
                      <option value="/src/assets/images/sintagmaties_horse_1783982885579.jpg">{language === 'af' ? 'Sintagmaties Perd (Premium)' : 'Syntagmatic Horse'}</option>
                    </select>
                  </div>
                </div>

                {/* File Upload Box */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black block">
                    {language === 'af' ? 'Alternatiewelik: Laai pasgemaakte foto op' : 'Alternatively: Upload custom photo'}
                  </label>
                  <div className="border border-dashed border-[#E0DBCF] rounded p-4 text-center hover:border-[#8B4513] transition-all bg-[#F5F2ED]/10">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const dataUrl = await compressAndResizeImage(file);
                            setNewGalleryImageUrl(dataUrl);
                          } catch (err) {
                            console.error('Failed to process custom image', err);
                          }
                        }
                      }}
                      className="hidden"
                      id="custom-gallery-upload-input"
                    />
                    <label htmlFor="custom-gallery-upload-input" className="cursor-pointer block space-y-1">
                      <Upload size={18} className="text-gray-400 mx-auto" />
                      <span className="text-[9px] font-black uppercase text-gray-500 block">
                        {language === 'af' ? 'Klik om te laai' : 'Click to Upload'}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#1A1A1A] hover:bg-[#8B4513] text-white text-[10px] uppercase tracking-widest font-black py-4 rounded shadow transition-all cursor-pointer border border-[#1A1A1A] hover:border-[#8B4513]"
                  >
                    {language === 'af' ? 'Voeg Geleentheid By' : 'Add Event / Link Item'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Section 3: Current Gallery List Table */}
          <div className="bg-white border border-[#E0DBCF] rounded p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A] mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-[#8B4513]" />
              <span>{language === 'af' ? 'Bestaande Geleenthede & Skakels' : 'Existing Occasions & Links'}</span>
            </h2>

            {galleryLinksVal && galleryLinksVal.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E0DBCF]">
                      <th className="pb-3 text-[10px] uppercase tracking-widest text-gray-400 font-black">{language === 'af' ? 'Foto' : 'Image'}</th>
                      <th className="pb-3 text-[10px] uppercase tracking-widest text-gray-400 font-black">{language === 'af' ? 'Besonderhede (AF / EN)' : 'Details (AF / EN)'}</th>
                      <th className="pb-3 text-[10px] uppercase tracking-widest text-gray-400 font-black">{language === 'af' ? 'Kategorie Tag' : 'Category Tag'}</th>
                      <th className="pb-3 text-[10px] uppercase tracking-widest text-gray-400 font-black">{language === 'af' ? 'Bestemming' : 'Destination'}</th>
                      <th className="pb-3 text-[10px] uppercase tracking-widest text-gray-400 font-black text-right">{language === 'af' ? 'Aksies' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {galleryLinksVal.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4">
                          <img 
                            src={item.imageUrl} 
                            alt={item.titleAf} 
                            referrerPolicy="no-referrer"
                            className="w-14 h-10 object-cover rounded border border-[#E0DBCF]"
                          />
                        </td>
                        <td className="py-4">
                          <div className="space-y-0.5">
                            <span className="text-xs font-black uppercase text-gray-800 block">{item.titleAf}</span>
                            <span className="text-[10px] font-medium text-gray-400 block">{item.titleEn}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="bg-[#F5F2ED] text-[#8B4513] text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded">
                            {language === 'af' ? item.occasionAf : item.occasionEn}
                          </span>
                        </td>
                        <td className="py-4 font-mono text-[10px] text-gray-500">
                          {item.linkUrl}
                        </td>
                        <td className="py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteGalleryItem(item.id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-all cursor-pointer"
                            title={language === 'af' ? 'Skrap Item' : 'Delete Item'}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400 text-xs font-bold uppercase tracking-wide">
                {language === 'af' ? 'Geen geleenthede gevind nie.' : 'No occasions found.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CUSTOM CONFIRMATION DIALOG MODAL */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border-2 border-[#8B4513] max-w-md w-full rounded-lg overflow-hidden shadow-2xl transform scale-100 transition-all">
            <div className="bg-[#1A1A1A] text-white px-6 py-4 border-b border-[#8B4513]/30 flex items-center gap-2">
              <Shield className="text-[#8B4513]" size={18} />
              <h4 className="text-xs uppercase tracking-widest font-black">
                {confirmModal.title}
              </h4>
            </div>
            
            <div className="p-6">
              <p className="text-xs text-gray-600 leading-relaxed font-sans font-medium">
                {confirmModal.message}
              </p>
            </div>
            
            <div className="bg-[#F5F2ED] px-6 py-4 flex justify-end gap-3 border-t border-[#E0DBCF]">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="bg-white hover:bg-gray-50 border border-[#E0DBCF] text-gray-700 px-4 py-2 rounded text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer"
              >
                {language === 'af' ? 'Kanselleer' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await confirmModal.onConfirm();
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setConfirmModal(null);
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded text-[10px] uppercase tracking-wider font-black transition-all shadow-sm cursor-pointer"
              >
                {language === 'af' ? 'JA, VERWYDER' : 'YES, DELETE'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM TOAST NOTIFICATION POPUP */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-[#1A1A1A] text-white border-l-4 border-[#8B4513] px-5 py-3.5 rounded shadow-2xl flex items-center gap-3 max-w-sm">
            <Check className="text-emerald-500 shrink-0" size={16} />
            <span className="text-[11px] uppercase tracking-wider font-bold">
              {toastMessage}
            </span>
          </div>
        </div>
      )}

    </div>
  );
};
