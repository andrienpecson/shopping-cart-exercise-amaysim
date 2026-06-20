# Amaysim Shopping Cart Exercise

Amaysim is rebuilding our shopping cart. In this new version we want to allow our customers to purchase multiple SIM cards simultaneously. You have been engaged to build this new version.

We will start with the following products in our catalogue:

| Product Code | Product Name   | Price  |
| ---          | ---            | ---    |
| ult_small    | Unlimited 1GB  | $24.90 |
| ult_medium   | Unlimited 2GB  | $29.90 |
| ult_large    | Unlimited 5GB  | $44.90 |
| 1gb          | 1 GB Data-pack | $9.90  |

As launching the new cart is kinda a big deal, we'd like to have a few special offers and promotions to attract new customers:
- A 3 for 2 deal on Unlimited 1GB Sims. So for example, if you buy 3 Unlimited 1GB Sims, you will pay the price of 2 only for the first month.
- The Unlimited 5GB Sim will have a bulk discount applied; whereby the price will drop to $39.90 each for the first month, if the customer buys more than 3.
- We will bundle in a free 1 GB Data-pack free-of-charge with every Unlimited 2GB sold.
- Adding the promo code 'I<3AMAYSIM' will apply a 10% discount across the board.

As the market tends to fluctuate in terms of pricing, the rules around this need to be as flexible as possible as they can change with little notice. Customers can add items to the cart in any order.

## Interface

The interface to our cart looks like this:

```
cart = ShoppingCart.new(pricingRules)
cart.add(item1)
cart.add(item2, promo_code)
cart.total
cart.items
```

## The Programming Exercise

Your task is to implement a shopping cart that satisfies the requirements described above and execute the following scenarios (and verify the expected outcomes):

| Scenario | Items Added | Expected Cart Total | Expected Cart Items |
| :---: | --- | --- | --- |
| 1 | 3 x Unlimited 1 GB<br>1 x Unlimited 5 GB | $94.70 | 3 x Unlimited 1 GB<br>1 x Unlimited 5 GB |
| 2 | 2 x Unlimited 1 GB<br>4 x Unlimited 5 GB | $209.40 | 2 x Unlimited 1 GB<br>4 x Unlimited 5 GB |
| 3 | 1 x Unlimited 1 GB<br>2 X Unlimited 2 GB | $84.70 | 1 x Unlimited 1 GB<br>2 X Unlimited 2 GB<br>2 X 1 GB Data-pack |
| 4 | 1 x Unlimited 1 GB<br>1 x 1 GB Data-pack<br>'I<3AMAYSIM' Promo Applied | $31.32 | 1 x Unlimited 1 GB<br>1 x 1 GB Data-pack |

## File structure

```
.
├── package.json              # Project metadata and npm scripts
├── README.md
└── src
    ├── index.js              # Entry point — runs the sample scenarios and prints results
    ├── shoppingCart.js       # ShoppingCart class: add items, group them, compute total
    ├── pricingRules.js       # PricingRules factories (x-for-y, bulk, bundle, promo code)
    ├── constants.js          # Product catalogue (PRODUCTS) and demo SCENARIOS
    ├── utils.js              # Formatting/rounding helpers (formatMoney, round2, displayCartItems)
    └── shoppingCart.test.js  # Tests (node:test) covering scenarios and each pricing rule
```

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer (uses the built-in `node:test`
  runner and ES modules).

## Running

Runs the demo scenarios from `src/constants.js`, printing the total, a
PASS/FAIL against the expected total, and the cart contents for each:

```bash
npm start
```

## Testing

Runs the test suite with Node's built-in test runner:

```bash
npm test
```

The tests in `src/shoppingCart.test.js` cover the scenarios from the brief plus
each pricing rule (thresholds, bulk discounts, free bundles, and promo codes)
and basic cart behaviour.

## Usage example

```js
import ShoppingCart from "./src/shoppingCart.js";
import PricingRules from "./src/pricingRules.js";

const pricingRules = new PricingRules();
const cart = new ShoppingCart([
  pricingRules.promoCodeDiscount("I<3AMAYSIM", 10),
  pricingRules.xForYDeal("ult_small", 3, 2),
  pricingRules.bulkDiscount("ult_large", 3, 39.9),
  pricingRules.addBundle("ult_medium", "1gb"),
]);

cart.add("ult_small");
cart.add("ult_small");
cart.add("ult_small");
cart.add("ult_large");

console.log(cart.total); // 94.7
console.log(cart.items); // grouped paid items followed by any free items
```
