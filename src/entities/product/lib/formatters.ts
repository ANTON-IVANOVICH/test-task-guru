import type { Product } from '@/entities/product/model/types'

const priceFormatter = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatPrice = (price: number): string => priceFormatter.format(price)

export const resolveSku = (product: Pick<Product, 'id' | 'sku'>): string =>
  product.sku && product.sku.trim().length > 0
    ? product.sku
    : `SKU-${Math.abs(product.id)}`
