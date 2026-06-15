import { expect, test } from '@playwright/test';

test('Test for succesful login', async ({ page }) => {
  await page.goto('http://localhost:4200/login');

  await page.getByRole('textbox', { name: 'Email' }).fill('tman@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Password1!');
  await page.getByRole('button', { name: 'Submit' }).click();

  page.getByText('Something is wrong, please try again').isVisible();
  await expect(page).toHaveURL('http://localhost:4200/userinfo');
});

test('Test for unsucesful login', async ({ page }) => {
  await page.goto('http://localhost:4200/login');

  await page.getByRole('textbox', { name: 'Email' }).fill('tmac427@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Password');
  await page.getByRole('button', { name: 'Submit' }).click();

  page.getByText('Something is wrong, please try again').isVisible();
  await expect(page).toHaveURL('http://localhost:4200/login');
});

test('Check for error message when duplicate email on signup page', async ({
  page,
}) => {
  await page.goto('http://localhost:4200/signup');

  await page.getByRole('textbox', { name: 'Email' }).fill('tman@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Password!');

  await expect(page.locator('.field-error')).toHaveText(
    'Email has already been taken'
  );
});
