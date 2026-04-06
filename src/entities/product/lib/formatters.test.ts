import { describe, expect, it } from 'vitest'

import { formatPrice, resolveSku } from '@/entities/product/lib/formatters'

describe('product formatters', () => {
  it('formats price in ru-RU format', () => {
    const value = formatPrice(48_652)
    const normalized = value.replace(/\s/g, '')

    expect(normalized).toBe('48652,00')
  })

  it('returns explicit sku when present', () => {
    expect(resolveSku({ id: 42, sku: 'ABC-42' })).toBe('ABC-42')
  })

  it('builds fallback sku from id when value is empty', () => {
    expect(resolveSku({ id: -17, sku: '  ' })).toBe('SKU-17')
  })
})
