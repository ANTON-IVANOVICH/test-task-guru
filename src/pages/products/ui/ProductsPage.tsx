import { Paper } from '@mantine/core'

import { useProductsPageModel } from '@/pages/products/model/use-products-page-model'
import ProductsFooter from '@/widgets/products-footer/ui/ProductsFooter'
import ProductFormModal from '@/widgets/product-form-modal/ui/ProductFormModal'
import ProductsTable from '@/widgets/products-table/ui/ProductsTable'
import ProductsToolbar from '@/widgets/products-toolbar/ui/ProductsToolbar'

const ProductsPage = () => {
  const { toolbar, table, footer, modal } = useProductsPageModel()

  return (
    <main className="products-shell">
      <ProductsToolbar
        onLogout={toolbar.onLogout}
        search={toolbar.search}
        setSearch={toolbar.setSearch}
      />

      <Paper className="products-table-card" radius={20} withBorder>
        <ProductsTable
          currentPageIds={table.currentPageIds}
          errorMessage={table.errorMessage}
          isCurrentPagePartiallySelected={table.isCurrentPagePartiallySelected}
          isCurrentPageSelected={table.isCurrentPageSelected}
          isError={table.isError}
          isLoading={table.isLoading}
          onOpenCreate={toolbar.onOpenCreate}
          onOpenEdit={table.onOpenEdit}
          onRefresh={toolbar.onRefresh}
          onRetry={table.onRetry}
          onTogglePageSelection={table.onTogglePageSelection}
          onToggleSelection={table.onToggleSelection}
          onToggleSort={table.onToggleSort}
          rows={table.rows}
          selectedIds={table.selectedIds}
          sortField={table.sortField}
          sortOrder={table.sortOrder}
        />
        {!table.isError ? (
          <ProductsFooter
            endNumber={footer.endNumber}
            isLoading={footer.isLoading}
            onSetPage={footer.onSetPage}
            page={footer.page}
            startNumber={footer.startNumber}
            totalItems={footer.totalItems}
            totalPages={footer.totalPages}
          />
        ) : null}
      </Paper>

      <ProductFormModal
        mode="create"
        onClose={modal.onCloseCreate}
        onSubmit={modal.onCreateSubmit}
        opened={modal.isCreateOpen}
      />
      <ProductFormModal
        mode="edit"
        onClose={modal.onCloseEdit}
        onSubmit={modal.onEditSubmit}
        opened={modal.editingProduct !== null}
        product={modal.editingProduct}
      />
    </main>
  )
}

export default ProductsPage
