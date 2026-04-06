import { type Page, expect, test } from '@playwright/test'

import { setupMockApi } from './fixtures/mock-api'

const loginToProducts = async (page: Page) => {
  await page.goto('/login')
  await page.getByLabel('Логин').fill('anton')
  await page.getByLabel('Пароль').fill('123456')
  await page.getByRole('button', { name: 'Войти' }).click()
  await expect(page).toHaveURL(/\/products$/)
}

test('shows skeletons during products loading and then renders rows', async ({ page }) => {
  await setupMockApi(page, { productsDelayMs: 900 })

  await loginToProducts(page)

  await expect(
    page.locator('.products-table-card .mantine-Skeleton-root').first(),
  ).toBeVisible()
  await expect(page.getByText('USB Флэшка 16GB')).toBeVisible()
})

test('supports search and sorting by price', async ({ page }) => {
  await setupMockApi(page)

  await loginToProducts(page)
  await expect(page.getByText('USB Флэшка 16GB')).toBeVisible()

  await page.getByPlaceholder('Найти').fill('dyson')
  await expect(page.locator('.products-table tbody tr')).toHaveCount(1)
  await expect(page.getByText('Фен Dyson Supersonic Nural')).toBeVisible()

  await page.getByPlaceholder('Найти').fill('')
  await expect(page.locator('.products-table tbody tr')).toHaveCount(5)

  const firstRow = page.locator('.products-table tbody tr').first()

  await page.getByRole('button', { name: 'Цена, ₽' }).click()
  await expect(firstRow).toContainText('Утюг Braun TexStyle 9')

  await page.getByRole('button', { name: 'Цена, ₽' }).click()
  await expect(firstRow).toContainText('Смартфон Apple iPhone 17')
})

test('adds product via modal and shows toast', async ({ page }) => {
  await setupMockApi(page)

  await loginToProducts(page)

  await page.getByRole('button', { name: 'Добавить' }).click()

  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('Наименование').fill('Тестовый товар E2E')
  await dialog.getByLabel('Цена').fill('7777')
  await dialog.getByLabel('Вендор').fill('E2E Vendor')
  await dialog.getByLabel('Артикул').fill('E2E-777')
  await dialog.getByRole('button', { name: 'Добавить' }).click()

  await expect(page.getByText('Товар добавлен')).toBeVisible()
  await expect(page.locator('.products-table tbody tr').first()).toContainText(
    'Тестовый товар E2E',
  )
})

test('edits product from table row and shows toast', async ({ page }) => {
  await setupMockApi(page)

  await loginToProducts(page)

  const firstRow = page.locator('.products-table tbody tr').first()
  await firstRow.locator('td').nth(6).locator('button').first().click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toContainText('Редактировать товар')
  await dialog.getByLabel('Наименование').fill('USB Флэшка 16GB PRO')
  await dialog.getByRole('button', { name: 'Сохранить' }).click()

  await expect(page.getByText('Изменения сохранены')).toBeVisible()
  await expect(firstRow).toContainText('USB Флэшка 16GB PRO')
})

test('refresh action reloads data and clears selected rows', async ({ page }) => {
  const api = await setupMockApi(page)

  await loginToProducts(page)

  const rowCheckbox = page.getByRole('checkbox', {
    name: 'Выбрать USB Флэшка 16GB',
  })

  await rowCheckbox.check()
  await expect(rowCheckbox).toBeChecked()

  await page.getByRole('button', { name: 'Обновить таблицу' }).click()
  await expect(rowCheckbox).not.toBeChecked()

  await expect.poll(() => api.getProductsRequests()).toBeGreaterThan(1)
})

test('renders low rating with red-like color emphasis', async ({ page }) => {
  await setupMockApi(page)

  await loginToProducts(page)

  const lowRating = page.getByText('3.3/5')
  await expect(lowRating).toBeVisible()

  const rgb = await lowRating.evaluate((node) =>
    window.getComputedStyle(node).color,
  )

  const channels = rgb
    .replace(/rgba?\(/, '')
    .replace(')', '')
    .split(',')
    .slice(0, 3)
    .map((value) => Number(value.trim()))

  expect(channels[0]).toBeGreaterThan(channels[1])
  expect(channels[0]).toBeGreaterThan(channels[2])
})
