import { Product } from '../types';

// ==============================================
// 纯前端本地商品库 - 无数据库、存在浏览器 localStorage
// ==============================================

// 1. 从本地存储读取商品库，如果没有则使用空数组
let productLibrary: Product[] = JSON.parse(localStorage.getItem('productLibrary') || '[]');

// 2. 保存商品库到本地（自动调用）
function saveProductLibrary() {
  localStorage.setItem('productLibrary', JSON.stringify(productLibrary));
}

// 3. 添加单个商品
export function addProduct(product: Product) {
  // 自动生成唯一 ID
  product.id = product.id || Date.now() + Math.random().toString(36).slice(2, 8);
  productLibrary.push(product);
  saveProductLibrary();
}

// 4. 批量添加商品（用于后台批量上传）
export function batchAddProducts(productsArray: Product[]) {
  productsArray.forEach(item => {
    item.id = Date.now() + Math.random().toString(36).slice(2, 8);
    productLibrary.push(item);
  });
  saveProductLibrary();
}

// 5. 删除单个商品
export function deleteProduct(productId: number | string) {
  productLibrary = productLibrary.filter(p => p.id !== productId);
  saveProductLibrary();
}

// 6. 批量删除商品
export function batchDeleteProducts(idArray: (number | string)[]) {
  productLibrary = productLibrary.filter(p => !idArray.includes(p.id));
  saveProductLibrary();
}

// 7. 获取所有商品
export function getAllProducts() {
  return [...productLibrary]; // 返回副本防止外部篡改
}

// 8. 根据分类筛选商品
export function getProductsByCategory(category: string) {
  if (category === '全部') return [...productLibrary];
  return productLibrary.filter(p => p.category === category);
}

// 9. 根据 ID 获取单个商品详情
export function getProductById(productId: number | string) {
  return productLibrary.find(p => p.id === productId);
}

// 10. 清空商品库
export function clearProductLibrary() {
  productLibrary = [];
  saveProductLibrary();
}
