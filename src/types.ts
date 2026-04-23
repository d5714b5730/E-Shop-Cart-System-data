export interface Product {
  id: number | string;
  name: string;
  sn: string;
  price: number;
  category: string;
  imgs: string[];
  description: string;
  isHot?: boolean;
  hidden?: boolean;
  promoLabel?: string; // e.g., "限时直降15元"
  promoSubLabel?: string; // e.g., "限购1件!"
  colors?: string[]; // e.g., ["黑色", "白色"]
  colorPrices?: Record<string, number>; // color-specific prices
  specs?: string[]; // e.g., ["S", "M", "L"] or ["Red", "Blue"]
  sizeChart?: string; // Markdown or HTML string for size table
}

export interface CartItem {
  id: number | string;
  name: string;
  sn: string;
  price: number; // This will be the effective price
  category: string;
  imgs: string[];
  description: string;
  isHot?: boolean;
  promoLabel?: string;
  promoSubLabel?: string;
  colors?: string[];
  colorPrices?: Record<string, number>;
  specs?: string[];
  sizeChart?: string;
  num: number;
  selectedSpec?: string;
  selectedColor?: string;
}

export interface Order {
  items: CartItem[];
  total: number;
  shippingFee?: number;
  promotionName?: string;
  promotionAmount?: number;
  date: string;
}

export interface SiteSettings {
  title: string;
  subtitle: string[];
  logoUrl: string;
  orderFooterText?: string;
  orderFooterSubText?: string;
  shippingFee?: number;
  freeShippingThreshold?: number;
  isCartEnabled?: boolean;
  enablePromotion?: boolean;
  promotionName?: string;
  promotionAmount?: number;
}
