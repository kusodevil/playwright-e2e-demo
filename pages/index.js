/**
 * Page Objects 統一匯出
 *
 * 方便在測試中一次 import 所有 Page Object
 * 使用方式：const { LoginPage, InventoryPage, CartPage, CheckoutPage } = require('../pages');
 */
const { LoginPage } = require('./LoginPage');
const { InventoryPage } = require('./InventoryPage');
const { CartPage } = require('./CartPage');
const { CheckoutPage } = require('./CheckoutPage');

module.exports = {
  LoginPage,
  InventoryPage,
  CartPage,
  CheckoutPage,
};
