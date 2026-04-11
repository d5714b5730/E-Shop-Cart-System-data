export interface Product {
  id: number | string;
  name: string;
  sn: string;
  price: number;
  category: string;
  imgs: string[];
  description: string;
  isHot?: boolean;
  isNew?: boolean;
  promoLabel?: string; // e.g., "限时直降15元"
  promoSubLabel?: string; // e.g., "限购1件!"
  specs?: string[]; // e.g., ["S", "M", "L"] or ["Red", "Blue"]
  sizeChart?: string; // Markdown or HTML string for size table
}

export interface CartItem extends Product {
  num: number;
  selectedSpec?: string;
}

export interface Order {
  items: CartItem[];
  total: number;
  shippingFee?: number;
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
}
