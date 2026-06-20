import { test, describe } from "node:test";
import assert from "node:assert/strict";

import ShoppingCart from "./shoppingCart.js";
import PricingRules from "./pricingRules.js";
import { SCENARIOS } from "./constants.js";

function buildPricingRules() {
  const pricingRules = new PricingRules();
  return [
    pricingRules.promoCodeDiscount("I<3AMAYSIM", 10),
    pricingRules.xForYDeal("ult_small", 3, 2),
    pricingRules.bulkDiscount("ult_large", 3, 39.9),
    pricingRules.addBundle("ult_medium", "1gb"),
  ];
}

function cartWith(adds) {
  const cart = new ShoppingCart(buildPricingRules());
  for (const [code, promo] of adds) {
    cart.add(code, promo);
  }
  return cart;
}

describe("ShoppingCart - scenarios from the brief", () => {
  for (const { title, adds, expectedTotal } of SCENARIOS) {
    test(`${title} totals ${expectedTotal}`, () => {
      const cart = cartWith(adds);
      assert.equal(cart.total, expectedTotal);
    });
  }
});

describe("ShoppingCart - basic behaviour", () => {
  test("an empty cart totals 0", () => {
    const cart = new ShoppingCart(buildPricingRules());
    assert.equal(cart.total, 0);
    assert.deepEqual(cart.items, []);
  });

  test("adding an unknown product code is a no-op", () => {
    const cart = cartWith([["does_not_exist"]]);
    assert.equal(cart.total, 0);
    assert.deepEqual(cart.items, []);
  });

  test("groups identical products and sums quantity", () => {
    const cart = cartWith([["ult_medium"], ["ult_medium"]]);
    const medium = cart.items.find((i) => i.code === "ult_medium");
    assert.equal(medium.quantity, 2);
  });

  test("total is rounded to two decimal places", () => {
    const cart = cartWith([["ult_small"], ["1gb", "I<3AMAYSIM"]]);
    // 24.90 + 9.90 = 34.80, minus 10% = 31.32
    assert.equal(cart.total, 31.32);
  });
});

describe("PricingRules.xForYDeal (3 for 2 on ult_small @ 24.90)", () => {
  test("no discount below the buy threshold", () => {
    const cart = cartWith([["ult_small"], ["ult_small"]]);
    assert.equal(cart.total, 49.8);
  });

  test("one group of three charges for two", () => {
    const cart = cartWith([["ult_small"], ["ult_small"], ["ult_small"]]);
    assert.equal(cart.total, 49.8); // pay for 2 of 3
  });

  test("two full groups give two free units", () => {
    const cart = cartWith([
      ["ult_small"], ["ult_small"], ["ult_small"],
      ["ult_small"], ["ult_small"], ["ult_small"],
    ]);
    // 6 units, 2 free -> pay for 4 = 99.60
    assert.equal(cart.total, 99.6);
  });
});

describe("PricingRules.bulkDiscount (ult_large -> 39.90 each when qty > 3)", () => {
  test("no discount at exactly the minimum quantity", () => {
    const cart = cartWith([["ult_large"], ["ult_large"], ["ult_large"]]);
    assert.equal(cart.total, 134.7); // 3 x 44.90
  });

  test("discount applies to every unit once threshold is exceeded", () => {
    const cart = cartWith([
      ["ult_large"], ["ult_large"], ["ult_large"], ["ult_large"],
    ]);
    assert.equal(cart.total, 159.6); // 4 x 39.90
  });
});

describe("PricingRules.addBundle (ult_medium grants a free 1gb)", () => {
  test("adds a free 1gb data-pack without changing the total", () => {
    const cart = cartWith([["ult_medium"]]);
    assert.equal(cart.total, 29.9);

    const freebie = cart.items.find((i) => i.code === "1gb");
    assert.ok(freebie, "expected a free 1gb item in the cart");
    assert.equal(freebie.price, 0);
    assert.equal(freebie.name, "Free 1 GB Data-pack");
  });
});

describe("PricingRules.promoCodeDiscount (I<3AMAYSIM = 10% off)", () => {
  test("a wrong promo code applies no discount", () => {
    const cart = cartWith([["ult_small", "WRONG_CODE"]]);
    assert.equal(cart.total, 24.9);
  });

  test("a valid promo code takes 10% off the subtotal", () => {
    const cart = cartWith([["ult_small", "I<3AMAYSIM"]]);
    assert.equal(cart.total, 22.41); // 24.90 - 10%
  });
});
