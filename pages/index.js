/**
 * Page Objects 統一匯出
 *
 * 方便在測試中一次 import 所有 Page Object
 * 使用方式：const { LoginPage, InventoryPage } = require('../pages');
 */
const { LoginPage } = require('./LoginPage');
const { InventoryPage } = require('./InventoryPage');

module.exports = {
  LoginPage,
  InventoryPage,
};
