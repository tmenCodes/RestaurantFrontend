import { expect, test } from '@playwright/test';

test('to have specific route', async ({ page }) => {
  await page.goto('http://localhost:4200/');

  // Expect a title "to contain" a substring.
  // await expect(page).toHaveTitle(/Yummy/);
  // await expect(page.locator('h4')).toHaveText('address');

  await expect(page).toHaveURL('http://localhost:4200/');
});

test('check text value by id', async ({ page }) => {
  await page.goto('http://localhost:4200/');

  // await expect(page.getByTestId('address')).toHaveText('Address');
  // await page.getByRole('link', { name: 'Book a Table' }).click();
  const link = page.getByRole('link', { name: 'Book a Table' });
  await expect(link).toHaveAttribute('href', 'book');
});

test('check button click', async ({ page }) => {
  await page.goto('http://localhost:4200/');

  // await expect(page.getByTestId('address')).toHaveText('Address');
  await page.getByRole('link', { name: 'Book a Table' }).click();
});

// test('check button click and url change', async ({ page }) => {
//   await page.goto('http://localhost:4200/');
//   await page.getByRole('link', { name: 'H' }).click();
// });

// test('test contact button ', async ({ page }) => {
//   await page.goto('http://localhost:4200/contact');
//   await page.getByRole('button', { name: ' Send Message ' }).click();
// });
