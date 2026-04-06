import { useState } from 'react'
import { notifications } from '@mantine/notifications'

import type { Product, ProductDraft } from '@/entities/product/model/types'

interface UseProductsModalActionsParams {
  addProduct: (draft: ProductDraft) => void
  updateProduct: (id: number, patch: Partial<Product>) => void
}

interface ProductsModalActionsModel {
  isCreateOpen: boolean
  editingProduct: Product | null
  onOpenCreate: () => void
  onOpenEdit: (product: Product) => void
  onCloseCreate: () => void
  onCloseEdit: () => void
  onCreateSubmit: (values: ProductDraft) => void
  onEditSubmit: (values: ProductDraft) => void
}

export const useProductsModalActions = ({
  addProduct,
  updateProduct,
}: UseProductsModalActionsParams): ProductsModalActionsModel => {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const onCreateSubmit = (values: ProductDraft) => {
    addProduct(values)
    setIsCreateOpen(false)
    notifications.show({
      color: 'green',
      title: 'Товар добавлен',
      message: 'Новая позиция создана локально',
    })
  }

  const onEditSubmit = (values: ProductDraft) => {
    if (!editingProduct) {
      return
    }

    updateProduct(editingProduct.id, values)
    setEditingProduct(null)
    notifications.show({
      color: 'green',
      title: 'Изменения сохранены',
      message: 'Товар обновлен локально',
    })
  }

  return {
    isCreateOpen,
    editingProduct,
    onOpenCreate: () => setIsCreateOpen(true),
    onOpenEdit: (product) => setEditingProduct(product),
    onCloseCreate: () => setIsCreateOpen(false),
    onCloseEdit: () => setEditingProduct(null),
    onCreateSubmit,
    onEditSubmit,
  }
}
