/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingCart, 
  Settings, 
  X, 
  Plus, 
  Trash2, 
  Download, 
  Upload,
  Copy,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Search,
  Edit3,
  Filter,
  Package,
  ArrowLeft,
  Zap,
  Clock,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { Product, CartItem, Order, SiteSettings } from './types';

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: '簡約純棉T恤',
    sn: 'SP001',
    price: 89,
    category: '服裝',
    description: '採用 100% 精梳棉，親膚透氣，經典版型百搭舒適。',
    promoLabel: '限時直降15元',
    promoSubLabel: '限購1件!',
    isNew: true,
    imgs: [
      'https://picsum.photos/seed/t1/600/1067',
      'https://picsum.photos/seed/t2/600/1067',
      'https://picsum.photos/seed/t3/600/1067'
    ],
    specs: ['S', 'M', 'L', 'XL'],
    sizeChart: `
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-white/10 text-left">
            <th class="py-2">尺碼</th>
            <th class="py-2">胸圍</th>
            <th class="py-2">衣長</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-white/5">
            <td class="py-2">S</td>
            <td class="py-2">100cm</td>
            <td class="py-2">68cm</td>
          </tr>
          <tr class="border-b border-white/5">
            <td class="py-2">M</td>
            <td class="py-2">104cm</td>
            <td class="py-2">70cm</td>
          </tr>
          <tr>
            <td class="py-2">L</td>
            <td class="py-2">108cm</td>
            <td class="py-2">72cm</td>
          </tr>
        </tbody>
      </table>
    `
  },
  {
    id: 2,
    name: '無線藍牙耳機',
    sn: 'SP002',
    price: 199,
    category: '3C',
    description: '主動降噪技術，長達 30 小時續航，享受純淨音質。',
    isHot: true,
    promoLabel: '限時直降50元',
    promoSubLabel: '限購1件!',
    imgs: [
      'https://picsum.photos/seed/d1/600/1067',
      'https://picsum.photos/seed/d2/600/1067'
    ],
    specs: ['黑色', '白色', '午夜藍']
  },
  {
    id: 3,
    name: '北歐風簡約檯燈',
    sn: 'SP003',
    price: 129,
    category: '家居',
    description: '三段調光設計，柔和護眼光線，簡約設計裝點空間。',
    promoLabel: '限時特惠',
    promoSubLabel: '限量50台',
    imgs: [
      'https://picsum.photos/seed/h1/600/1067',
      'https://picsum.photos/seed/h2/600/1067'
    ]
  },
  {
    id: 4,
    name: '保濕修護面霜',
    sn: 'SP004',
    price: 259,
    category: '美妝',
    description: '深層滋潤配方，修復肌膚屏障，鎖水保濕長效呵護。',
    isHot: true,
    promoLabel: '限時直降30元',
    promoSubLabel: '限購2件',
    imgs: [
      'https://picsum.photos/seed/b1/600/1067'
    ]
  }
];

function PromoBadge({ label, subLabel }: { label: string; subLabel?: string }) {
  return (
    <div className="flex items-center h-7">
      <div className="flex items-center bg-red-600 text-white px-1.5 h-full rounded-l-md gap-1 relative z-10">
        <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center shrink-0">
          <Clock size={10} className="text-red-600" />
        </div>
        <span className="text-[11px] font-black whitespace-nowrap">{label}</span>
      </div>
      {subLabel && (
        <div className="flex items-center border border-red-600 text-red-600 pr-1.5 pl-2 h-full rounded-r-md font-bold text-[11px] bg-white -ml-1">
          {subLabel}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, addToCart, siteSettings }: any): React.JSX.Element {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollToImage = (index: number) => {
    if (carouselRef.current) {
      const width = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: index * width,
        behavior: 'smooth'
      });
      setCurrentImgIdx(index);
    }
  };

  useEffect(() => {
    if (isHovered || product.imgs.length <= 1) return;
    
    const timer = setTimeout(() => {
      const nextIdx = (currentImgIdx + 1) % product.imgs.length;
      scrollToImage(nextIdx);
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentImgIdx, isHovered, product.imgs.length]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative h-full sm:h-auto sm:aspect-[9/16] bg-black rounded-none sm:rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden border-0 sm:border border-gray-100"
    >
      {/* Image Gallery Section - Background */}
      <div className="absolute inset-0 z-0">
        <div 
          ref={carouselRef}
          className="flex h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing"
          onScroll={(e) => {
            const scrollLeft = e.currentTarget.scrollLeft;
            const width = e.currentTarget.offsetWidth;
            const index = Math.round(scrollLeft / width);
            if (index !== currentImgIdx) setCurrentImgIdx(index);
          }}
        >
          {product.imgs.map((img, idx) => (
            <div key={idx} className="w-full h-full flex-shrink-0 snap-center">
              <img 
                src={img} 
                alt="" 
                className="w-full h-full object-contain pointer-events-none"
                referrerPolicy="no-referrer"
                draggable="false"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Top Floating Elements */}
      <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-xl text-white text-[10px] font-bold rounded-full border border-white/20 uppercase tracking-wider">
            {product.category}
          </span>
          {product.isHot && (
            <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full shadow-lg shadow-red-500/40 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              HOT
            </span>
          )}
        </div>
      </div>

      {/* Bottom Info Section - Overlaid */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col pb-4 sm:pb-6">
        {/* Gradient Overlay for Readability */}
        <div className="absolute bottom-0 left-0 right-0 h-[200%] bg-gradient-to-t from-black/90 via-black/50 to-transparent -z-10 pointer-events-none" />

        <div className="px-4 sm:px-6 flex flex-col gap-3">
          <div className="flex items-end justify-between gap-4">
            {/* Left side: Info */}
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <h3 className="font-black text-xl sm:text-2xl text-white line-clamp-2 leading-tight tracking-tight drop-shadow-md">
                {product.name}
              </h3>
              
              {product.description && (
                <p className="text-xs sm:text-sm text-white/80 line-clamp-2 font-medium leading-snug drop-shadow-md">
                  {product.description}
                </p>
              )}

              {/* Carousel Progress Bar */}
              {product.imgs.length > 1 && (
                <div className="flex gap-1 w-1/3 h-[1px] my-1">
                  {product.imgs.map((_, idx) => (
                    <div key={idx} className="h-full flex-1 bg-white/10 rounded-full overflow-hidden">
                      {idx === currentImgIdx ? (
                        !isHovered && (
                          <motion.div 
                            key={currentImgIdx}
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3, ease: "linear" }}
                            className="h-full bg-white/40"
                          />
                        )
                      ) : idx < currentImgIdx ? (
                        <div className="h-full w-full bg-white/40" />
                      ) : null}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-baseline gap-1 drop-shadow-md mr-1">
                  <span className="text-sm font-black text-red-500">¥</span>
                  <span className="text-3xl font-black text-white tracking-tighter leading-none">
                    {Math.floor(product.price)}
                  </span>
                </div>
                {product.promoLabel && siteSettings.isCartEnabled !== false && (
                  <PromoBadge label={product.promoLabel} subLabel={product.promoSubLabel} />
                )}
                <button 
                  onClick={() => addToCart(product)}
                  disabled={siteSettings.isCartEnabled === false}
                  className={cn(
                    "flex items-center h-7 text-white px-2.5 rounded-md gap-1.5 active:scale-95 transition-all shadow-md relative overflow-hidden",
                    siteSettings.isCartEnabled === false ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 shadow-red-600/40"
                  )}
                >
                  {product.isHot && siteSettings.isCartEnabled !== false && (
                    <motion.div 
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                    />
                  )}
                  <ShoppingCart size={14} />
                  <span className="text-[11px] font-black tracking-wider whitespace-nowrap">
                    {siteSettings.isCartEnabled === false ? "近期已結單，等下次開放" : "加入購物車"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Chart Modal Removed */}
    </motion.div>
  );
}

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    if (!saved) return DEFAULT_PRODUCTS;
    try {
      const parsed = JSON.parse(saved);
      // Force reset if old data structure is detected (missing promoLabel and has countdownLabel)
      if (parsed.length > 0 && parsed[0].promoLabel === undefined && parsed[0].countdownLabel !== undefined) {
        return DEFAULT_PRODUCTS;
      }
      return parsed;
    } catch (e) {
      return DEFAULT_PRODUCTS;
    }
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('categories');
      return saved ? JSON.parse(saved) : ['全部', '服裝', '數碼', '家居', '美妝'];
    } catch (e) {
      return ['全部', '服裝', '數碼', '家居', '美妝'];
    }
  });
  const [activeCategory, setActiveCategory] = useState('全部');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [currentSHA, setCurrentSHA] = useState<string | null>(null);
  const [settingsSHA, setSettingsSHA] = useState<string | null>(null);
  const [categoriesSHA, setCategoriesSHA] = useState<string | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    title: "90s加購專區",
    subtitle: [
      "此專區僅供「預購商品」加購 & 訂單產生，特賣會款式無列入。",
      "特賣會期間亦可加購（此專區不列入特賣會免運，但可合併出貨省運費）。"
    ],
    logoUrl: "",
    orderFooterText: "📍前往IG將圖片發給九零統計結帳📍",
    orderFooterSubText: "- 此專區僅用於預購商品的訂單生成 -",
    shippingFee: 60,
    freeShippingThreshold: 1000,
    isCartEnabled: true
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [specModalProduct, setSpecModalProduct] = useState<Product | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [igAccount, setIgAccount] = useState('');
  const [editingCartKey, setEditingCartKey] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'dark-success' } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const [showCartSuccess, setShowCartSuccess] = useState(false);
  
  const orderCardRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'dark-success' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleConfirm = (message: string, onConfirm: () => void) => {
    setConfirmDialog({ message, onConfirm });
  };

  const rewriteImageUrl = (img: string) => {
    if (!img) return img;
    if (img.startsWith('https://raw.githubusercontent.com/')) {
      const parts = img.split('/');
      const pathParts = parts.slice(6);
      const fullPath = pathParts.join('/');
      return `/api/images/${fullPath}`;
    }
    if (img.startsWith('images/')) {
      return `/api/images/${img}`;
    }
    return img;
  };

  const loadProductsFromGitHub = async () => {
    setIsSyncing(true);
    try {
      const response = await globalThis.fetch(`/api/products?t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        
        // Rewrite old raw.githubusercontent.com URLs to use the proxy
        const processedProducts = data.products.map((p: Product) => ({
          ...p,
          imgs: p.imgs.map(rewriteImageUrl)
        }));
        
        setProducts(processedProducts);
        setCurrentSHA(data.sha);
        console.log('Loaded products from GitHub');
      } else {
        const error = await response.json();
        showToast(`載入失敗: ${error.message}`, 'error');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      showToast('載入過程中發生錯誤', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const loadSettingsFromGitHub = async () => {
    try {
      const response = await globalThis.fetch(`/api/settings?t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        const settings = data.settings;
        if (settings.logoUrl) {
          settings.logoUrl = rewriteImageUrl(settings.logoUrl);
        }
        setSiteSettings(settings);
        setSettingsSHA(data.sha);
        console.log('Loaded settings from GitHub');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadCategoriesFromGitHub = async () => {
    try {
      const response = await globalThis.fetch(`/api/categories?t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
        setCategoriesSHA(data.sha);
        console.log('Loaded categories from GitHub');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const generateMD5LikeHash = async (data: any) => {
    const msgUint8 = new TextEncoder().encode(JSON.stringify(data));
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const syncWithRetryAndVerify = async (
    endpoint: string,
    dataKey: string,
    data: any,
    currentSha: string | null,
    setSha: (sha: string) => void,
    maxRetries = 3
  ) => {
    const localHash = await generateMD5LikeHash(data);
    let lastError = null;
    let activeSha = currentSha;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const saveRes = await globalThis.fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ [dataKey]: data, sha: activeSha }),
        });
        
        if (!saveRes.ok) {
          const errData = await saveRes.json();
          throw new Error(errData.message || `Save failed with status ${saveRes.status}`);
        }
        
        const saveData = await saveRes.json();
        const newSha = saveData.sha;

        await new Promise(resolve => setTimeout(resolve, 1500));

        const fetchRes = await globalThis.fetch(`${endpoint}?t=${Date.now()}`);
        if (!fetchRes.ok) throw new Error(`Fetch failed with status ${fetchRes.status}`);
        const fetchData = await fetchRes.json();
        
        const remoteHash = await generateMD5LikeHash(fetchData[dataKey]);
        
        if (localHash === remoteHash) {
          setSha(newSha);
          return true;
        } else {
          console.warn(`Attempt ${attempt}: Hash mismatch. Local: ${localHash}, Remote: ${remoteHash}`);
          activeSha = fetchData.sha;
          if (attempt === maxRetries) throw new Error('校驗失敗：遠端資料與本地不一致');
        }
      } catch (error) {
        console.warn(`Attempt ${attempt}: Error during sync`, error);
        lastError = error;
        if (attempt === maxRetries) throw lastError;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    return false;
  };

  const saveCategoriesToGitHub = async (updatedCategories: string[], showToastMsg = true, updateSyncState = true) => {
    if (updateSyncState) setIsSyncing(true);
    try {
      await syncWithRetryAndVerify('/api/categories', 'categories', updatedCategories, categoriesSHA, setCategoriesSHA);
      if (showToastMsg) showToast('分類已成功儲存並校驗通過！', 'success');
    } catch (error: any) {
      console.error('Error saving categories:', error);
      if (showToastMsg) showToast('保存分類失敗：' + (error.message || '未知錯誤'), 'error');
    } finally {
      if (updateSyncState) setIsSyncing(false);
    }
  };

  const saveSettingsToGitHub = async (updatedSettings: SiteSettings, showToastMsg = true, updateSyncState = true) => {
    if (updateSyncState) setIsSyncing(true);
    try {
      await syncWithRetryAndVerify('/api/settings', 'settings', updatedSettings, settingsSHA, setSettingsSHA);
      if (showToastMsg) showToast('設定已成功儲存並校驗通過！', 'success');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      if (showToastMsg) showToast('保存設定失敗：' + (error.message || '未知錯誤'), 'error');
    } finally {
      if (updateSyncState) setIsSyncing(false);
    }
  };

  const saveProductsToGitHub = async (updatedProducts: Product[], showToastMsg = true, updateSyncState = true) => {
    if (updateSyncState) setIsSyncing(true);
    try {
      await syncWithRetryAndVerify('/api/products', 'products', updatedProducts, currentSHA, setCurrentSHA);
      if (showToastMsg) showToast('商品已成功保存並校驗通過！', 'success');
    } catch (error: any) {
      console.error('Error saving products:', error);
      if (showToastMsg) showToast('保存商品失敗：' + (error.message || '未知錯誤'), 'error');
    } finally {
      if (updateSyncState) setIsSyncing(false);
    }
  };

  const saveAllToGitHub = async (currentSettings: SiteSettings) => {
    setIsSyncing(true);
    try {
      await Promise.all([
        saveProductsToGitHub(products, false, false),
        saveSettingsToGitHub(currentSettings, false, false),
        saveCategoriesToGitHub(categories, false, false)
      ]);
      setSiteSettings(currentSettings);
      showToast('所有變更（商品、設定、分類）已成功保存到 GitHub！', 'success');
    } catch (error) {
      showToast('保存過程中發生錯誤', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const loadAllFromGitHub = () => {
    loadProductsFromGitHub();
    loadSettingsFromGitHub();
    loadCategoriesFromGitHub();
  };

  useEffect(() => {
    loadAllFromGitHub();
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const addToCart = (product: Product, selectedSpec?: string) => {
    if (product.specs && product.specs.length > 0 && !selectedSpec) {
      setSpecModalProduct(product);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSpec === selectedSpec);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedSpec === selectedSpec) ? { ...item, num: item.num + 1 } : item
        );
      }
      return [...prev, { ...product, num: 1, selectedSpec }];
    });
    setSpecModalProduct(null);
    
    setShowCartSuccess(true);
    setTimeout(() => setShowCartSuccess(false), 700);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartNum = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newNum = Math.max(1, item.num + delta);
        return { ...item, num: newNum };
      }
      return item;
    }));
  };

  const createOrder = () => {
    if (cart.length === 0) return;
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.num, 0);
    const shippingFee = (siteSettings.freeShippingThreshold && subtotal >= siteSettings.freeShippingThreshold) 
      ? 0 
      : (siteSettings.shippingFee || 0);
    
    const promotionAmount = siteSettings.enablePromotion ? (siteSettings.promotionAmount || 0) : 0;
    
    const order: Order = {
      items: [...cart],
      total: Math.max(0, subtotal + shippingFee - promotionAmount),
      shippingFee,
      promotionName: siteSettings.enablePromotion ? siteSettings.promotionName : undefined,
      promotionAmount: siteSettings.enablePromotion ? promotionAmount : undefined,
      date: new Date().toLocaleString()
    };
    setLastOrder(order);
    setCart([]);
    setIsCartOpen(false);
  };

  const copyOrderText = () => {
    if (!lastOrder) return;
    
    const itemsText = lastOrder.items.map(item => 
      `${item.name}${item.selectedSpec ? ` (${item.selectedSpec})` : ''} x${item.num} ¥${Math.floor(item.price * item.num)}`
    ).join('\n');

    const orderText = `-【${igAccount || '您的帳號'}｜預購訂單】-
${lastOrder.date}

◆ 九零預購訂單內容：
${itemsText}

+運費 ¥${lastOrder.shippingFee}
——————————————
= ¥${Math.floor(lastOrder.total)} (預購訂單金額)

◆ 將訂單內容複製貼上發給九零
1、只購買預購商品：
→ 等九零回覆匯款資訊

2、也有購買特賣會商品：
→ 等九零更新綜合訂單`;

    navigator.clipboard.writeText(orderText).then(() => {
      showToast('訂單內容已複製', 'dark-success');
    }).catch(err => {
      console.error('Copy failed:', err);
      showToast('複製失敗，請手動截圖', 'error');
    });
  };

  const filteredProducts = activeCategory === '全部' 
    ? products 
    : activeCategory === '新品'
      ? products.filter(p => p.isNew)
      : products.filter(p => p.category === activeCategory);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.num, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.num, 0);

  return (
    <div className="h-[100dvh] sm:min-h-screen sm:h-auto overflow-hidden sm:overflow-visible bg-[#FDFDFD] text-gray-900 font-sans flex flex-col">
      {/* Navbar */}
      <header className="shrink-0 sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-100/50">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {siteSettings.logoUrl ? (
              <img src={siteSettings.logoUrl} alt="Logo" className="w-8 h-8 object-contain rounded-lg shadow-sm shadow-gray-200" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center shrink-0 shadow-sm shadow-gray-200">
                <Package className="text-white" size={16} />
              </div>
            )}
            <h1 className="text-lg font-black tracking-tighter text-gray-900">
              {siteSettings.title}
            </h1>
          </div>
          <div className="flex gap-2 items-center">
            <button 
              onClick={() => setIsAdminLoginOpen(true)}
              className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
              title="Admin Management"
            >
              <Settings size={18} />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-red-500 transition-all shadow-md shadow-gray-200 hover:shadow-red-100 group"
            >
              <ShoppingCart size={16} className="group-hover:scale-110 transition-transform" />
              <span className="font-bold text-xs">購物車</span>
              {cartCount > 0 && (
                <motion.span 
                  key={cartCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="bg-gray-100 border-t border-gray-200">
          <div className="container mx-auto px-4 py-1.5 flex items-center gap-2">
            <div className="shrink-0 w-4 h-4 bg-black rounded-full flex items-center justify-center">
              <Zap size={10} className="text-white fill-white" />
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-4 text-[11px] sm:text-xs text-gray-900 font-bold leading-tight">
              {siteSettings.subtitle.map((line, idx) => (
                <p key={idx} className="flex items-center gap-1">
                  <span className="w-1 h-1 bg-black rounded-full" />
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 relative flex flex-col overflow-hidden">
        {/* Categories - Floating over products on mobile */}
        <div className="absolute sm:static top-0 left-0 right-0 z-40 flex gap-3 mb-0 sm:mb-6 overflow-x-auto scrollbar-hide pb-3 sm:pb-2 items-center px-4 sm:px-0 pt-3 sm:pt-0 shrink-0 bg-transparent border-none pointer-events-none [&>*]:pointer-events-auto container mx-auto">
          <button
            onClick={() => setActiveCategory('全部')}
            className={cn(
              "px-3 py-1.5 rounded-xl whitespace-nowrap transition-all text-xs sm:text-sm font-bold tracking-wide border-2",
              activeCategory === '全部' 
                ? "bg-gray-900 text-white border-gray-900 shadow-md shadow-gray-200 scale-105" 
                : "bg-white/80 backdrop-blur-md text-gray-700 border-white/50 hover:border-gray-300 hover:text-gray-900 shadow-sm"
            )}
          >
            全部商品
          </button>
          <button
            onClick={() => setActiveCategory('新品')}
            className={cn(
              "px-3 py-1.5 rounded-xl whitespace-nowrap transition-all text-xs sm:text-sm font-bold tracking-wide border-2",
              activeCategory === '新品' 
                ? "bg-gray-900 text-white border-gray-900 shadow-md shadow-gray-200 scale-105" 
                : "bg-white/80 backdrop-blur-md text-gray-700 border-white/50 hover:border-gray-300 hover:text-gray-900 shadow-sm"
            )}
          >
            新品
          </button>
          
          <div className="relative pointer-events-auto">
            <select
              value={activeCategory !== '全部' && activeCategory !== '新品' ? activeCategory : ''}
              onChange={(e) => setActiveCategory(e.target.value)}
              className={cn(
                "appearance-none px-3 py-1.5 pr-7 rounded-xl whitespace-nowrap transition-all text-xs sm:text-sm font-bold tracking-wide border-2 outline-none cursor-pointer",
                activeCategory !== '全部' && activeCategory !== '新品'
                  ? "bg-gray-900 text-white border-gray-900 shadow-md shadow-gray-200 scale-105" 
                  : "bg-white/80 backdrop-blur-md text-gray-700 border-white/50 hover:border-gray-300 hover:text-gray-900 shadow-sm"
              )}
            >
              <option value="" disabled className="hidden text-[11px] sm:text-xs">分類</option>
              {categories.filter(c => c !== '全部').map(cat => (
                <option key={cat} value={cat} className="text-gray-900 bg-white text-[11px] sm:text-xs">{cat}</option>
              ))}
            </select>
            <ChevronDown size={14} className={cn(
              "absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none",
              activeCategory !== '全部' && activeCategory !== '新品' ? "text-white" : "text-gray-500"
            )} />
          </div>
        </div>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto snap-y snap-mandatory sm:snap-none flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-0 sm:gap-8 container mx-auto px-0 sm:px-4 py-0 sm:py-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="snap-start sm:snap-none snap-always h-full sm:h-auto flex-shrink-0">
              <ProductCard product={product} addToCart={addToCart} siteSettings={siteSettings} />
            </div>
          ))}
        </main>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* Cart Modal */}
        {isCartOpen && (
          <Modal onClose={() => setIsCartOpen(false)}>
            <div className="flex flex-col flex-1 min-h-0 bg-white">
              <div className="p-4 border-b border-gray-50 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="text-white" size={16} />
                  </div>
                  <h2 className="text-xl font-black tracking-tighter">購物車</h2>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-50 rounded-lg transition-all text-gray-400 hover:text-gray-900"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-4 py-12">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                      <ShoppingCart size={32} strokeWidth={1.5} />
                    </div>
                    <p className="font-bold tracking-wide text-sm">您的購物車空空如也</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-red-500 transition-all shadow-lg shadow-gray-100"
                    >
                      開始購物
                    </button>
                  </div>
                ) : (
                  cart.map((item, idx) => {
                    const itemKey = `${item.id}-${item.selectedSpec || idx}`;
                    const isEditing = editingCartKey === itemKey;
                    
                    return (
                      <div key={itemKey} className="flex gap-3 p-3 bg-white border border-gray-100 rounded-2xl group hover:shadow-md transition-all duration-300">
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-black">
                          <img 
                            src={item.imgs[0]} 
                            alt="" 
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm leading-tight">{item.name}</h4>
                            {item.selectedSpec && (
                              <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded mt-1 inline-block">
                                規格: {item.selectedSpec}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-baseline gap-0.5">
                              <span className="text-[10px] font-black text-red-500">¥</span>
                              <span className="font-black text-base text-red-500">{Math.floor(item.price)}</span>
                            </div>
                            
                            {isEditing ? (
                              <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border border-gray-100">
                                <button 
                                  onClick={() => updateCartNum(item.id, -1)}
                                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white rounded transition-all font-bold text-sm"
                                >
                                  -
                                </button>
                                <motion.span 
                                  key={item.num}
                                  initial={{ scale: 0.8, opacity: 0.5 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="font-black text-xs w-3 text-center text-gray-900"
                                >
                                  {item.num}
                                </motion.span>
                                <button 
                                  onClick={() => updateCartNum(item.id, 1)}
                                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white rounded transition-all font-bold text-sm"
                                >
                                  +
                                </button>
                                <button 
                                  onClick={() => setEditingCartKey(null)}
                                  className="ml-1 text-[10px] font-bold text-blue-500 hover:text-blue-600"
                                >
                                  完成
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => setEditingCartKey(itemKey)}
                                className="text-xs font-black text-gray-400 hover:text-gray-900 transition-colors bg-gray-50 px-2 py-1 rounded-lg"
                              >
                                x{item.num}
                              </button>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-gray-200 hover:text-red-500 transition-colors self-start"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="p-4 border-t border-gray-50 bg-white shrink-0">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-bold">商品小計</span>
                    <span className="font-black text-gray-900">¥{Math.floor(cartTotal)}</span>
                  </div>

                  {siteSettings.enablePromotion && (
                    <div className="flex justify-between items-center text-xs text-red-500">
                      <span className="font-bold">{siteSettings.promotionName || '優惠折抵'}</span>
                      <span className="font-black">-¥{siteSettings.promotionAmount || 0}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-bold">運費</span>
                    {siteSettings.freeShippingThreshold && cartTotal >= siteSettings.freeShippingThreshold ? (
                      <span className="font-black text-red-500 text-xs">0元</span>
                    ) : (
                      <span className="font-black text-gray-900 text-xs">¥{siteSettings.shippingFee || 0}</span>
                    )}
                  </div>

                  {siteSettings.freeShippingThreshold && cartTotal < siteSettings.freeShippingThreshold && (
                    <div className="bg-blue-50 p-2 rounded-lg flex items-center gap-2">
                      <Zap size={12} className="text-blue-500" />
                      <p className="text-[10px] font-bold text-blue-600">
                        再買 ¥{Math.floor(siteSettings.freeShippingThreshold - cartTotal)} 元即可享免運優惠！
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-end pt-2 border-t border-gray-50">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">總計 (含運費)</span>
                    </div>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-sm font-black text-red-500">¥</span>
                      <span className="text-3xl font-black text-red-500 tracking-tighter">
                        {Math.floor(Math.max(0, 
                          cartTotal + 
                          (siteSettings.freeShippingThreshold && cartTotal >= siteSettings.freeShippingThreshold ? 0 : (siteSettings.shippingFee || 0)) - 
                          (siteSettings.enablePromotion ? (siteSettings.promotionAmount || 0) : 0)
                        ))}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button 
                  disabled={cart.length === 0}
                  onClick={createOrder}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-base shadow-xl shadow-gray-200 hover:bg-red-500 disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none transition-all duration-500 transform active:scale-[0.98]"
                >
                  生成訂單
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Order Modal */}
        {lastOrder && (
          <Modal onClose={() => setLastOrder(null)}>
            <div className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto p-8">
                <div 
                  ref={orderCardRef}
                  className="bg-white p-8 border-2 border-dashed border-gray-200 rounded-3xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CheckCircle2 size={120} className="text-blue-500" />
                  </div>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-800">已生成訂單</h3>
                    <p className="text-sm text-gray-400 mt-2">{lastOrder.date}</p>
                  </div>
                  <div className="space-y-4 mb-8">
                    {lastOrder.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <img src={item.imgs[0]} alt="" className="w-10 h-10 object-cover rounded" referrerPolicy="no-referrer" />
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            {item.selectedSpec && <p className="text-[10px] text-gray-400">規格: {item.selectedSpec}</p>}
                            <p className="text-[10px] text-gray-400">x{item.num}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold">¥{Math.floor(item.price * item.num)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-gray-500">商品小計</span>
                      <span className="font-bold text-gray-900">¥{Math.floor(lastOrder.items.reduce((sum, item) => sum + item.price * item.num, 0))}</span>
                    </div>
                    {lastOrder.promotionAmount && (
                      <div className="flex justify-between items-center text-sm text-red-500">
                        <span className="font-bold">{lastOrder.promotionName || '優惠折抵'}</span>
                        <span className="font-bold">-¥{lastOrder.promotionAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-gray-500">運費</span>
                      {lastOrder.shippingFee === 0 ? (
                        <span className="font-bold text-red-500">0元</span>
                      ) : (
                        <span className="font-bold text-gray-900">¥{lastOrder.shippingFee}</span>
                      )}
                    </div>
                    <div className="border-t pt-4 flex justify-between items-center">
                      <span className="font-bold text-gray-600">實付總額</span>
                      <span className="text-2xl font-bold text-red-500">¥{Math.floor(lastOrder.total)}</span>
                    </div>
                  </div>

                </div>
              </div>
              <div className="p-6 border-t flex flex-col gap-4 shrink-0">
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 text-center">Instagram 帳號 (必填)</label>
                    <input 
                      type="text" 
                      value={igAccount}
                      onChange={e => setIgAccount(e.target.value)}
                      placeholder="請輸入您的 IG 帳號"
                      className="w-full bg-gray-50 border-2 border-blue-500 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => { setLastOrder(null); setIgAccount(''); }}
                      className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-all"
                    >
                      重新加購
                    </button>
                    <button 
                      disabled={!igAccount.trim()}
                      onClick={copyOrderText}
                      className="flex-[2] py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:bg-gray-100 disabled:text-gray-300"
                    >
                      <Copy size={18} />
                      複製訂單內容 (文字)
                    </button>
                  </div>
                </div>
                <div className="text-red-500 text-sm font-bold text-center mt-3 space-y-1">
                  <div dangerouslySetInnerHTML={{ __html: siteSettings.orderFooterText || '📍前往IG將圖片發給九零統計結帳📍' }} />
                  <div className="text-xs opacity-80" dangerouslySetInnerHTML={{ __html: siteSettings.orderFooterSubText || '- 此專區僅用於預購商品的訂單生成 -' }} />
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Spec Selection Modal */}
        {specModalProduct && (
          <Modal onClose={() => setSpecModalProduct(null)}>
            <div className="p-8">
              <div className="flex items-center gap-6 mb-8">
                <img 
                  src={specModalProduct.imgs[0]} 
                  alt="" 
                  className="w-24 h-24 object-cover rounded-2xl shadow-lg" 
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-1">{specModalProduct.name}</h3>
                  <p className="text-2xl font-black text-red-500">¥{Math.floor(specModalProduct.price)}</p>
                </div>
              </div>
              
              <div className="mb-8">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">選擇規格</label>
                <div className="flex flex-wrap gap-3">
                  {specModalProduct.specs?.map(spec => (
                    <button
                      key={spec}
                      onClick={() => addToCart(specModalProduct, spec)}
                      className="px-6 py-3 bg-gray-50 hover:bg-red-500 hover:text-white rounded-xl font-bold text-sm transition-all border border-gray-100 hover:border-red-500 hover:shadow-lg hover:shadow-red-100"
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>
              
              {specModalProduct.sizeChart && (
                <div className="mb-8">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">尺碼表</label>
                  <div className="overflow-x-auto border border-gray-100 rounded-xl p-4 bg-gray-50">
                    <div 
                      className="text-xs text-gray-600 leading-tight [&_table]:w-full [&_table]:border-collapse [&_th]:text-left [&_th]:p-2 [&_td]:p-2 [&_th]:border-b [&_th]:border-gray-200 [&_td]:border-b [&_td]:border-gray-200"
                      dangerouslySetInnerHTML={{ __html: specModalProduct.sizeChart }}
                    />
                  </div>
                </div>
              )}
              
              <button 
                onClick={() => setSpecModalProduct(null)}
                className="w-full py-4 bg-gray-100 text-gray-400 rounded-2xl font-bold hover:bg-gray-200 transition-all"
              >
                取消
              </button>
            </div>
          </Modal>
        )}

        {/* Admin Login Modal */}
        {isAdminLoginOpen && (
          <AdminLogin 
            onLogin={() => {
              setIsAdminLoginOpen(false);
              setIsAdminOpen(true);
            }}
            onClose={() => setIsAdminLoginOpen(false)}
          />
        )}

        {/* Admin Modal */}
        {isAdminOpen && (
          <AdminModal 
            products={products} 
            setProducts={setProducts} 
            categories={categories}
            setCategories={setCategories}
            cart={cart}
            setCart={setCart}
            siteSettings={siteSettings}
            setSiteSettings={setSiteSettings}
            onClose={() => setIsAdminOpen(false)} 
            onSaveToGitHub={saveAllToGitHub}
            onSaveSettings={saveSettingsToGitHub}
            isSyncing={isSyncing}
            showToast={showToast}
            handleConfirm={handleConfirm}
          />
        )}

        {/* Custom Notifications */}
        <AnimatePresence>
          {showCartSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
            >
              <div className="bg-black/80 backdrop-blur-sm text-white px-8 py-6 rounded-3xl flex flex-col items-center gap-3 shadow-2xl">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={40} className="text-white" />
                </div>
                <span className="font-bold text-lg tracking-wider">成功加入購物車</span>
              </div>
            </motion.div>
          )}
          {toast && (
            <Toast 
              key="toast"
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
            />
          )}
          {confirmDialog && (
            <ConfirmModal 
              key="confirm"
              message={confirmDialog.message} 
              onConfirm={confirmDialog.onConfirm} 
              onCancel={() => setConfirmDialog(null)} 
            />
          )}
        </AnimatePresence>
      </AnimatePresence>
    </div>
  );
}

function AdminLogin({ onLogin, onClose }: { onLogin: () => void; onClose: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '428008') {
      onLogin();
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="p-10 bg-white w-full max-w-md mx-auto rounded-[2.5rem] shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-gray-900"
        >
          <X size={24} />
        </button>
        
        <div className="flex flex-col items-center text-center space-y-8 mt-4">
          <div className="w-24 h-24 bg-gray-900 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-gray-200">
            <Settings className="text-white" size={40} />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-4xl font-black tracking-tighter">管理員登入</h2>
            <p className="text-gray-400 text-sm font-medium tracking-wide">請輸入六位數管理密碼</p>
          </div>
          
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="relative">
              <motion.div
                animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <input 
                  type="password" 
                  maxLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••"
                  autoFocus
                  className={cn(
                    "w-full bg-gray-50 border-2 rounded-3xl px-6 py-5 text-center text-3xl font-black tracking-[0.8em] outline-none transition-all",
                    error ? "border-red-500 bg-red-50 text-red-500" : "border-transparent focus:bg-white focus:border-gray-900"
                  )}
                />
              </motion.div>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-8 left-0 right-0 text-red-500 text-xs font-bold uppercase tracking-widest"
                >
                  密碼錯誤，請重試
                </motion.p>
              )}
            </div>
            
            <button 
              type="submit"
              className="w-full py-5 bg-gray-900 text-white rounded-3xl font-black text-sm tracking-[0.2em] uppercase hover:bg-red-500 transition-all shadow-2xl shadow-gray-200 hover:shadow-red-100 active:scale-[0.98]"
            >
              確認登入
            </button>
          </form>
          
          <p className="text-gray-300 text-[10px] font-bold uppercase tracking-[0.2em]">
            Authorized Personnel Only
          </p>
        </div>
      </div>
    </Modal>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {children}
      </motion.div>
    </div>
  );
}

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info' | 'dark-success'; onClose: () => void; key?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm whitespace-nowrap",
        type === 'success' ? "bg-green-500 text-white" : 
        type === 'dark-success' ? "bg-black/80 backdrop-blur-sm text-white" :
        type === 'error' ? "bg-red-500 text-white" : "bg-gray-900 text-white"
      )}
    >
      {(type === 'success' || type === 'dark-success') && <CheckCircle2 size={18} />}
      {type === 'error' && <X size={18} />}
      {message}
    </motion.div>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void; key?: string }) {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl p-8 text-center space-y-6"
      >
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
          <Package size={32} className="text-gray-400" />
        </div>
        <p className="text-gray-900 font-bold leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
          >
            取消
          </button>
          <button 
            onClick={() => { onConfirm(); onCancel(); }}
            className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-100"
          >
            確定
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function SizeChartEditor({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [rows, setRows] = useState<string[][]>([]);

  const generateTable = (grid: string[][]) => {
    const isEmpty = grid.length === 0 || grid.every(row => row.every(cell => !cell.trim()));
    if (isEmpty) return '';

    const header = grid[0];
    const body = grid.slice(1);
    return `
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-white/10 text-left">
            ${header.map(h => `<th class="py-2">${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${body.map(row => `
            <tr class="border-b border-white/5">
              ${row.map(c => `<td class="py-2">${c}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  };

  const parseTable = (html: string) => {
    const parsedRows: string[][] = [];
    const trs = html.match(/<tr[^>]*>([\s\S]*?)<\/tr>/g) || [];
    trs.forEach(tr => {
      const tds = tr.match(/<(th|td)[^>]*>([\s\S]*?)<\/(th|td)>/g) || [];
      const row = tds.map(td => td.replace(/<[^>]*>/g, '').trim());
      if (row.length > 0) parsedRows.push(row);
    });
    return parsedRows;
  };

  useEffect(() => {
    const parsed = parseTable(value);
    if (parsed.length === 0) {
      if (!value && rows.length === 0) {
        setRows([['尺碼', '胸圍', '衣長'], ['', '', '']]);
      }
    } else {
      const currentHtml = generateTable(rows).replace(/\s+/g, '');
      const newHtml = value.replace(/\s+/g, '');
      if (currentHtml !== newHtml) {
        setRows(parsed);
      }
    }
  }, [value]);

  const updateCell = (rIdx: number, cIdx: number, val: string) => {
    const newRows = rows.map((row, i) => i === rIdx ? row.map((cell, j) => j === cIdx ? val : cell) : row);
    setRows(newRows);
    onChange(generateTable(newRows));
  };

  const addRow = () => {
    const newRows = [...rows, new Array(rows[0].length).fill('')];
    setRows(newRows);
    onChange(generateTable(newRows));
  };

  const addCol = () => {
    const newRows = rows.map(row => [...row, '']);
    setRows(newRows);
    onChange(generateTable(newRows));
  };

  const removeRow = (idx: number) => {
    if (rows.length <= 1) return;
    const newRows = rows.filter((_, i) => i !== idx);
    setRows(newRows);
    onChange(generateTable(newRows));
  };

  const removeCol = (idx: number) => {
    if (rows[0].length <= 1) return;
    const newRows = rows.map(row => row.filter((_, i) => i !== idx));
    setRows(newRows);
    onChange(generateTable(newRows));
  };

  return (
    <div className="space-y-4 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {rows[0]?.map((cell, cIdx) => (
                <th key={cIdx} className="p-2 min-w-[100px]">
                  <div className="flex flex-col gap-1">
                    <input 
                      type="text" 
                      value={cell} 
                      onChange={e => updateCell(0, cIdx, e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 ring-blue-500 transition-all"
                      placeholder="標題"
                    />
                    <button 
                      onClick={() => removeCol(cIdx)}
                      className="text-[10px] text-red-400 hover:text-red-500 self-end px-1"
                    >
                      刪除列
                    </button>
                  </div>
                </th>
              ))}
              <th className="p-2 align-top pt-4">
                <button 
                  onClick={addCol}
                  className="p-2 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-100 transition-all"
                >
                  <Plus size={14} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(1).map((row, rIdx) => (
              <tr key={rIdx}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="p-2">
                    <input 
                      type="text" 
                      value={cell} 
                      onChange={e => updateCell(rIdx + 1, cIdx, e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 ring-blue-500 transition-all"
                      placeholder="內容"
                    />
                  </td>
                ))}
                <td className="p-2">
                  <button 
                    onClick={() => removeRow(rIdx + 1)}
                    className="p-2 text-red-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button 
        onClick={addRow}
        className="w-full py-3 bg-white border border-dashed border-gray-200 text-gray-400 rounded-2xl text-xs font-bold hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
      >
        <Plus size={14} />
        新增一行
      </button>
      <button 
        onClick={() => onChange('')}
        className="w-full py-2 text-red-400 text-[10px] font-bold hover:text-red-500 transition-all"
      >
        清空對照表 (前端將不顯示)
      </button>
    </div>
  );
}

function AdminModal({ 
  products, 
  setProducts, 
  categories,
  setCategories,
  cart,
  setCart,
  siteSettings,
  setSiteSettings,
  onClose,
  onSaveToGitHub,
  onSaveSettings,
  isSyncing,
  showToast,
  handleConfirm
}: { 
  products: Product[]; 
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  siteSettings: SiteSettings;
  setSiteSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  onClose: () => void;
  onSaveToGitHub: (settings: SiteSettings) => void;
  onSaveSettings: (settings: SiteSettings) => void;
  isSyncing: boolean;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  handleConfirm: (message: string, onConfirm: () => void) => void;
}) {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'edit' | 'categories' | 'bulk' | 'settings'>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('全部');
  const [selectedIds, setSelectedIds] = useState<(number | string)[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    sn: '',
    price: '',
    category: '服裝',
    description: '',
    promoLabel: '',
    promoSubLabel: '',
    specs: '',
    sizeChart: '',
    isNew: false,
    isHot: false,
    imgs: [] as string[]
  });

  const [bulkFormData, setBulkFormData] = useState({
    price: '',
    category: '',
    promoLabel: '',
    promoSubLabel: '',
    sizeChart: '',
    isNew: false,
    isHot: false,
    updatePrice: false,
    updateCategory: false,
    updatePromoLabel: false,
    updatePromoSubLabel: false,
    updateSizeChart: false,
    updateIsNew: false,
    updateIsHot: false,
  });

  const [settingsFormData, setSettingsFormData] = useState<SiteSettings>({ ...siteSettings });

  useEffect(() => {
    setSettingsFormData({ ...siteSettings });
  }, [siteSettings]);

  const resetForm = () => {
    setFormData({ name: '', sn: '', price: '', category: '服裝', description: '', promoLabel: '', promoSubLabel: '', specs: '', sizeChart: '', isNew: false, isHot: false, imgs: [] });
    setEditingProduct(null);
  };

  const handleBatchUpload = async () => {
    const names = (formData.name || '').split(',').map(n => n.trim()).filter(Boolean);
    const sns = (formData.sn || '').split(',').map(s => s.trim()).filter(Boolean);
    const prices = (formData.price || '').toString().split(',').map(p => parseFloat(p.trim())).filter(p => !isNaN(p));
    const descriptions = (formData.description || '').split(',').map(d => d.trim()).filter(Boolean);
    const promoLabels = (formData.promoLabel || '').split(',').map(l => l.trim());
    const promoSubLabels = (formData.promoSubLabel || '').split(',').map(l => l.trim());
    const specsList = (formData.specs || '').split(',').map(s => s.trim()).filter(Boolean);
    const sizeCharts = (formData.sizeChart || '').split(',').map(s => s.trim());
    
    if (names.length === 0) {
      showToast('請填寫商品名稱', 'error');
      return;
    }

    const imgList: string[] = [...formData.imgs];

    const newProducts: Product[] = [];
    const imgsPerProduct = Math.max(1, Math.floor(imgList.length / names.length));

    for (let i = 0; i < names.length; i++) {
      const productImgs = imgList.slice(i * imgsPerProduct, (i + 1) * imgsPerProduct);
      if (productImgs.length === 0) {
        productImgs.push(`https://picsum.photos/seed/${Math.random()}/600/800`);
      }

      newProducts.push({
        id: Date.now() + i,
        name: names[i],
        sn: sns[i] || 'SP' + (Date.now() + i),
        price: prices[i] || 0,
        category: formData.category,
        description: descriptions[i] || descriptions[0] || '',
        promoLabel: promoLabels[i] || promoLabels[0] || '',
        promoSubLabel: promoSubLabels[i] || promoSubLabels[0] || '',
        specs: specsList.length > 0 ? specsList : undefined,
        sizeChart: sizeCharts[i] || sizeCharts[0] || '',
        isNew: formData.isNew,
        isHot: formData.isHot,
        imgs: productImgs
      });
    }

    setProducts(prev => [...newProducts, ...prev]);
    resetForm();
    setActiveTab('list');
    showToast('批次上傳成功', 'success');
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    
    const updatedImgs = [...formData.imgs];

    const updatedProduct: Product = {
      ...editingProduct,
      name: formData.name || '',
      sn: formData.sn || '',
      price: parseFloat(formData.price.toString()) || 0,
      category: formData.category || '服裝',
      description: formData.description || '',
      promoLabel: formData.promoLabel || '',
      promoSubLabel: formData.promoSubLabel || '',
      specs: formData.specs ? formData.specs.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      sizeChart: formData.sizeChart || '',
      isNew: formData.isNew || false,
      isHot: formData.isHot || false,
      imgs: updatedImgs.length > 0 ? updatedImgs : [`https://picsum.photos/seed/${Math.random()}/600/800`]
    };

    setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
    setCart(prev => prev.map(item => item.id === editingProduct.id ? { ...item, ...updatedProduct } : item));
    
    resetForm();
    setActiveTab('list');
    showToast('商品更新成功', 'success');
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sn: product.sn,
      price: product.price.toString(),
      category: product.category,
      description: product.description || '',
      promoLabel: product.promoLabel || '',
      promoSubLabel: product.promoSubLabel || '',
      specs: product.specs ? product.specs.join(', ') : '',
      sizeChart: product.sizeChart || '',
      isNew: product.isNew || false,
      isHot: product.isHot || false,
      imgs: product.imgs
    });
    setActiveTab('edit');
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) {
      showToast('請選擇要刪除的商品', 'info');
      return;
    }
    handleConfirm(`確定要批量刪除選中的 ${selectedIds.length} 個商品嗎？`, () => {
      setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
      setCart(prev => prev.filter(item => !selectedIds.includes(item.id)));
      setSelectedIds([]);
      showToast('批量刪除成功', 'success');
    });
  };

  const handleBulkUpdate = () => {
    if (selectedIds.length === 0) return;

    setProducts(prev => prev.map(p => {
      if (selectedIds.includes(p.id)) {
        return {
          ...p,
          price: bulkFormData.updatePrice ? (parseFloat(bulkFormData.price) || p.price) : p.price,
          category: bulkFormData.updateCategory ? (bulkFormData.category || p.category) : p.category,
          promoLabel: bulkFormData.updatePromoLabel ? bulkFormData.promoLabel : p.promoLabel,
          promoSubLabel: bulkFormData.updatePromoSubLabel ? bulkFormData.promoSubLabel : p.promoSubLabel,
          sizeChart: bulkFormData.updateSizeChart ? bulkFormData.sizeChart : p.sizeChart,
          isNew: bulkFormData.updateIsNew ? bulkFormData.isNew : p.isNew,
          isHot: bulkFormData.updateIsHot ? bulkFormData.isHot : p.isHot,
        };
      }
      return p;
    }));

    setCart(prev => prev.map(item => {
      if (selectedIds.includes(item.id)) {
        return {
          ...item,
          price: bulkFormData.updatePrice ? (parseFloat(bulkFormData.price) || item.price) : item.price,
          category: bulkFormData.updateCategory ? (bulkFormData.category || item.category) : item.category,
          promoLabel: bulkFormData.updatePromoLabel ? bulkFormData.promoLabel : item.promoLabel,
          promoSubLabel: bulkFormData.updatePromoSubLabel ? bulkFormData.promoSubLabel : item.promoSubLabel,
          sizeChart: bulkFormData.updateSizeChart ? bulkFormData.sizeChart : item.sizeChart,
          isNew: bulkFormData.updateIsNew ? bulkFormData.isNew : item.isNew,
          isHot: bulkFormData.updateIsHot ? bulkFormData.isHot : item.isHot,
        };
      }
      return item;
    }));

    setSelectedIds([]);
    setActiveTab('list');
    showToast(`成功批量更新 ${selectedIds.length} 個商品`, 'success');
  };

  const filteredAdminProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.sn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === '全部' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col h-[90vh] bg-white">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 text-white rounded-lg">
              <Package size={20} />
            </div>
            <h2 className="text-xl font-bold">商品管理系統</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onSaveToGitHub(settingsFormData)}
              disabled={isSyncing}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
            >
              <Download size={18} />
              {isSyncing ? '同步中...' : '保存到 GitHub'}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-6 bg-white sticky top-0 z-10">
          <button 
            onClick={() => { setActiveTab('list'); resetForm(); }}
            className={cn(
              "px-6 py-4 text-sm font-bold transition-all border-b-2",
              activeTab === 'list' ? "border-blue-500 text-blue-500" : "border-transparent text-gray-400 hover:text-gray-600"
            )}
          >
            商品列表
          </button>
          <button 
            onClick={() => { setActiveTab('add'); resetForm(); }}
            className={cn(
              "px-6 py-4 text-sm font-bold transition-all border-b-2",
              activeTab === 'add' ? "border-blue-500 text-blue-500" : "border-transparent text-gray-400 hover:text-gray-600"
            )}
          >
            批量上傳
          </button>
          <button 
            onClick={() => { setActiveTab('categories'); resetForm(); }}
            className={cn(
              "px-6 py-4 text-sm font-bold transition-all border-b-2",
              activeTab === 'categories' ? "border-blue-500 text-blue-500" : "border-transparent text-gray-400 hover:text-gray-600"
            )}
          >
            分類管理
          </button>
          <button 
            onClick={() => { setActiveTab('settings'); resetForm(); }}
            className={cn(
              "px-6 py-4 text-sm font-bold transition-all border-b-2",
              activeTab === 'settings' ? "border-blue-500 text-blue-500" : "border-transparent text-gray-400 hover:text-gray-600"
            )}
          >
            網站設定
          </button>
          <button 
            onClick={() => {
              handleConfirm('確定要重置所有商品為預設值嗎？這將清除您目前的所有修改。', () => {
                setProducts(DEFAULT_PRODUCTS);
                setCategories(['全部', '服裝', '數碼', '家居', '美妝']);
                localStorage.removeItem('products');
                localStorage.removeItem('categories');
                showToast('已重置為預設商品與分類', 'success');
              });
            }}
            className="px-6 py-4 text-sm font-bold text-red-400 hover:text-red-500 transition-all border-b-2 border-transparent"
          >
            重置預設
          </button>
          {activeTab === 'edit' && (
            <button className="px-6 py-4 text-sm font-bold border-b-2 border-blue-500 text-blue-500">
              編輯商品
            </button>
          )}
          {activeTab === 'bulk' && (
            <button className="px-6 py-4 text-sm font-bold border-b-2 border-blue-500 text-blue-500">
              批量編輯
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'list' && (
            <div className="space-y-6">
              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="搜尋商品名稱..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-xl focus:bg-white focus:ring-2 ring-blue-500 transition-all outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl">
                  <Filter size={16} className="text-gray-400" />
                  <select 
                    value={filterCategory}
                    onChange={e => setFilterCategory(e.target.value)}
                    className="bg-transparent text-sm font-medium outline-none"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedIds.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-2xl"
                >
                  <span className="text-sm font-bold text-blue-600">已選取 {selectedIds.length} 項商品</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setBulkFormData({
                          price: '',
                          category: categories[1] || '服裝',
                          promoLabel: '',
                          promoSubLabel: '',
                          sizeChart: '',
                          isNew: false,
                          updatePrice: false,
                          updateCategory: false,
                          updatePromoLabel: false,
                          updatePromoSubLabel: false,
                          updateSizeChart: false,
                          updateIsNew: false,
                        });
                        setActiveTab('bulk');
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition-all flex items-center gap-2"
                    >
                      <Edit3 size={16} />
                      批量編輯
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-all flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      批量刪除
                    </button>
                  </div>
                </motion.div>
              )}

              {/* List */}
              <div className="flex items-center gap-3 px-2 py-2 mb-2">
                <div 
                  onClick={() => {
                    if (selectedIds.length === filteredAdminProducts.length && filteredAdminProducts.length > 0) {
                      setSelectedIds([]);
                    } else {
                      setSelectedIds(filteredAdminProducts.map(p => p.id));
                    }
                  }}
                  className={cn(
                    "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer",
                    selectedIds.length === filteredAdminProducts.length && filteredAdminProducts.length > 0 ? "bg-blue-500 border-blue-500" : "border-gray-200"
                  )}
                >
                  {selectedIds.length === filteredAdminProducts.length && filteredAdminProducts.length > 0 && <CheckCircle2 size={14} className="text-white" />}
                </div>
                <span 
                  className="text-sm font-bold text-gray-600 cursor-pointer select-none" 
                  onClick={() => {
                    if (selectedIds.length === filteredAdminProducts.length && filteredAdminProducts.length > 0) {
                      setSelectedIds([]);
                    } else {
                      setSelectedIds(filteredAdminProducts.map(p => p.id));
                    }
                  }}
                >
                  全選
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {filteredAdminProducts.map(p => (
                  <div 
                    key={p.id} 
                    className={cn(
                      "group flex items-center gap-4 p-4 border rounded-2xl transition-all",
                      selectedIds.includes(p.id) ? "border-blue-500 bg-blue-50/50" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                    )}
                  >
                    <div 
                      onClick={() => {
                        setSelectedIds(prev => 
                          prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id]
                        );
                      }}
                      className={cn(
                        "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer",
                        selectedIds.includes(p.id) ? "bg-blue-500 border-blue-500" : "border-gray-200"
                      )}
                    >
                      {selectedIds.includes(p.id) && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                    <img src={p.imgs[0]} alt="" className="w-16 h-16 object-cover rounded-xl shadow-sm" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded uppercase">
                          {p.category}
                        </span>
                      </div>
                      <h4 className="font-bold truncate text-gray-800">{p.name}</h4>
                      <p className="text-sm font-bold text-red-500">¥{Math.floor(p.price)}</p>
                    </div>
                    <button 
                      onClick={() => startEdit(p)}
                      className="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <Edit3 size={20} />
                    </button>
                  </div>
                ))}
                {filteredAdminProducts.length === 0 && (
                  <div className="text-center py-20 text-gray-400">
                    <Package size={48} className="mx-auto mb-4 opacity-20" />
                    <p>找不到符合條件的商品</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'bulk' && (
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-500 text-white rounded-2xl">
                  <Edit3 size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">批量編輯商品</h3>
                  <p className="text-gray-400">正在編輯 {selectedIds.length} 個選中的商品</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Price */}
                <div className="p-6 bg-gray-50 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 font-bold text-gray-700">
                      <input 
                        type="checkbox" 
                        checked={bulkFormData.updatePrice}
                        onChange={e => setBulkFormData(prev => ({ ...prev, updatePrice: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                      更新價格
                    </label>
                  </div>
                  {bulkFormData.updatePrice && (
                    <input 
                      type="number" 
                      placeholder="輸入新價格..."
                      value={bulkFormData.price}
                      onChange={e => setBulkFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 ring-blue-500 outline-none transition-all"
                    />
                  )}
                </div>

                {/* Category */}
                <div className="p-6 bg-gray-50 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 font-bold text-gray-700">
                      <input 
                        type="checkbox" 
                        checked={bulkFormData.updateCategory}
                        onChange={e => setBulkFormData(prev => ({ ...prev, updateCategory: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                      更新分類
                    </label>
                  </div>
                  {bulkFormData.updateCategory && (
                    <select 
                      value={bulkFormData.category}
                      onChange={e => setBulkFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 ring-blue-500 outline-none transition-all"
                    >
                      {categories.filter(c => c !== '全部').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  )}
                </div>

                {/* Promo Labels */}
                <div className="p-6 bg-gray-50 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 font-bold text-gray-700">
                      <input 
                        type="checkbox" 
                        checked={bulkFormData.updatePromoLabel}
                        onChange={e => setBulkFormData(prev => ({ ...prev, updatePromoLabel: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                      更新促銷標籤 (主)
                    </label>
                  </div>
                  {bulkFormData.updatePromoLabel && (
                    <div className="space-y-2">
                      <input 
                        type="text" 
                        placeholder="例如：限時直降15元"
                        value={bulkFormData.promoLabel}
                        onChange={e => setBulkFormData(prev => ({ ...prev, promoLabel: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 ring-blue-500 outline-none transition-all"
                      />
                      {bulkFormData.promoLabel && (
                        <div className="origin-left opacity-80">
                          <PromoBadge label={bulkFormData.promoLabel} subLabel={bulkFormData.promoSubLabel} />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-4 flex items-center justify-between">
                    <label className="flex items-center gap-2 font-bold text-gray-700">
                      <input 
                        type="checkbox" 
                        checked={bulkFormData.updatePromoSubLabel}
                        onChange={e => setBulkFormData(prev => ({ ...prev, updatePromoSubLabel: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                      更新促銷標籤 (副)
                    </label>
                  </div>
                  {bulkFormData.updatePromoSubLabel && (
                    <input 
                      type="text" 
                      placeholder="例如：限購1件!"
                      value={bulkFormData.promoSubLabel}
                      onChange={e => setBulkFormData(prev => ({ ...prev, promoSubLabel: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 ring-blue-500 outline-none transition-all"
                    />
                  )}
                </div>

                {/* Is New */}
                <div className="p-6 bg-gray-50 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 font-bold text-gray-700">
                      <input 
                        type="checkbox" 
                        checked={bulkFormData.updateSizeChart}
                        onChange={e => setBulkFormData(prev => ({ ...prev, updateSizeChart: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                      更新尺寸對照表
                    </label>
                  </div>
                  {bulkFormData.updateSizeChart && (
                    <SizeChartEditor 
                      value={bulkFormData.sizeChart} 
                      onChange={val => setBulkFormData(prev => ({ ...prev, sizeChart: val }))} 
                    />
                  )}
                </div>

                {/* Is Hot */}
                <div className="p-6 bg-gray-50 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 font-bold text-gray-700">
                      <input 
                        type="checkbox" 
                        checked={bulkFormData.updateIsHot}
                        onChange={e => setBulkFormData(prev => ({ ...prev, updateIsHot: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                      更新「HOT」狀態
                    </label>
                  </div>
                  {bulkFormData.updateIsHot && (
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setBulkFormData(prev => ({ ...prev, isHot: !prev.isHot }))}
                        className={cn(
                          "flex-1 py-3 rounded-2xl font-bold transition-all border-2",
                          bulkFormData.isHot ? "bg-red-500 border-red-500 text-white" : "bg-white border-gray-200 text-gray-400"
                        )}
                      >
                        {bulkFormData.isHot ? '設為HOT' : '取消HOT'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setActiveTab('list')}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={handleBulkUpdate}
                  className="flex-1 py-4 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all"
                >
                  確認批量更新
                </button>
              </div>
            </div>
          )}

          {(activeTab === 'add' || activeTab === 'edit') && (
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="flex items-center gap-4 mb-6">
                <button 
                  onClick={() => { setActiveTab('list'); resetForm(); }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <h3 className="text-lg font-bold">
                  {activeTab === 'add' ? '批量新增商品' : `編輯商品: ${editingProduct?.name}`}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 1. Images Section */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                    {activeTab === 'add' ? '商品圖片 (可多選)' : '新增圖片'}
                  </label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      disabled={isUploading}
                      onChange={async e => {
                        const selectedFiles = e.target.files;
                        if (!selectedFiles) return;
                        
                        setIsUploading(true);
                        const newImgs: string[] = [];
                        
                        try {
                          for (let i = 0; i < selectedFiles.length; i++) {
                            const file = selectedFiles[i];
                            const base64 = await new Promise<string>((resolve, reject) => {
                              const reader = new FileReader();
                              reader.onload = ev => {
                                const img = new Image();
                                img.onload = () => {
                                  const canvas = document.createElement('canvas');
                                  let width = img.width;
                                  let height = img.height;
                                  
                                  // Max dimension 1200px
                                  const MAX_DIM = 1200;
                                  if (width > height && width > MAX_DIM) {
                                    height *= MAX_DIM / width;
                                    width = MAX_DIM;
                                  } else if (height > MAX_DIM) {
                                    width *= MAX_DIM / height;
                                    height = MAX_DIM;
                                  }
                                  
                                  canvas.width = width;
                                  canvas.height = height;
                                  const ctx = canvas.getContext('2d');
                                  if (!ctx) {
                                    resolve(ev.target?.result as string);
                                    return;
                                  }
                                  ctx.drawImage(img, 0, 0, width, height);
                                  // Compress to JPEG with 0.8 quality
                                  resolve(canvas.toDataURL('image/jpeg', 0.8));
                                };
                                img.onerror = () => resolve(ev.target?.result as string);
                                img.src = ev.target?.result as string;
                              };
                              reader.onerror = reject;
                              reader.readAsDataURL(file);
                            });
                            
                            const pureBase64 = base64.split(',')[1];
                            // Force .jpg extension since we compress to jpeg
                            const fileName = `${Date.now()}_${file.name.replace(/\.[^/.]+$/, "")}.jpg`;
                            
                            const res = await globalThis.fetch('/api/upload-image', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ content: pureBase64, fileName })
                            });
                            
                            if (res.ok) {
                              const data = await res.json();
                              newImgs.push(data.url);
                            } else {
                              let errorMessage = `HTTP ${res.status}`;
                              const text = await res.text();
                              try {
                                const err = JSON.parse(text);
                                errorMessage = err.message || errorMessage;
                              } catch (e) {
                                errorMessage = text.substring(0, 100) || errorMessage;
                              }
                              showToast(`圖片 ${file.name} 上傳失敗: ${errorMessage}`, 'error');
                              throw new Error(`Upload failed: ${errorMessage}`);
                            }
                          }
                          setFormData(prev => ({ ...prev, imgs: [...prev.imgs, ...newImgs] }));
                        } catch (err) {
                          console.error('Upload error:', err);
                          showToast('上傳過程中發生錯誤', 'error');
                        } finally {
                          setIsUploading(false);
                          e.target.value = '';
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                    />
                    <div className={cn(
                      "border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 group-hover:border-blue-400 transition-colors",
                      isUploading && "opacity-50"
                    )}>
                      {isUploading ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                          <Zap className="text-blue-500" size={32} />
                        </motion.div>
                      ) : (
                        <Upload className="text-gray-300 group-hover:text-blue-500" size={32} />
                      )}
                      <p className="text-sm text-gray-500">
                        {isUploading ? '正在上傳至 GitHub...' : '點擊或拖曳圖片至此'}
                      </p>
                    </div>
                  </div>
                </div>

                {formData.imgs.length > 0 && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">已選取圖片</label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {formData.imgs.map((img, idx) => (
                        <div key={idx} className="relative group flex-shrink-0">
                          <img src={img} alt="" className="w-20 h-20 object-cover rounded-xl" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 rounded-xl transition-opacity">
                            <button 
                              type="button"
                              onClick={() => {
                                if (idx > 0) {
                                  const newImgs = [...formData.imgs];
                                  [newImgs[idx - 1], newImgs[idx]] = [newImgs[idx], newImgs[idx - 1]];
                                  setFormData(prev => ({ ...prev, imgs: newImgs }));
                                }
                              }}
                              className="text-white hover:text-blue-300 p-1"
                              disabled={idx === 0}
                            >
                              <ChevronLeft size={16} />
                            </button>
                            <button 
                              type="button"
                              onClick={() => {
                                if (idx < formData.imgs.length - 1) {
                                  const newImgs = [...formData.imgs];
                                  [newImgs[idx], newImgs[idx + 1]] = [newImgs[idx + 1], newImgs[idx]];
                                  setFormData(prev => ({ ...prev, imgs: newImgs }));
                                }
                              }}
                              className="text-white hover:text-blue-300 p-1"
                              disabled={idx === formData.imgs.length - 1}
                            >
                              <ChevronRight size={16} />
                            </button>
                            <button 
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, imgs: prev.imgs.filter((_, i) => i !== idx) }))}
                              className="text-white hover:text-red-300 p-1"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Category & Status Section */}
                <div className="sm:col-span-2 pt-4 border-t border-gray-100">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">商品分類</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {categories.filter(c => c !== '全部').map(c => (
                      <button
                        key={c}
                        onClick={() => setFormData(prev => ({ ...prev, category: c }))}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                          formData.category === c ? "bg-blue-500 text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.isNew}
                        onChange={e => setFormData(prev => ({ ...prev, isNew: e.target.checked }))}
                        className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-sm font-bold text-gray-700">標記為新品</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.isHot}
                        onChange={e => setFormData(prev => ({ ...prev, isHot: e.target.checked }))}
                        className="w-5 h-5 rounded border-gray-300 text-red-500 focus:ring-red-500"
                      />
                      <span className="text-sm font-bold text-gray-700">標記為HOT</span>
                    </label>
                  </div>
                </div>

                {/* 3. Basic Info Section */}
                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                      {activeTab === 'add' ? '商品名稱 (逗號分隔)' : '商品名稱'}
                    </label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={activeTab === 'add' ? "例：商品1, 商品2" : "輸入商品名稱"}
                      className="w-full bg-gray-50 border-transparent rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 ring-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                      {activeTab === 'add' ? '商品描述 (逗號分隔)' : '商品描述'}
                    </label>
                    <textarea 
                      value={formData.description}
                      onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder={activeTab === 'add' ? "例：描述1, 描述2" : "輸入商品描述"}
                      rows={3}
                      className="w-full bg-gray-50 border-transparent rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 ring-blue-500 outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">商品價格 (逗號分隔)</label>
                    <input 
                      type="text" 
                      value={formData.price}
                      onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder={activeTab === 'add' ? "例：99, 199" : "輸入價格"}
                      className="w-full bg-gray-50 border-transparent rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 ring-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                      {activeTab === 'add' ? '促銷標籤 (紅底, 逗號分隔)' : '促銷標籤 (紅底)'}
                    </label>
                    <input 
                      type="text" 
                      value={formData.promoLabel}
                      onChange={e => setFormData(prev => ({ ...prev, promoLabel: e.target.value }))}
                      placeholder={activeTab === 'add' ? "例：限時直降15元, 限時特惠" : "例：限時直降15元"}
                      className="w-full bg-gray-50 border-transparent rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 ring-blue-500 outline-none transition-all"
                    />
                    {formData.promoLabel && (
                      <div className="mt-2 origin-left opacity-80">
                        <PromoBadge label={formData.promoLabel || '限時直降15元'} subLabel={formData.promoSubLabel || '限購1件!'} />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                      {activeTab === 'add' ? '促銷副標籤 (白底, 逗號分隔)' : '促銷副標籤 (白底)'}
                    </label>
                    <input 
                      type="text" 
                      value={formData.promoSubLabel}
                      onChange={e => setFormData(prev => ({ ...prev, promoSubLabel: e.target.value }))}
                      placeholder={activeTab === 'add' ? "例：限購1件!, 限量50台" : "例：限購1件!"}
                      className="w-full bg-gray-50 border-transparent rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 ring-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                      {activeTab === 'add' ? '商品編號 (逗號分隔)' : '商品編號'}
                    </label>
                    <input 
                      type="text" 
                      value={formData.sn}
                      onChange={e => setFormData(prev => ({ ...prev, sn: e.target.value }))}
                      placeholder={activeTab === 'add' ? "例：SN001, SN002" : "輸入商品編號"}
                      className="w-full bg-gray-50 border-transparent rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 ring-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                      {activeTab === 'add' ? '商品規格 (逗號分隔)' : '商品規格'}
                    </label>
                    <input 
                      type="text" 
                      value={formData.specs}
                      onChange={e => setFormData(prev => ({ ...prev, specs: e.target.value }))}
                      placeholder={activeTab === 'add' ? "例：S, M, L" : "輸入規格，以逗號分隔"}
                      className="w-full bg-gray-50 border-transparent rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* 4. Size Chart Section */}
                <div className="sm:col-span-2 pt-4 border-t border-gray-100">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                    {activeTab === 'add' ? '尺寸對照表 (HTML, 逗號分隔)' : '尺寸對照表'}
                  </label>
                  {activeTab === 'add' ? (
                    <textarea 
                      value={formData.sizeChart}
                      onChange={e => setFormData(prev => ({ ...prev, sizeChart: e.target.value }))}
                      placeholder="例：<table>...</table>, <table>...</table>"
                      rows={4}
                      className="w-full bg-gray-50 border-transparent rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 ring-blue-500 outline-none transition-all resize-none font-mono"
                    />
                  ) : (
                    <SizeChartEditor 
                      value={formData.sizeChart} 
                      onChange={val => setFormData(prev => ({ ...prev, sizeChart: val }))} 
                    />
                  )}
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={activeTab === 'add' ? handleBatchUpload : handleUpdateProduct}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all transform active:scale-[0.98]"
                >
                  {activeTab === 'add' ? '確認批量上傳' : '儲存修改'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="max-w-md mx-auto space-y-8 pb-12">
              <div className="flex items-center gap-4 mb-6">
                <button 
                  onClick={() => { setActiveTab('list'); resetForm(); }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <h3 className="text-lg font-bold">分類管理</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">新增分類</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      placeholder="輸入新分類名稱"
                      className="flex-1 bg-gray-50 border-transparent rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 ring-blue-500 outline-none transition-all"
                    />
                    <button 
                      onClick={() => {
                        if (newCategory && !categories.includes(newCategory)) {
                          setCategories([...categories, newCategory]);
                          setNewCategory('');
                          showToast(`分類「${newCategory}」已新增`, 'success');
                        } else if (categories.includes(newCategory)) {
                          showToast('該分類已存在', 'info');
                        }
                      }}
                      className="px-6 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all"
                    >
                      新增
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">現有分類</label>
                  <div className="grid grid-cols-1 gap-2">
                    {categories.filter(c => c !== '全部').map(c => (
                      <div key={c} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-gray-100 transition-all">
                        <span className="font-bold text-gray-700">{c}</span>
                        <button 
                          onClick={() => {
                            handleConfirm(`確定要刪除「${c}」分類嗎？`, () => {
                              setCategories(categories.filter(cat => cat !== c));
                              showToast(`分類「${c}」已刪除`, 'success');
                            });
                          }}
                          className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-8 pb-12">
              <div className="flex items-center gap-4 mb-6">
                <button 
                  onClick={() => { setActiveTab('list'); resetForm(); }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <h3 className="text-lg font-bold">網站設定</h3>
              </div>

              <div className="space-y-8">
                {/* 1. Cart & Promotion Section */}
                <div className="p-8 bg-gray-50 rounded-[2.5rem] space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">開啟購物車功能</label>
                      <button
                        onClick={() => setSettingsFormData(prev => ({ ...prev, isCartEnabled: !prev.isCartEnabled }))}
                        className={cn(
                          "w-12 h-6 rounded-full transition-all relative",
                          settingsFormData.isCartEnabled ? "bg-blue-500" : "bg-gray-300"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                          settingsFormData.isCartEnabled ? "left-7" : "left-1"
                        )} />
                      </button>
                    </div>

                    <div className="pt-4 border-t border-gray-200/50">
                      <div className="flex items-center justify-between mb-6">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">開啟優惠折抵</label>
                        <button
                          onClick={() => setSettingsFormData(prev => ({ ...prev, enablePromotion: !prev.enablePromotion }))}
                          className={cn(
                            "w-12 h-6 rounded-full transition-all relative",
                            settingsFormData.enablePromotion ? "bg-red-500" : "bg-gray-300"
                          )}
                        >
                          <div className={cn(
                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                            settingsFormData.enablePromotion ? "left-7" : "left-1"
                          )} />
                        </button>
                      </div>
                      {settingsFormData.enablePromotion && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">優惠活動名稱</label>
                            <input 
                              type="text" 
                              value={settingsFormData.promotionName || ''}
                              onChange={e => setSettingsFormData(prev => ({ ...prev, promotionName: e.target.value }))}
                              placeholder="例：全館滿額折抵"
                              className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 ring-blue-500 outline-none transition-all shadow-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">折抵金額 (元)</label>
                            <input 
                              type="number" 
                              value={settingsFormData.promotionAmount || 0}
                              onChange={e => setSettingsFormData(prev => ({ ...prev, promotionAmount: Number(e.target.value) }))}
                              className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 ring-blue-500 outline-none transition-all shadow-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Shipping Section */}
                <div className="p-8 bg-gray-50 rounded-[2.5rem] space-y-6">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">運費設定</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">單件運費 (元)</label>
                      <input 
                        type="number" 
                        value={settingsFormData.shippingFee || 0}
                        onChange={e => setSettingsFormData(prev => ({ ...prev, shippingFee: Number(e.target.value) }))}
                        className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 ring-blue-500 outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">滿額免運門檻 (元)</label>
                      <input 
                        type="number" 
                        value={settingsFormData.freeShippingThreshold || 0}
                        onChange={e => setSettingsFormData(prev => ({ ...prev, freeShippingThreshold: Number(e.target.value) }))}
                        className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 ring-blue-500 outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Order Footer Section */}
                <div className="p-8 bg-gray-50 rounded-[2.5rem] space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">訂單生成頁底部文字 (支援 HTML)</label>
                    <textarea 
                      value={settingsFormData.orderFooterText || ''}
                      onChange={e => setSettingsFormData(prev => ({ ...prev, orderFooterText: e.target.value }))}
                      placeholder="例：📍前往IG將圖片發給九零統計結帳📍"
                      rows={3}
                      className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 ring-blue-500 outline-none transition-all shadow-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">訂單生成頁底部副文字 (支援 HTML)</label>
                    <textarea 
                      value={settingsFormData.orderFooterSubText || ''}
                      onChange={e => setSettingsFormData(prev => ({ ...prev, orderFooterSubText: e.target.value }))}
                      placeholder="例：- 此專區僅用於預購商品的訂單生成 -"
                      rows={2}
                      className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 ring-blue-500 outline-none transition-all shadow-sm resize-none"
                    />
                  </div>
                </div>

                {/* 4. Logo, Title & Announcement Section */}
                <div className="p-8 bg-gray-50 rounded-[2.5rem] space-y-8">
                  {/* Logo */}
                  <div className="space-y-6">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">網站 Logo</label>
                    <div className="flex items-center gap-8">
                      <div className="w-24 h-24 bg-white rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shadow-inner">
                        {settingsFormData.logoUrl ? (
                          <img src={settingsFormData.logoUrl} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                        ) : (
                          <Package size={32} className="text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex gap-3">
                          <label className="flex-1">
                            <div className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-sm cursor-pointer hover:bg-gray-50 transition-all shadow-sm">
                              <Upload size={18} />
                              上傳 Logo
                            </div>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setIsUploading(true);
                                try {
                                  const base64 = await new Promise<string>((resolve, reject) => {
                                    const reader = new FileReader();
                                    reader.onload = ev => {
                                      const img = new Image();
                                      img.onload = () => {
                                        const canvas = document.createElement('canvas');
                                        let width = img.width;
                                        let height = img.height;
                                        const MAX_DIM = 800;
                                        if (width > height && width > MAX_DIM) {
                                          height *= MAX_DIM / width;
                                          width = MAX_DIM;
                                        } else if (height > MAX_DIM) {
                                          width *= MAX_DIM / height;
                                          height = MAX_DIM;
                                        }
                                        canvas.width = width;
                                        canvas.height = height;
                                        const ctx = canvas.getContext('2d');
                                        if (!ctx) {
                                          resolve(ev.target?.result as string);
                                          return;
                                        }
                                        ctx.drawImage(img, 0, 0, width, height);
                                        resolve(canvas.toDataURL('image/jpeg', 0.8));
                                      };
                                      img.onerror = () => resolve(ev.target?.result as string);
                                      img.src = ev.target?.result as string;
                                    };
                                    reader.onerror = reject;
                                    reader.readAsDataURL(file);
                                  });
                                  const pureBase64 = base64.split(',')[1];
                                  const fileName = `logo_${Date.now()}_${file.name.replace(/\.[^/.]+$/, "")}.jpg`;
                                  const res = await globalThis.fetch('/api/upload-image', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ content: pureBase64, fileName })
                                  });
                                  if (res.ok) {
                                    const data = await res.json();
                                    setSettingsFormData(prev => ({ ...prev, logoUrl: data.url }));
                                    showToast('Logo 上傳成功', 'success');
                                  } else {
                                    let errorMessage = `HTTP ${res.status}`;
                                    const text = await res.text();
                                    try {
                                      const err = JSON.parse(text);
                                      errorMessage = err.message || errorMessage;
                                    } catch (e) {
                                      errorMessage = text.substring(0, 100) || errorMessage;
                                    }
                                    showToast(`Logo 上傳失敗: ${errorMessage}`, 'error');
                                    throw new Error(`Upload failed: ${errorMessage}`);
                                  }
                                } catch (err) {
                                  console.error(err);
                                  showToast('上傳出錯', 'error');
                                } finally {
                                  setIsUploading(false);
                                }
                              }}
                            />
                          </label>
                          {settingsFormData.logoUrl && (
                            <button 
                              onClick={() => setSettingsFormData(prev => ({ ...prev, logoUrl: '' }))}
                              className="px-6 py-3 bg-red-50 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-100 transition-all"
                            >
                              移除
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium">建議尺寸: 200x200px, 支援 PNG, JPG, SVG</p>
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="pt-8 border-t border-gray-200/50">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">網站標題</label>
                    <input 
                      type="text" 
                      value={settingsFormData.title}
                      onChange={e => setSettingsFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="輸入網站標題"
                      className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-lg font-black tracking-tight focus:ring-2 ring-blue-500 outline-none transition-all shadow-sm"
                    />
                  </div>

                  {/* Announcement (Subtitle) */}
                  <div className="pt-8 border-t border-gray-200/50">
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">公告欄文字 (副標題)</label>
                      <button 
                        onClick={() => setSettingsFormData(prev => ({ ...prev, subtitle: [...prev.subtitle, ''] }))}
                        className="flex items-center gap-1 text-blue-500 font-bold text-xs hover:underline"
                      >
                        <Plus size={14} />
                        新增一行
                      </button>
                    </div>
                    <div className="space-y-3">
                      {settingsFormData.subtitle.map((line, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            type="text" 
                            value={line}
                            onChange={e => {
                              const newSubtitle = [...settingsFormData.subtitle];
                              newSubtitle[idx] = e.target.value;
                              setSettingsFormData(prev => ({ ...prev, subtitle: newSubtitle }));
                            }}
                            placeholder={`公告第 ${idx + 1} 行`}
                            className="flex-1 bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 ring-blue-500 outline-none transition-all shadow-sm"
                          />
                          <button 
                            onClick={() => {
                              const newSubtitle = settingsFormData.subtitle.filter((_, i) => i !== idx);
                              setSettingsFormData(prev => ({ ...prev, subtitle: newSubtitle }));
                            }}
                            className="p-4 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4">
                  <button 
                    onClick={() => {
                      setSiteSettings(settingsFormData);
                      onSaveSettings(settingsFormData);
                    }}
                    disabled={isSyncing || isUploading}
                    className="w-full py-5 bg-blue-500 text-white rounded-[2rem] font-black text-sm tracking-[0.2em] uppercase hover:bg-blue-600 transition-all shadow-xl shadow-blue-100 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSyncing ? <Zap size={18} className="animate-spin" /> : <Download size={18} />}
                    {isSyncing ? '同步中...' : '保存設定到 GitHub'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
