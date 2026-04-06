import type { Page, Route } from '@playwright/test'

interface MockApiOptions {
  loginShouldFail?: boolean
  productsDelayMs?: number
}

interface ProductApiItem {
  id: number
  title: string
  brand: string
  category: string
  sku: string
  price: number
  rating: number
  thumbnail: string
}

export interface MockApiController {
  getProductsRequests: () => number
}

const AUTH_USER = {
  id: 1,
  username: 'anton',
  email: 'anton@example.com',
  firstName: 'Anton',
  lastName: 'Tester',
  image: 'https://dummyjson.com/icon/anton/128',
}

const TOKENS = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
}

const productsFixture: ProductApiItem[] = [
  {
    id: 1,
    title: 'USB Флэшка 16GB',
    brand: 'Samsung',
    category: 'Аксессуары',
    sku: 'RCH45Q1A',
    rating: 4.3,
    price: 48652,
    thumbnail: 'https://placehold.co/64x64/e8e8ef/8a8fa3?text=1',
  },
  {
    id: 2,
    title: 'Утюг Braun TexStyle 9',
    brand: 'TexStyle',
    category: 'Бытовая техника',
    sku: 'DFCHQ1A',
    rating: 4.9,
    price: 4233,
    thumbnail: 'https://placehold.co/64x64/e8e8ef/8a8fa3?text=2',
  },
  {
    id: 3,
    title: 'Смартфон Apple iPhone 17',
    brand: 'Apple',
    category: 'Телефоны',
    sku: 'GUYHD2-X4',
    rating: 4.7,
    price: 88652,
    thumbnail: 'https://placehold.co/64x64/e8e8ef/8a8fa3?text=3',
  },
  {
    id: 4,
    title: 'Игровая консоль PlayStation',
    brand: 'Sony',
    category: 'Игровые приставки',
    sku: 'HT45Q21',
    rating: 4.1,
    price: 56236,
    thumbnail: 'https://placehold.co/64x64/e8e8ef/8a8fa3?text=4',
  },
  {
    id: 5,
    title: 'Фен Dyson Supersonic Nural',
    brand: 'Dyson',
    category: 'Электроника',
    sku: 'FJHHGF-CR4',
    rating: 3.3,
    price: 48652,
    thumbnail: 'https://placehold.co/64x64/e8e8ef/8a8fa3?text=5',
  },
]

const fulfillJson = async (
  route: Route,
  status: number,
  payload: unknown,
): Promise<void> => {
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(payload),
  })
}

const paginateProducts = (
  items: ProductApiItem[],
  requestUrl: URL,
): {
  products: ProductApiItem[]
  total: number
  skip: number
  limit: number
} => {
  const limit = Number(requestUrl.searchParams.get('limit') ?? 30)
  const skip = Number(requestUrl.searchParams.get('skip') ?? 0)

  return {
    products: items.slice(skip, skip + limit),
    total: items.length,
    skip,
    limit,
  }
}

const matchesProductsSearch = (item: ProductApiItem, search: string): boolean => {
  if (search.length === 0) {
    return true
  }

  return [item.title, item.brand, item.category, item.sku]
    .join(' ')
    .toLowerCase()
    .includes(search)
}

export const setupMockApi = async (
  page: Page,
  options: MockApiOptions = {},
): Promise<MockApiController> => {
  let productsRequests = 0

  await page.route('**/api/auth/login', async (route) => {
    if (options.loginShouldFail) {
      await fulfillJson(route, 400, {
        message: 'Invalid credentials',
      })
      return
    }

    await fulfillJson(route, 200, {
      ...AUTH_USER,
      ...TOKENS,
    })
  })

  await page.route('**/api/auth/me', async (route) => {
    await fulfillJson(route, 200, AUTH_USER)
  })

  await page.route('**/api/auth/refresh', async (route) => {
    await fulfillJson(route, 200, TOKENS)
  })

  const handleProducts = async (route: Route, data: ProductApiItem[]) => {
    productsRequests += 1

    if (options.productsDelayMs) {
      await page.waitForTimeout(options.productsDelayMs)
    }

    const url = new URL(route.request().url())
    await fulfillJson(route, 200, paginateProducts(data, url))
  }

  await page.route('**/api/products?*', async (route) => {
    await handleProducts(route, productsFixture)
  })

  await page.route('**/api/products/search?*', async (route) => {
    const requestUrl = new URL(route.request().url())
    const search = (requestUrl.searchParams.get('q') ?? '').trim().toLowerCase()
    const filtered = productsFixture.filter((item) =>
      matchesProductsSearch(item, search),
    )

    await handleProducts(route, filtered)
  })

  return {
    getProductsRequests: () => productsRequests,
  }
}
