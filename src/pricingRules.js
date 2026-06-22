import { PRODUCTS } from "./constants.js";

export default class PricingRules {
  /**
   * Formats the result object returned by every pricing rule.
   * @param {number} deductedPrice - The total amount to deduct from the cart.
   * @param {Array<object>} [freeProducts=[]] - The products to add for free, if any.
   * @returns {{ deducted_price: number, free_products: Array<object> }} The pricing rule result.
   */
  _formatReturn(deductedPrice, freeProducts = []) {
    return {
      deducted_price: deductedPrice,
      free_products: freeProducts
    }
  }

  /**
   * Creates an "x for y" deal (example: buy 3 pay for 2).
   * @param {string} productCode - The code of the product the deal applies to.
   * @param {number} buy - The number of units that must be purchased to trigger the deal.
   * @param {number} pay - The number of units actually paid for within each group.
   * @returns {(items: Array<{ code: string, quantity: number, price: number, name: string }>) => { deducted_price: number, free_products: Array<object> }} A rule function that returns the discount for the matching cart items.
   */
  xForYDeal(productCode, buy = 0, pay = 0) {
    return (items) => {
      const { quantity = 0, price, name } = items.find(({ code }) => code === productCode) || {};

      if (quantity < buy) {
        return this._formatReturn(0);
      }

      // example: 7 SIMs with a 3-for-2 deal -> 2 full groups, 1 free per group = 2 free SIMs
      // subtract the price of 2 free SIMs
      const freeSims = Math.floor(quantity / buy) * (buy - pay);
      return this._formatReturn(freeSims * price)
    }
  }

  /**
   * Creates a bulk discount when more than `minQuantity` units are purchased (example: buy 3 for price of 39.90 each).
   * @param {string} productCode - The code of the product the discount applies to.
   * @param {number} minQuantity - The quantity that must be exceeded to trigger the discount.
   * @param {number} discountedPrice - The new per-unit price once the discount applies.
   * @returns {(items: Array<{ code: string, quantity: number, price: number, name: string }>) => { deducted_price: number, free_products: Array<object> }} A rule function that returns the discount for the matching cart items.
   */
  bulkDiscount(productCode, minQuantity = 0, discountedPrice = 0) {
    return (items) => {
      const { quantity = 0, price, name } = items.find(({ code }) => code === productCode) || {};

      if (quantity <= minQuantity || !discountedPrice) {
        return this._formatReturn(0);
      }

      // total saving: every unit updated from `price` to `discountedPrice`
      return this._formatReturn(quantity * (price - discountedPrice))
    }
  }

  /**
   * Creates a bundle deal. When the trigger product is in the cart, a free product is added.
   * @param {string} triggerProductCode - The code of the product that triggers the bundle.
   * @param {string} freeProductCode - The code of the product to add for free.
   * @returns {(items: Array<{ code: string, quantity: number, price: number, name: string }>) => { deducted_price: number, free_products: Array<object> }} A rule function that returns the free product code when triggered.
   */
  addBundle(triggerProductCode, freeProductCode) {
    return (items) => {
      const triggerProduct = items.find(({ code }) => code === triggerProductCode);
      const freeProduct = PRODUCTS.find(({ code }) => code === freeProductCode)

      if (!triggerProduct || !freeProduct) {
        return this._formatReturn(0);
      }

      // no price is deducted, instead one free product is added at zero price for every unit of the trigger product in the cart
      const freeProducts = Array.from({ length: triggerProduct.quantity }, () => ({ ...freeProduct, price: 0, name: `Free ${freeProduct.name}` }));
      return this._formatReturn(0, freeProducts)
    }
  }

  /**
   * When promocode is valid, apply the discount to cart subtotal by percent.
   * @param {string} code - The promo code that activates the discount.
   * @param {number} percent - The percentage (0-100) to discount the subtotal by.
   * @returns {(items: Array<{ price: number, quantity: number }>, promoCode: string) => { deducted_price: number, free_products: Array<object> }} A rule function that returns the discount when the promo code matches.
   */
  promoCodeDiscount(code, percent = 0) {
    return (items, promoCode) => {

      if (promoCode !== code || (percent > 100 || percent < 0)) {
        return this._formatReturn(0);
      }

      const subtotal = items.reduce((sum, { price, quantity }) => sum + price * quantity, 0);
      // saving is `percent`% of the subtotal
      return this._formatReturn(subtotal * (percent / 100));
    };
  }
}