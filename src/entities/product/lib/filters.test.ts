import { describe, expect, it } from 'vitest'

import { matchesSearch } from '@/entities/product/lib/filters'
import type { Product } from '@/entities/product/model/types'

const sampleProduct: Product = {
  id: 10,
  title: 'Dyson Supersonic',
  brand: 'Dyson',
  category: 'Электроника',
  sku: 'DYS-10',
  price: 29_990,
  rating: 4.7,
}

describe('matchesSearch', () => {
  it('returns true when search string is empty', () => {
    expect(matchesSearch(sampleProduct, '')).toBe(true)
  })

  it('matches by title, brand, category and sku', () => {
    expect(matchesSearch(sampleProduct, 'supersonic')).toBe(true)
    expect(matchesSearch(sampleProduct, 'dyson')).toBe(true)
    expect(matchesSearch(sampleProduct, 'электро')).toBe(true)
    expect(matchesSearch(sampleProduct, 'dys-10')).toBe(true)
  })

  it('matches fallback sku when explicit sku is missing', () => {
    const withoutSku: Product = { ...sampleProduct, id: 12, sku: undefined }

    expect(matchesSearch(withoutSku, 'sku-12')).toBe(true)
  })

  it('returns false when value does not match', () => {
    expect(matchesSearch(sampleProduct, 'non-existent')).toBe(false)
  })
})
