import { useShallow } from 'zustand/react/shallow'

import { useProductsStore } from '@/features/products/model/products-store'

export const useProductsStoreSnapshot = () =>
  useProductsStore(
    useShallow((state) => ({
      search: state.search,
      page: state.page,
      pageSize: state.pageSize,
      sortField: state.sortField,
      sortOrder: state.sortOrder,
      selectedIds: state.selectedIds,
      addedProducts: state.addedProducts,
      editedProducts: state.editedProducts,
      setSearch: state.setSearch,
      setPage: state.setPage,
      toggleSort: state.toggleSort,
      addProduct: state.addProduct,
      updateProduct: state.updateProduct,
      toggleSelection: state.toggleSelection,
      togglePageSelection: state.togglePageSelection,
      clearSelection: state.clearSelection,
    })),
  )
