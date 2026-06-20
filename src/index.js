import ShoppingCart from "./shoppingCart.js";
import PricingRules from "./pricingRules.js";
import { formatMoney, displayCartItems } from "./utils.js"
import { SCENARIOS } from "./constants.js";

console.log("Starting: Amaysim Shopping Cart Exercise\n");

const pricingRules = new PricingRules();
const pricingRulesConfig = [
  pricingRules.promoCodeDiscount('I<3AMAYSIM', 10),
  pricingRules.xForYDeal('ult_small', 3, 2),
  pricingRules.bulkDiscount('ult_large', 3, 39.90),
  pricingRules.addBundle('ult_medium', '1gb')
];

for (let index = 0; index < SCENARIOS.length; index++) {
  const { title, adds, expectedTotal } = SCENARIOS[index];
  const cart = new ShoppingCart(pricingRulesConfig);

  for (const [code, promo] of adds) {
    cart.add(code, promo);
  }

  const pass = cart.total == expectedTotal;
  
  console.log(`${title} - ${pass ? 'PASS' : 'FAIL'}`);
  console.log(`Total: ${formatMoney(cart.total)} (expected ${formatMoney(expectedTotal)})`);
  console.log("Items:");
  console.log(`${displayCartItems(cart)}`);
  console.log('');
}

process.exit(0);