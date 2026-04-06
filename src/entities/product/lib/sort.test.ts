import { describe, expect, it } from 'vitest'

import { getSortValue, sortProducts } from '@/entities/product/lib/sort'
import type { Product } from '@/entities/product/model/types'

const createProduct = (patch: Partial<Product>): Product => ({
  id: patch.id ?? 1,
  title: patch.title ?? 'Product',
  price: patch.price ?? 100,
  rating: patch.rating ?? 4.2,
  brand: patch.brand,
  sku: patch.sku,
  category: patch.category,
  thumbnail: patch.thumbnail,
})

describe('product sorting helpers', () => {
  it('extracts value for fallback sku and brand safely', () => {
    const product = createProduct({ id: 15, sku: undefined, brand: undefined })

    expect(getSortValue(product, 'sku')).toBe('sku-15')
    expect(getSortValue(product, 'brand')).toBe('')
  })

  it('sorts by numeric fields', () => {
    const data = [
      createProduct({ id: 1, title: 'A', price: 5000 }),
      createProduct({ id: 2, title: 'B', price: 1200 }),
      createProduct({ id: 3, title: 'C', price: 9000 }),
    ]

    const asc = sortProducts(data, 'price', 'asc')
    const desc = sortProducts(data, 'price', 'desc')

    expect(asc.map((item) => item.id)).toEqual([2, 1, 3])
    expect(desc.map((item) => item.id)).toEqual([3, 1, 2])
  })

  it('sorts by string fields with locale compare', () => {
    const data = [
      createProduct({ id: 1, title: 'Zeta' }),
      createProduct({ id: 2, title: 'Alpha' }),
    ]

    const sorted = sortProducts(data, 'title', 'asc')

    expect(sorted.map((item) => item.id)).toEqual([2, 1])
  })

  it('returns copy in source order when sort field is not set', () => {
    const data = [
      createProduct({ id: 1, title: 'First' }),
      createProduct({ id: 2, title: 'Second' }),
    ]

    const result = sortProducts(data, null, 'asc')

    expect(result).not.toBe(data)
    expect(result).toEqual(data)
  })
})
