import { request } from '@/shared/api/http'
import type {
  Product,
  ProductCollectionResponse,
} from '@/entities/product/model/types'

const PRODUCTS_BATCH_LIMIT = 100

const buildProductsPath = (search: string, limit: number, skip: number): string => {
  const searchValue = search.trim()
  const searchParams = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  })

  if (searchValue.length > 0) {
    searchParams.set('q', searchValue)
    return `/products/search?${searchParams.toString()}`
  }

  return `/products?${searchParams.toString()}`
}

export const fetchProducts = async (search: string): Promise<Product[]> => {
  const products: Product[] = []
  let total = 1
  let skip = 0

  while (products.length < total) {
    const path = buildProductsPath(search, PRODUCTS_BATCH_LIMIT, skip)
    const response = await request<ProductCollectionResponse>(path)

    products.push(...response.products)
    total = response.total
    skip += response.limit

    if (response.limit === 0) {
      break
    }
  }

  return products
}
