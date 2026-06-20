/**
 * Formats a numeric amount as a currency string with two decimal places.
 * @param {number} money - The amount to format.
 * @returns {string} The amount prefixed with `$` and fixed to 2 decimals (e.g. `$9.50`).
 */
export const formatMoney = (money) => `$${money.toFixed(2)}`;

/**
 * Rounds a number to two decimal places.
 * @param {number} num - The number to round.
 * @returns {number} The value rounded to 2 decimal places.
 */
export const round2 = (num) => Number((num).toFixed(2));

/**
 * Display the cart items.
 * Each item is rendered as `quantity x name - unit price` followed by its line total.
 * @param {{ items: Array<{ quantity: number, name: string, price: number }> }} cart - The cart whose items will be displayed.
 * @returns {string} The formatted cart item.
 */
export const displayCartItems = (cart) => cart.items.map((i) => `${i.quantity} x ${i.name} - ${formatMoney(i.price)}\n${formatMoney(i.quantity * i.price)}\n`).join('-------\n');