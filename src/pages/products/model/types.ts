import type { SortField, SortOrder } from '@/entities/product/lib/sort'
import type { Product, ProductDraft } from '@/entities/product/model/types'

export interface ProductsToolbarModel {
  search: string
  setSearch: (value: string) => void
  onLogout: () => void
  onRefresh: () => void
  onOpenCreate: () => void
}

export interface ProductsTableModel {
  rows: Product[]
  isLoading: boolean
  isError: boolean
  errorMessage: string | null
  sortField: SortField | null
  sortOrder: SortOrder
  selectedIds: number[]
  currentPageIds: number[]
  isCurrentPageSelected: boolean
  isCurrentPagePartiallySelected: boolean
  onToggleSort: (field: SortField) => void
  onToggleSelection: (id: number) => void
  onTogglePageSelection: (ids: number[]) => void
  onRetry: () => void
  onOpenEdit: (product: Product) => void
}

export interface ProductsFooterModel {
  isLoading: boolean
  page: number
  totalPages: number
  startNumber: number
  endNumber: number
  totalItems: number
  onSetPage: (page: number) => void
}

export interface ProductsModalModel {
  isCreateOpen: boolean
  editingProduct: Product | null
  onCloseCreate: () => void
  onCloseEdit: () => void
  onCreateSubmit: (values: ProductDraft) => void
  onEditSubmit: (values: ProductDraft) => void
}

export interface ProductsPageModel {
  toolbar: ProductsToolbarModel
  table: ProductsTableModel
  footer: ProductsFooterModel
  modal: ProductsModalModel
}
