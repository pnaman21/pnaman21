import { test, expect } from '../../src/fixtures/test-fixtures';
import { products } from '../../src/data/products';

test.describe('Cart', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.open();
  });

  test('added items appear in the cart @smoke', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.onesie);
    await inventoryPage.openCart();

    await expect(cartPage.title).toHaveText('Your Cart');
    await expect(cartPage.items).toHaveCount(2);
    await expect(cartPage.itemNames).toHaveText([products.backpack.name, products.onesie.name]);
  });

  test('item can be removed from the cart @regression', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.boltTShirt);
    await inventoryPage.openCart();

    await cartPage.removeItem(products.backpack.slug);

    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.itemNames).toHaveText([products.boltTShirt.name]);
  });

  test('continue shopping returns to inventory @regression', async ({
    inventoryPage,
    cartPage,
    page,
  }) => {
    await inventoryPage.openCart();
    await cartPage.continueShoppingButton.click();

    await expect(page).toHaveURL(/inventory\.html/);
  });
});
