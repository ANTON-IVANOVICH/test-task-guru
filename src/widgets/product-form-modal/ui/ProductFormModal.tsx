import { useEffect } from 'react'
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Stack,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'

import type { Product, ProductDraft } from '@/entities/product/model/types'

interface ProductFormModalProps {
  mode: 'create' | 'edit'
  opened: boolean
  onClose: () => void
  onSubmit: (values: ProductDraft) => void
  product?: Product | null
}

interface ProductFormValues {
  title: string
  price: string | number
  brand: string
  sku: string
  category: string
  rating: string | number
}

const getInitialValues = (product?: Product | null): ProductFormValues => ({
  title: product?.title ?? '',
  price: product?.price ?? '',
  brand: product?.brand ?? '',
  sku: product?.sku ?? '',
  category: product?.category ?? '',
  rating: product?.rating ?? '',
})

const ProductFormModal = ({
  mode,
  opened,
  onClose,
  onSubmit,
  product,
}: ProductFormModalProps) => {
  const form = useForm<ProductFormValues>({
    initialValues: getInitialValues(product),
    validate: {
      title: (value) =>
        value.trim().length === 0 ? 'Укажите наименование товара' : null,
      price: (value) => {
        const price = Number(value)
        if (Number.isNaN(price) || price <= 0) {
          return 'Укажите корректную цену'
        }

        return null
      },
      brand: (value) =>
        value.trim().length === 0 ? 'Укажите вендора' : null,
      sku: (value) => (value.trim().length === 0 ? 'Укажите артикул' : null),
      rating: (value) => {
        if (String(value).trim().length === 0) {
          return null
        }

        const rating = Number(value)
        if (Number.isNaN(rating) || rating < 0 || rating > 5) {
          return 'Оценка должна быть от 0 до 5'
        }

        return null
      },
    },
  })

  useEffect(() => {
    if (!opened) {
      return
    }

    form.setValues(getInitialValues(product))
    form.resetDirty()
    form.clearErrors()
  }, [form, opened, product])

  const handleSubmit = (values: ProductFormValues) => {
    onSubmit({
      title: values.title.trim(),
      price: Number(values.price),
      brand: values.brand.trim(),
      sku: values.sku.trim(),
      category: values.category.trim() || 'Новая категория',
      rating:
        String(values.rating).trim().length > 0
          ? Number(values.rating)
          : undefined,
    })
  }

  return (
    <Modal
      centered
      opened={opened}
      onClose={onClose}
      title={mode === 'create' ? 'Добавить товар' : 'Редактировать товар'}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Наименование"
            placeholder="Например, Наушники Pro"
            {...form.getInputProps('title')}
          />
          <NumberInput
            label="Цена"
            min={0}
            placeholder="0"
            thousandSeparator=" "
            decimalScale={2}
            {...form.getInputProps('price')}
          />
          <TextInput
            label="Вендор"
            placeholder="Например, Apple"
            {...form.getInputProps('brand')}
          />
          <TextInput
            label="Артикул"
            placeholder="Например, APX-23-1"
            {...form.getInputProps('sku')}
          />
          <TextInput
            label="Категория"
            placeholder="Например, Телефоны"
            {...form.getInputProps('category')}
          />
          <NumberInput
            label="Оценка"
            min={0}
            max={5}
            step={0.1}
            decimalScale={1}
            placeholder="0 - 5"
            {...form.getInputProps('rating')}
          />
          <Group justify="flex-end" mt="xs">
            <Button variant="default" onClick={onClose} type="button">
              Отмена
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Добавить' : 'Сохранить'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}

export default ProductFormModal
