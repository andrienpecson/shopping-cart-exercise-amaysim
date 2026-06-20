import { round2 } from "./utils.js"
import { PRODUCTS } from "./constants.js";

export default class ShoppingCart {
  /**
   * @param {Array<(items: Array<object>, promoCode: string|null) => { deducted_price: number, free_products: Array<object> }>} pricingRules - The pricing rules to apply when calculating the total.
   */
  constructor(pricingRules) {
    this.cart_items = [];
    this.free_cart_items = [];
    this.pricingRules = pricingRules;
    this.promo_code = null;
  }

  /**
   * Adds a product to the cart by its code.
   * @param {string} productCode - The code of the product to add.
   * @param {string|null} [promoCode=null] - An optional promo code to record on the cart.
   * @returns {void}
   */
  add(productCode, promoCode = null) {
    const selectedProduct = PRODUCTS.find(({ code }) => code == productCode);
    if (!selectedProduct) {
      return;
    }

    const cartItems = [...this.cart_items];
    cartItems.push(selectedProduct);

    if (promoCode) {
      this.promo_code = promoCode;
    }

    this.cart_items = cartItems;
  }

  /**
   * returns paid cart items (purchased by the user) and free cart items (free products granted by the pricing rules)
   * @returns {Array<{ code: string, name: string, price: number, quantity: number }>} The grouped paid items followed by the grouped free items.
   */
  get items() {
    return [
      ...this._groupItems(this.cart_items),
      ...this._groupItems(this.free_cart_items),
    ];
  }

  /**
   * The subtotal of the cart. pricing-rule discount, rounded to two decimal places.
   * @returns {number} The final amount payable.
   */
  get total() {
    const subtotal = this.cart_items.reduce((sum, { price }) => sum + price, 0);
    return round2(subtotal - this._applyPricingRules());
  }

  /**
   * Groups a flat list of cart items by product code, summing quantities.
   * @param {Array<{ code: string, name: string, price: number }>} cartItems - The items to group.
   * @returns {Array<{ code: string, name: string, price: number, quantity: number }>} One entry per product code with its total quantity.
   */
  _groupItems(cartItems) {
    const itemsMap = {};

    for (const { code, name, price } of cartItems) {
      itemsMap[code] = {
        code,
        name,
        price,
        quantity: (itemsMap[code]?.quantity || 0) + 1
      }
    }

    return Object.values(itemsMap);
  }

  /**
   * Runs every pricing rule against the grouped cart items, calculating the total discount
   * and getting free products granted by the pricing rules.
   * @returns {number} The total amount to deduct from the subtotal.
   */
  _applyPricingRules() {
    let totalDeductedPrice = 0;
    let freeCartItems = [];

    for (const pricingRule of this.pricingRules) {
      const { deducted_price, free_products = [] } = pricingRule(this._groupItems(this.cart_items), this.promo_code);

      if (free_products.length) {
        freeCartItems = [...freeCartItems, ...free_products]
      }

      totalDeductedPrice += deducted_price;
    }

    this.free_cart_items = freeCartItems;
    return totalDeductedPrice;
  }
}