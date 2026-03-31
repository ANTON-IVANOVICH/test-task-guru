import { create } from 'zustand'

import type { Product, ProductDraft } from '../types/product'

export type SortField = 'title' | 'brand' | 'sku' | 'rating' | 'price'
export type SortOrder = 'asc' | 'desc'

interface ProductsState {
  search: string
  page: number
  pageSize: number
  sortField: SortField | null
  sortOrder: SortOrder
  selectedIds: number[]
  addedProducts: Product[]
  editedProducts: Record<number, Partial<Product>>
  setSearch: (search: string) => void
  setPage: (page: number) => void
  toggleSort: (field: SortField) => void
  setSort: (field: SortField, order: SortOrder) => void
  addProduct: (draft: ProductDraft) => void
  updateProduct: (id: number, patch: Partial<Product>) => void
  toggleSelection: (id: number) => void
  togglePageSelection: (ids: number[]) => void
  clearSelection: () => void
}

const PLACEHOLDER_IMAGE = 'https://placehold.co/64x64/e8e8ef/8a8fa3?text=IMG'

export const useProductsStore = create<ProductsState>((set) => ({
  search: '',
  page: 1,
  pageSize: 20,
  sortField: null,
  sortOrder: 'asc',
  selectedIds: [],
  addedProducts: [],
  editedProducts: {},
  setSearch: (search) =>
    set(() => ({
      search,
      page: 1,
      selectedIds: [],
    })),
  setPage: (page) => set(() => ({ page })),
  toggleSort: (field) =>
    set((state) => {
      if (state.sortField !== field) {
        return { sortField: field, sortOrder: 'asc', page: 1 }
      }

      return {
        sortField: field,
        sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc',
        page: 1,
      }
    }),
  setSort: (field, order) =>
    set(() => ({
      sortField: field,
      sortOrder: order,
      page: 1,
    })),
  addProduct: (draft) =>
    set((state) => {
      const id = -Math.floor(Date.now() + Math.random() * 1000)

      const item: Product = {
        id,
        title: draft.title,
        price: draft.price,
        brand: draft.brand,
        sku: draft.sku,
        category: draft.category ?? 'Новая категория',
        rating: draft.rating ?? 4.8,
        thumbnail: PLACEHOLDER_IMAGE,
      }

      return {
        addedProducts: [item, ...state.addedProducts],
        page: 1,
      }
    }),
  updateProduct: (id, patch) =>
    set((state) => {
      if (id < 0) {
        return {
          addedProducts: state.addedProducts.map((product) =>
            product.id === id ? { ...product, ...patch } : product,
          ),
        }
      }

      return {
        editedProducts: {
          ...state.editedProducts,
          [id]: {
            ...state.editedProducts[id],
            ...patch,
          },
        },
      }
    }),
  toggleSelection: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((value) => value !== id)
        : [...state.selectedIds, id],
    })),
  togglePageSelection: (ids) =>
    set((state) => {
      const isEverySelected =
        ids.length > 0 && ids.every((id) => state.selectedIds.includes(id))

      if (isEverySelected) {
        return {
          selectedIds: state.selectedIds.filter((id) => !ids.includes(id)),
        }
      }

      return {
        selectedIds: Array.from(new Set([...state.selectedIds, ...ids])),
      }
    }),
  clearSelection: () => set(() => ({ selectedIds: [] })),
}))
