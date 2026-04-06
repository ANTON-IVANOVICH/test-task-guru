import type { Product } from '@/entities/product/model/types'

import { resolveSku } from '@/entities/product/lib/formatters'

export const matchesSearch = (
  product: Product,
  normalizedSearch: string,
): boolean => {
  if (normalizedSearch.length === 0) {
    return true
  }

  return [
    product.title,
    product.brand ?? '',
    product.category ?? '',
    resolveSku(product),
  ].some((value) => value.toLowerCase().includes(normalizedSearch))
}
