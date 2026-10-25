import { test, expect } from '../../src/fixtures/test-fixtures';
import { products } from '../../src/data/products';
import { validCheckoutInfo } from '../../src/data/checkout';
import { errorMessages } from '../../src/data/users';

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventoryPage, cartPage }) => {
    await inventoryPage.open();
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.bikeLight);
    await inventoryPage.openCart();
    await cartPage.checkout();
  });

  test('user can complete an order end to end @smoke', async ({ checkoutPage, page }) => {
    await checkoutPage.fillInformation(validCheckoutInfo);

    await expect(page).toHaveURL(/checkout-step-two\.html/);
    const expectedSubtotal = products.backpack.price + products.bikeLight.price;
    expect(await checkoutPage.getSubtotal()).toBeCloseTo(expectedSubtotal, 2);

    await checkoutPage.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.confirmationHeader).toHaveText('Thank you for your order!');
  });

  test('first name is required @regression', async ({ checkoutPage }) => {
    await checkoutPage.fillInformation({ lastName: 'Doe', postalCode: '560001' });

    await expect(checkoutPage.errorMessage).toHaveText(errorMessages.firstNameRequired);
  });

  test('last name is required @regression', async ({ checkoutPage }) => {
    await checkoutPage.fillInformation({ firstName: 'Jane', postalCode: '560001' });

    await expect(checkoutPage.errorMessage).toHaveText(errorMessages.lastNameRequired);
  });

  test('postal code is required @regression', async ({ checkoutPage }) => {
    await checkoutPage.fillInformation({ firstName: 'Jane', lastName: 'Doe' });

    await expect(checkoutPage.errorMessage).toHaveText(errorMessages.postalCodeRequired);
  });

  test('cart is emptied after a completed order @regression', async ({
    checkoutPage,
    inventoryPage,
  }) => {
    await checkoutPage.fillInformation(validCheckoutInfo);
    await checkoutPage.finish();
    await checkoutPage.backHomeButton.click();

    await expect(inventoryPage.cartBadge).toBeHidden();
  });
});
