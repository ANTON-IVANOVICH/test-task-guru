import type { Product } from '@/entities/product/model/types'

import { resolveSku } from '@/entities/product/lib/formatters'

export type SortField = 'title' | 'brand' | 'sku' | 'rating' | 'price'
export type SortOrder = 'asc' | 'desc'

export const getSortValue = (
  product: Product,
  field: SortField,
): string | number => {
  if (field === 'price' || field === 'rating') {
    return product[field]
  }

  if (field === 'sku') {
    return resolveSku(product).toLowerCase()
  }

  if (field === 'brand') {
    return (product.brand ?? '').toLowerCase()
  }

  return product.title.toLowerCase()
}

export const sortProducts = (
  products: Product[],
  sortField: SortField | null,
  sortOrder: SortOrder,
): Product[] => {
  const data = [...products]

  if (!sortField) {
    return data
  }

  data.sort((a, b) => {
    const left = getSortValue(a, sortField)
    const right = getSortValue(b, sortField)

    let compareResult = 0
    if (typeof left === 'number' && typeof right === 'number') {
      compareResult = left - right
    } else {
      compareResult = String(left).localeCompare(String(right), 'ru')
    }

    return sortOrder === 'asc' ? compareResult : compareResult * -1
  })

  return data
}
