import { expect, test } from '@playwright/test';

test('ships readable, prerendered HTML', async ({ request }) => {
  const response = await request.get('/');
  expect(response.ok()).toBeTruthy();
  const html = await response.text();
  expect(html).toContain('Fast, calm products for the web.');
  expect(html).toContain('Where I’ve been building');
  expect(html).toContain('Ideas, made real.');
  expect(html).toContain('name="description"');
});

test('navigates the portfolio without browser errors or horizontal overflow', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.getByRole('link', { name: 'Explore the work' }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(
    page.getByRole('heading', { name: 'Ideas, made real.' }),
  ).toBeInViewport();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  expect(errors).toEqual([]);
});

test('mobile navigation supports closing with Escape and following links', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Open menu' });
  await toggle.click();
  const navigation = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(navigation).toBeVisible();
  const about = navigation.getByRole('link', { name: /About/ });
  await about.focus();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await toggle.click();
  await about.click();
  await expect(page).toHaveURL(/#about$/);
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});
