import { useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/features/auth/model/auth-store'
import { useProductsModalActions } from '@/pages/products/model/use-products-modal-actions'
import { useProductsQuery } from '@/pages/products/model/use-products-query'
import { useProductsStoreSnapshot } from '@/pages/products/model/use-products-store-snapshot'
import { useProductsTableData } from '@/pages/products/model/use-products-table-data'
import type { ProductsPageModel } from '@/pages/products/model/types'

export const useProductsPageModel = (): ProductsPageModel => {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const store = useProductsStoreSnapshot()
  const query = useProductsQuery(store.search)
  const tableData = useProductsTableData({
    products: query.products,
    debouncedSearch: query.debouncedSearch,
    addedProducts: store.addedProducts,
    editedProducts: store.editedProducts,
    sortField: store.sortField,
    sortOrder: store.sortOrder,
    page: store.page,
    pageSize: store.pageSize,
    selectedIds: store.selectedIds,
    setPage: store.setPage,
  })
  const modal = useProductsModalActions({
    addProduct: store.addProduct,
    updateProduct: store.updateProduct,
  })

  const onLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const onRefresh = () => {
    store.clearSelection()
    void query.refetch()
  }

  return {
    toolbar: {
      search: store.search,
      setSearch: store.setSearch,
      onLogout,
      onRefresh,
      onOpenCreate: modal.onOpenCreate,
    },
    table: {
      rows: tableData.rows,
      isLoading: query.isLoading,
      isError: query.isError,
      errorMessage: query.errorMessage,
      sortField: store.sortField,
      sortOrder: store.sortOrder,
      selectedIds: store.selectedIds,
      currentPageIds: tableData.currentPageIds,
      isCurrentPageSelected: tableData.isCurrentPageSelected,
      isCurrentPagePartiallySelected: tableData.isCurrentPagePartiallySelected,
      onToggleSort: store.toggleSort,
      onToggleSelection: store.toggleSelection,
      onTogglePageSelection: store.togglePageSelection,
      onRetry: onRefresh,
      onOpenEdit: modal.onOpenEdit,
    },
    footer: {
      isLoading: query.isLoading,
      page: store.page,
      totalPages: tableData.totalPages,
      startNumber: tableData.startNumber,
      endNumber: tableData.endNumber,
      totalItems: tableData.totalItems,
      onSetPage: store.setPage,
    },
    modal: {
      isCreateOpen: modal.isCreateOpen,
      editingProduct: modal.editingProduct,
      onCloseCreate: modal.onCloseCreate,
      onCloseEdit: modal.onCloseEdit,
      onCreateSubmit: modal.onCreateSubmit,
      onEditSubmit: modal.onEditSubmit,
    },
  }
}
