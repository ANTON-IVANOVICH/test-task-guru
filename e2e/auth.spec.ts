import { expect, test } from '@playwright/test'

import { setupMockApi } from './fixtures/mock-api'

test('redirects guest from /products to /login', async ({ page }) => {
  await page.goto('/products')

  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('heading', { name: 'Добро пожаловать!' })).toBeVisible()
})

test('shows Invalid credentials error on failed login', async ({ page }) => {
  await setupMockApi(page, { loginShouldFail: true })

  await page.goto('/login')
  await page.getByLabel('Логин').fill('anton')
  await page.getByLabel('Пароль').fill('wrong')
  await page.getByRole('button', { name: 'Войти' }).click()

  await expect(page.getByText('Invalid credentials')).toBeVisible()
})

test('stores session in sessionStorage when remember is disabled', async ({ page }) => {
  await setupMockApi(page)

  await page.goto('/login')
  await page.getByLabel('Логин').fill('anton')
  await page.getByLabel('Пароль').fill('123456')
  await page.getByRole('button', { name: 'Войти' }).click()

  await expect(page).toHaveURL(/\/products$/)

  const storage = await page.evaluate(() => ({
    local: window.localStorage.getItem('tg_auth_session'),
    session: window.sessionStorage.getItem('tg_auth_session'),
  }))

  expect(storage.local).toBeNull()
  expect(storage.session).toBeTruthy()
})

test('stores session in localStorage when remember is enabled', async ({ page }) => {
  await setupMockApi(page)

  await page.goto('/login')
  await page.getByLabel('Логин').fill('anton')
  await page.getByLabel('Пароль').fill('123456')
  await page.getByLabel('Запомнить данные').check()
  await page.getByRole('button', { name: 'Войти' }).click()

  await expect(page).toHaveURL(/\/products$/)

  const storage = await page.evaluate(() => ({
    local: window.localStorage.getItem('tg_auth_session'),
    session: window.sessionStorage.getItem('tg_auth_session'),
  }))

  expect(storage.local).toBeTruthy()
  expect(storage.session).toBeNull()
})
