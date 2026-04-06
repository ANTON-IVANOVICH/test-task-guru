import { useEffect, useMemo } from 'react'

import { matchesSearch } from '@/entities/product/lib/filters'
import { sortProducts, type SortField, type SortOrder } from '@/entities/product/lib/sort'
import type { Product } from '@/entities/product/model/types'

interface UseProductsTableDataParams {
  products: Product[]
  debouncedSearch: string
  addedProducts: Product[]
  editedProducts: Record<number, Partial<Product>>
  sortField: SortField | null
  sortOrder: SortOrder
  page: number
  pageSize: number
  selectedIds: number[]
  setPage: (page: number) => void
}

interface ProductsTableDataModel {
  rows: Product[]
  currentPageIds: number[]
  isCurrentPageSelected: boolean
  isCurrentPagePartiallySelected: boolean
  totalItems: number
  totalPages: number
  startNumber: number
  endNumber: number
}

export const useProductsTableData = ({
  products,
  debouncedSearch,
  addedProducts,
  editedProducts,
  sortField,
  sortOrder,
  page,
  pageSize,
  selectedIds,
  setPage,
}: UseProductsTableDataParams): ProductsTableDataModel => {
  const mergedProducts = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase()

    const localProducts = addedProducts.filter((product) =>
      matchesSearch(product, normalizedSearch),
    )

    const serverProducts = products.map((product) => ({
      ...product,
      ...editedProducts[product.id],
    }))

    return [...localProducts, ...serverProducts]
  }, [addedProducts, debouncedSearch, editedProducts, products])

  const sortedProducts = useMemo(
    () => sortProducts(mergedProducts, sortField, sortOrder),
    [mergedProducts, sortField, sortOrder],
  )

  const totalItems = sortedProducts.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, setPage, totalPages])

  const rows = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedProducts.slice(start, start + pageSize)
  }, [page, pageSize, sortedProducts])

  const currentPageIds = useMemo(() => rows.map((product) => product.id), [rows])
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])

  const isCurrentPageSelected =
    currentPageIds.length > 0 && currentPageIds.every((id) => selectedSet.has(id))

  const isCurrentPagePartiallySelected =
    !isCurrentPageSelected && currentPageIds.some((id) => selectedSet.has(id))

  const startNumber = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const endNumber = Math.min(page * pageSize, totalItems)

  return {
    rows,
    currentPageIds,
    isCurrentPageSelected,
    isCurrentPagePartiallySelected,
    totalItems,
    totalPages,
    startNumber,
    endNumber,
  }
}
