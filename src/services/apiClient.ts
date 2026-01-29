import { createProduct, searchProducts as searchProductsDB, getProductsByIds as getProductsByIdsDB } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import type { Product, CreateProductSchema } from '@/types/database';

// ========================================
// MOCK DATA - Desktop gadgets in JPY
// ========================================
const MOCK_GADGETS: Omit<typeof CreateProductSchema._type, 'source_platform' | 'external_id'>[] = [
  {
    name: 'ASUS ProArt PA148CTC 15.6インチ モバイルディスプレイ',
    brand: 'ASUS',
    description: '軽量でポータブル。IPSパネルで正確な色再現。',
    price_jpy: 34800,
    image_url: 'https://m.media-amazon.com/images/I/51K6N0F3M4L.jpg',
    category: 'ディスプレイ',
  },
  {
    name: 'Keychron K6 Pro ワイヤレスメカニカルキーボード',
    brand: 'Keychron',
    description: 'コンパクト・ワイヤレス・美しいデザイン。',
    price_jpy: 9900,
    image_url: 'https://m.media-amazon.com/images/I/61RrQaJGHJL.jpg',
    category: 'キーボード',
  },
  {
    name: 'Logitech MX Master 3S ワイヤレスマウス',
    brand: 'Logitech',
    description: 'プロフェッショナル向けマウス。カスタマイズ可能ボタン。',
    price_jpy: 11900,
    image_url: 'https://m.media-amazon.com/images/I/61qbz5OW6dL.jpg',
    category: 'マウス',
  },
  {
    name: 'FLEXISPOT E7 電動昇降デスク 140cm',
    brand: 'FLEXISPOT',
    description: 'スタンディングデスク。モーターで自動昇降。',
    price_jpy: 29900,
    image_url: 'https://m.media-amazon.com/images/I/71hQhkCHDTL.jpg',
    category: 'デスク',
  },
  {
    name: 'Herman Miller Mirra 2 チェア',
    brand: 'Herman Miller',
    description: '高級オフィスチェア。長時間座り心地がよい。',
    price_jpy: 119800,
    image_url: 'https://m.media-amazon.com/images/I/517KZAH7wOL.jpg',
    category: 'チェア',
  },
  {
    name: 'Anker PowerWave 10W ワイヤレス充電器',
    brand: 'Anker',
    description: 'スマートフォン用ワイヤレス充電。高速充電対応。',
    price_jpy: 1980,
    image_url: 'https://m.media-amazon.com/images/I/51NkGXU0OfL.jpg',
    category: 'アクセサリ',
  },
  {
    name: 'RODE NT-USB+ マイク',
    brand: 'RODE',
    description: 'スタジオクオリティのUSBマイク。ポッドキャスト対応。',
    price_jpy: 22980,
    image_url: 'https://m.media-amazon.com/images/I/51SV2mHLqkL.jpg',
    category: 'オーディオ',
  },
  {
    name: 'BenQ SW240 24.1インチ カラーマネジメントディスプレイ',
    brand: 'BenQ',
    description: 'IPS液晶。正確な色域。クリエイター向け。',
    price_jpy: 39800,
    image_url: 'https://m.media-amazon.com/images/I/71KmLfYJtXL.jpg',
    category: 'ディスプレイ',
  },
  {
    name: 'Apple Magic Trackpad 3',
    brand: 'Apple',
    description: 'Macユーザー向け。Force Touch対応。',
    price_jpy: 15384,
    image_url: 'https://m.media-amazon.com/images/I/41jQhM3kaaL.jpg',
    category: 'トラックパッド',
  },
  {
    name: 'Nanoleaf Essentials Light Strips',
    brand: 'Nanoleaf',
    description: 'RGBアンビエント照明。スマート対応。',
    price_jpy: 8980,
    image_url: 'https://m.media-amazon.com/images/I/51C8SJ4ZIWL.jpg',
    category: '照明',
  },
  {
    name: 'Secretlab Magnus Pro Desk',
    brand: 'Secretlab',
    description: 'ゲーミングデスク。スチール製で堅牢。',
    price_jpy: 79900,
    image_url: 'https://m.media-amazon.com/images/I/61xY8pY0fXL.jpg',
    category: 'デスク',
  },
  {
    name: 'Sony WH-1000XM5 ワイヤレスヘッドフォン',
    brand: 'Sony',
    description: 'ノイズキャンセリング。高音質オーディオ。',
    price_jpy: 59400,
    image_url: 'https://m.media-amazon.com/images/I/51rKsvJWfrL.jpg',
    category: 'オーディオ',
  },
  {
    name: 'Ergotron LX モニターアーム',
    brand: 'Ergotron',
    description: 'ガス圧式で自由な調整。スタイリッシュ。',
    price_jpy: 24900,
    image_url: 'https://m.media-amazon.com/images/I/71n3jDELZAL.jpg',
    category: 'アクセサリ',
  },
  {
    name: 'Philips Hue Go ポータブル照明',
    brand: 'Philips',
    description: 'スマートライト。色調整可能。持ち運べる。',
    price_jpy: 10980,
    image_url: 'https://m.media-amazon.com/images/I/51vvCBKLfQL.jpg',
    category: '照明',
  },
  {
    name: 'Elgato Stream Deck MK.2',
    brand: 'Elgato',
    description: 'コンテンツクリエイター向けコントローラ。',
    price_jpy: 23980,
    image_url: 'https://m.media-amazon.com/images/I/51PuiG7uNpL.jpg',
    category: 'アクセサリ',
  },
];

// ========================================
// AFFILIATE URL GENERATION
// ========================================
function generateAffiliateUrl(
  baseUrl: string,
  source: 'amazon' | 'rakuten',
  affiliateId?: string
): string {
  if (!affiliateId) return baseUrl;

  if (source === 'amazon') {
    const url = new URL(baseUrl);
    url.searchParams.set('tag', affiliateId);
    return url.toString();
  }

  if (source === 'rakuten') {
    const url = new URL(baseUrl);
    url.searchParams.set('affiliateId', affiliateId);
    return url.toString();
  }

  return baseUrl;
}

// ========================================
// MOCK DATA INITIALIZATION
// ========================================
async function initializeMockProducts(): Promise<Product[]> {
  try {
    const existing = await searchProductsDB('', undefined, undefined, 1);
    if (existing && existing.length > 0) {
      // Already initialized
      return existing;
    }
  } catch (error) {
    // Ignore errors
  }

  const affiliateId = process.env.NEXT_PUBLIC_AFFILIATE_ID || 'test-affiliate-id';
  const products: Product[] = [];

  for (let i = 0; i < MOCK_GADGETS.length; i++) {
    const gadget = MOCK_GADGETS[i];
    const externalId = `MOCK-${i}`;
    const affiliateUrl = gadget.image_url
      ? generateAffiliateUrl(
          `https://amazon.co.jp/dp/${externalId}`,
          'amazon',
          affiliateId
        )
      : null;

    try {
      const product = await createProduct({
        source_platform: 'amazon',
        external_id: externalId,
        ...gadget,
        affiliate_url: affiliateUrl,
      });
      products.push(product);
    } catch (error) {
      // Product might already exist
      console.error(`Failed to create product ${externalId}:`, error);
    }
  }

  return products;
}

// ========================================
// SEARCH PRODUCTS
// ========================================
export async function searchProducts(
  keywords: string,
  maxPrice?: number,
  limit = 20
): Promise<Product[]> {
  // Ensure mock data is initialized
  await initializeMockProducts();

  // Search database
  return searchProductsDB(keywords, undefined, maxPrice, limit);
}

// ========================================
// SEARCH BY CATEGORY
// ========================================
export async function searchProductsByCategory(
  category: string,
  maxPrice?: number,
  limit = 20
): Promise<Product[]> {
  // Ensure mock data is initialized
  await initializeMockProducts();

  // Search database with category filter
  const query = supabase.from('products').select();

  let dbQuery = query.eq('category', category);

  if (maxPrice) {
    dbQuery = dbQuery.lte('price_jpy', maxPrice);
  }

  const { data, error } = await dbQuery.limit(limit);

  if (error) throw error;
  return data as Product[];
}

// ========================================
// GET PRODUCTS FOR RECOMMENDATION
// ========================================
export async function getProductsForRecommendation(
  budget: number,
  keywords: string[] = [],
  limit = 30
): Promise<Product[]> {
  // Ensure mock data is initialized
  await initializeMockProducts();

  const allKeywords = keywords.join(' ');
  const products = await searchProductsDB(allKeywords, undefined, budget, limit);

  return products.sort((a, b) => (a.price_jpy || 0) - (b.price_jpy || 0));
}

// ========================================
// BATCH GET PRODUCTS
// ========================================
export async function getProductsById(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  return getProductsByIdsDB(ids);
}

export { type Product } from '@/types/database';
