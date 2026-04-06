import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { Product } from '@/entities/product/model/types'
import { useProductsTableData } from '@/pages/products/model/use-products-table-data'

const serverProducts: Product[] = [
  {
    id: 1,
    title: 'Server A',
    brand: 'Brand A',
    category: 'Category A',
    sku: 'A-1',
    price: 100,
    rating: 4.5,
  },
  {
    id: 2,
    title: 'Server B',
    brand: 'Brand B',
    category: 'Category B',
    sku: 'B-2',
    price: 200,
    rating: 4.2,
  },
]

const localProducts: Product[] = [
  {
    id: -1,
    title: 'Local Item',
    brand: 'Local',
    category: 'Local Category',
    sku: 'LOCAL-1',
    price: 50,
    rating: 4.8,
  },
]

describe('useProductsTableData', () => {
  it('merges local and server products with server edits and paginates', () => {
    const setPage = vi.fn()

    const { result } = renderHook(() =>
      useProductsTableData({
        products: serverProducts,
        debouncedSearch: '',
        addedProducts: localProducts,
        editedProducts: {
          1: { title: 'Edited Server A' },
        },
        sortField: null,
        sortOrder: 'asc',
        page: 1,
        pageSize: 2,
        selectedIds: [-1],
        setPage,
      }),
    )

    expect(result.current.totalItems).toBe(3)
    expect(result.current.totalPages).toBe(2)
    expect(result.current.startNumber).toBe(1)
    expect(result.current.endNumber).toBe(2)
    expect(result.current.rows.map((row) => row.title)).toEqual([
      'Local Item',
      'Edited Server A',
    ])
    expect(result.current.currentPageIds).toEqual([-1, 1])
    expect(result.current.isCurrentPageSelected).toBe(false)
    expect(result.current.isCurrentPagePartiallySelected).toBe(true)
  })

  it('asks to move page back when current page is out of range', async () => {
    const setPage = vi.fn()

    renderHook(() =>
      useProductsTableData({
        products: serverProducts,
        debouncedSearch: '',
        addedProducts: [],
        editedProducts: {},
        sortField: null,
        sortOrder: 'asc',
        page: 4,
        pageSize: 20,
        selectedIds: [],
        setPage,
      }),
    )

    await waitFor(() => {
      expect(setPage).toHaveBeenCalledWith(1)
    })
  })
})
