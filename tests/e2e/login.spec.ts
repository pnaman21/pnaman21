import { test, expect } from '../../src/fixtures/test-fixtures';
import { users, errorMessages } from '../../src/data/users';

// Login tests must start from a clean, unauthenticated session
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('standard user can log in @smoke', async ({ loginPage, inventoryPage, page }) => {
    await loginPage.login(users.standard);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('locked out user sees an error @regression', async ({ loginPage }) => {
    await loginPage.login(users.locked);

    await expect(loginPage.errorMessage).toHaveText(errorMessages.lockedOut);
  });

  test('invalid credentials show an error @regression', async ({ loginPage }) => {
    await loginPage.login({ username: 'invalid_user', password: 'wrong_password' });

    await expect(loginPage.errorMessage).toHaveText(errorMessages.invalidCredentials);
  });

  test('username is required @regression', async ({ loginPage }) => {
    await loginPage.login({ username: '', password: users.standard.password });

    await expect(loginPage.errorMessage).toHaveText(errorMessages.usernameRequired);
  });

  test('password is required @regression', async ({ loginPage }) => {
    await loginPage.login({ username: users.standard.username, password: '' });

    await expect(loginPage.errorMessage).toHaveText(errorMessages.passwordRequired);
  });

  test('user can log out @smoke', async ({ loginPage, inventoryPage, page }) => {
    await loginPage.login(users.standard);
    await inventoryPage.logout();

    await expect(page).toHaveURL('/');
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('protected page redirects unauthenticated users to login @regression', async ({
    page,
    loginPage,
  }) => {
    await page.goto('/inventory.html');

    await expect(loginPage.errorMessage).toContainText("You can only access '/inventory.html'");
  });
});
