import { beforeEach, describe, expect, it } from 'vitest'

import type { ProductDraft } from '@/entities/product/model/types'
import { useProductsStore } from '@/features/products/model/products-store'

const resetProductsStore = () => {
  useProductsStore.setState({
    search: '',
    page: 1,
    pageSize: 20,
    sortField: null,
    sortOrder: 'asc',
    selectedIds: [],
    addedProducts: [],
    editedProducts: {},
  })
}

describe('useProductsStore', () => {
  beforeEach(() => {
    resetProductsStore()
  })

  it('resets page and selection when search changes', () => {
    useProductsStore.setState({ page: 3, selectedIds: [1, 2] })

    useProductsStore.getState().setSearch('dyson')

    const state = useProductsStore.getState()
    expect(state.search).toBe('dyson')
    expect(state.page).toBe(1)
    expect(state.selectedIds).toEqual([])
  })

  it('toggles sorting order for the same field', () => {
    const store = useProductsStore.getState()

    store.toggleSort('price')
    expect(useProductsStore.getState().sortField).toBe('price')
    expect(useProductsStore.getState().sortOrder).toBe('asc')

    useProductsStore.getState().toggleSort('price')
    expect(useProductsStore.getState().sortOrder).toBe('desc')
  })

  it('adds new product to top of local list', () => {
    const draft: ProductDraft = {
      title: 'Тестовый товар',
      price: 9_900,
      brand: 'Test Vendor',
      sku: 'TV-1',
    }

    useProductsStore.getState().addProduct(draft)

    const [created] = useProductsStore.getState().addedProducts
    expect(created).toMatchObject({
      title: draft.title,
      price: draft.price,
      brand: draft.brand,
      sku: draft.sku,
      category: 'Новая категория',
      rating: 4.8,
    })
    expect(created.id).toBeLessThan(0)
  })

  it('updates local and server products through proper branches', () => {
    const draft: ProductDraft = {
      title: 'Local item',
      price: 1200,
      brand: 'Local',
      sku: 'LOCAL-1',
    }

    useProductsStore.getState().addProduct(draft)
    const localId = useProductsStore.getState().addedProducts[0].id

    useProductsStore.getState().updateProduct(localId, { title: 'Updated local' })
    useProductsStore.getState().updateProduct(77, { title: 'Updated remote' })

    const state = useProductsStore.getState()
    expect(state.addedProducts[0].title).toBe('Updated local')
    expect(state.editedProducts[77]).toEqual({ title: 'Updated remote' })
  })

  it('toggles current page selection', () => {
    useProductsStore.setState({ selectedIds: [99] })

    useProductsStore.getState().togglePageSelection([1, 2, 3])
    expect(useProductsStore.getState().selectedIds).toEqual([99, 1, 2, 3])

    useProductsStore.getState().togglePageSelection([1, 2, 3])
    expect(useProductsStore.getState().selectedIds).toEqual([99])
  })
})
