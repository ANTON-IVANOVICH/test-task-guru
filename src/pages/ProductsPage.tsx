import { useEffect, useMemo, useState } from 'react'
import {
  ActionIcon,
  Avatar,
  Button,
  Checkbox,
  Group,
  Pagination,
  Paper,
  ScrollArea,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
  UnstyledButton,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useQuery } from '@tanstack/react-query'
import {
  IconArrowsSort,
  IconChevronDown,
  IconChevronUp,
  IconDots,
  IconLogout,
  IconPlus,
  IconRefresh,
  IconSearch,
} from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'

import ProductFormModal from '../components/ProductFormModal'
import { ApiError, fetchProducts } from '../lib/api'
import { useAuthStore } from '../store/auth-store'
import { type SortField, useProductsStore } from '../store/products-store'
import type { Product, ProductDraft } from '../types/product'

const priceFormatter = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const resolveSku = (product: Product): string =>
  product.sku && product.sku.trim().length > 0
    ? product.sku
    : `SKU-${Math.abs(product.id)}`

const matchesSearch = (product: Product, normalizedSearch: string): boolean => {
  if (normalizedSearch.length === 0) {
    return true
  }

  return [
    product.title,
    product.brand ?? '',
    product.category ?? '',
    resolveSku(product),
  ].some((value) => value.toLowerCase().includes(normalizedSearch))
}

const getSortValue = (
  product: Product,
  field: SortField,
): string | number => {
  if (field === 'price' || field === 'rating') {
    return product[field]
  }

  if (field === 'sku') {
    return resolveSku(product).toLowerCase()
  }

  if (field === 'brand') {
    return (product.brand ?? '').toLowerCase()
  }

  return product.title.toLowerCase()
}

interface SortableHeaderProps {
  label: string
  field: SortField
  activeSortField: SortField | null
  sortOrder: 'asc' | 'desc'
  onSort: (field: SortField) => void
}

const SKELETON_ROWS_COUNT = 6

const SortableHeader = ({
  label,
  field,
  activeSortField,
  sortOrder,
  onSort,
}: SortableHeaderProps) => {
  const isActive = activeSortField === field

  return (
    <UnstyledButton className="sort-header" onClick={() => onSort(field)}>
      <Group gap={6} wrap="nowrap">
        <Text
          className={isActive ? 'sort-header-text active' : 'sort-header-text'}
          fw={600}
          span
        >
          {label}
        </Text>
        {isActive ? (
          sortOrder === 'asc' ? (
            <IconChevronUp size={16} />
          ) : (
            <IconChevronDown size={16} />
          )
        ) : (
          <IconArrowsSort size={16} />
        )}
      </Group>
    </UnstyledButton>
  )
}

const TableSkeletonRows = () =>
  Array.from({ length: SKELETON_ROWS_COUNT }).map((_, index) => (
    <Table.Tr className="product-row" key={`skeleton-${index}`}>
      <Table.Td>
        <Skeleton height={20} radius="sm" width={20} />
      </Table.Td>
      <Table.Td>
        <Group gap="sm" wrap="nowrap">
          <Skeleton height={46} radius={10} width={46} />
          <Stack className="skeleton-name-stack" gap={8}>
            <Skeleton height={16} radius="sm" width="72%" />
            <Skeleton height={12} radius="sm" width="46%" />
          </Stack>
        </Group>
      </Table.Td>
      <Table.Td>
        <Skeleton height={16} radius="sm" width={96} />
      </Table.Td>
      <Table.Td>
        <Skeleton height={16} radius="sm" width={88} />
      </Table.Td>
      <Table.Td>
        <Skeleton height={16} radius="sm" width={62} />
      </Table.Td>
      <Table.Td>
        <Skeleton height={16} radius="sm" width={90} />
      </Table.Td>
      <Table.Td>
        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <Skeleton height={34} radius="xl" width={50} />
          <Skeleton height={34} radius="xl" width={34} />
        </Group>
      </Table.Td>
    </Table.Tr>
  ))

const ProductsPage = () => {
  const navigate = useNavigate()

  const logout = useAuthStore((state) => state.logout)

  const search = useProductsStore((state) => state.search)
  const page = useProductsStore((state) => state.page)
  const pageSize = useProductsStore((state) => state.pageSize)
  const sortField = useProductsStore((state) => state.sortField)
  const sortOrder = useProductsStore((state) => state.sortOrder)
  const selectedIds = useProductsStore((state) => state.selectedIds)
  const addedProducts = useProductsStore((state) => state.addedProducts)
  const editedProducts = useProductsStore((state) => state.editedProducts)
  const setSearch = useProductsStore((state) => state.setSearch)
  const setPage = useProductsStore((state) => state.setPage)
  const toggleSort = useProductsStore((state) => state.toggleSort)
  const addProduct = useProductsStore((state) => state.addProduct)
  const updateProduct = useProductsStore((state) => state.updateProduct)
  const toggleSelection = useProductsStore((state) => state.toggleSelection)
  const togglePageSelection = useProductsStore(
    (state) => state.togglePageSelection,
  )
  const clearSelection = useProductsStore((state) => state.clearSelection)

  const [debouncedSearch] = useDebouncedValue(search, 350)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const productsQuery = useQuery({
    queryKey: ['products', debouncedSearch],
    queryFn: () => fetchProducts(debouncedSearch),
    staleTime: 60_000,
    retry: 1,
  })

  const mergedProducts = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase()

    const localProducts = addedProducts.filter((product) =>
      matchesSearch(product, normalizedSearch),
    )

    const serverProducts = (productsQuery.data ?? []).map((product) => ({
      ...product,
      ...editedProducts[product.id],
    }))

    return [...localProducts, ...serverProducts]
  }, [addedProducts, debouncedSearch, editedProducts, productsQuery.data])

  const sortedProducts = useMemo(() => {
    const data = [...mergedProducts]

    if (!sortField) {
      return data
    }

    data.sort((a, b) => {
      const left = getSortValue(a, sortField)
      const right = getSortValue(b, sortField)

      let compareResult = 0
      if (typeof left === 'number' && typeof right === 'number') {
        compareResult = left - right
      } else {
        compareResult = String(left).localeCompare(String(right), 'ru')
      }

      return sortOrder === 'asc' ? compareResult : compareResult * -1
    })

    return data
  }, [mergedProducts, sortField, sortOrder])

  const totalItems = sortedProducts.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, setPage, totalPages])

  const visibleProducts = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedProducts.slice(start, start + pageSize)
  }, [page, pageSize, sortedProducts])

  const currentPageIds = useMemo(
    () => visibleProducts.map((product) => product.id),
    [visibleProducts],
  )
  const isCurrentPageSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedIds.includes(id))
  const isCurrentPagePartiallySelected =
    !isCurrentPageSelected &&
    currentPageIds.some((id) => selectedIds.includes(id))

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleRefresh = () => {
    clearSelection()
    void productsQuery.refetch()
  }

  const handleCreateSubmit = (values: ProductDraft) => {
    addProduct(values)
    setIsCreateModalOpen(false)
    notifications.show({
      color: 'green',
      title: 'Товар добавлен',
      message: 'Новая позиция создана локально',
    })
  }

  const handleEditSubmit = (values: ProductDraft) => {
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

  const startNumber = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const endNumber = Math.min(page * pageSize, totalItems)
  const isTableLoading = productsQuery.isFetching && !productsQuery.isError

  return (
    <main className="products-shell">
      <Paper className="products-toolbar" radius={20} withBorder>
        <Group className="products-toolbar-row" gap="md" wrap="nowrap">
          <Title className="products-title" order={2}>
            Товары
          </Title>
          <TextInput
            className="products-search"
            leftSection={<IconSearch size={16} />}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="Найти"
            value={search}
          />
          <Button
            leftSection={<IconLogout size={16} />}
            onClick={handleLogout}
            variant="default"
          >
            Выйти
          </Button>
        </Group>
      </Paper>

      <Paper className="products-table-card" radius={20} withBorder>
        <Group justify="space-between" mb="lg">
          <Title order={3}>Все позиции</Title>
          <Group gap="sm">
            <Tooltip label="Обновить таблицу">
              <ActionIcon
                aria-label="Обновить таблицу"
                onClick={handleRefresh}
                size={40}
                variant="default"
              >
                <IconRefresh size={18} />
              </ActionIcon>
            </Tooltip>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={() => setIsCreateModalOpen(true)}
              size="md"
            >
              Добавить
            </Button>
          </Group>
        </Group>

        {productsQuery.isError ? (
          <Stack align="center" gap={6} py="xl">
            <Text c="red.7" ta="center">
              {productsQuery.error instanceof ApiError
                ? productsQuery.error.message
                : 'Не удалось загрузить товары'}
            </Text>
            <Button onClick={handleRefresh} variant="light">
              Повторить
            </Button>
          </Stack>
        ) : (
          <>
            <ScrollArea>
              <Table className="products-table" highlightOnHover verticalSpacing="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th w={44}>
                      <Checkbox
                        aria-label="Выбрать все строки на странице"
                        checked={isCurrentPageSelected}
                        indeterminate={isCurrentPagePartiallySelected}
                        onChange={() => togglePageSelection(currentPageIds)}
                      />
                    </Table.Th>
                    <Table.Th>
                      <SortableHeader
                        activeSortField={sortField}
                        field="title"
                        label="Наименование"
                        onSort={toggleSort}
                        sortOrder={sortOrder}
                      />
                    </Table.Th>
                    <Table.Th>
                      <SortableHeader
                        activeSortField={sortField}
                        field="brand"
                        label="Вендор"
                        onSort={toggleSort}
                        sortOrder={sortOrder}
                      />
                    </Table.Th>
                    <Table.Th>
                      <SortableHeader
                        activeSortField={sortField}
                        field="sku"
                        label="Артикул"
                        onSort={toggleSort}
                        sortOrder={sortOrder}
                      />
                    </Table.Th>
                    <Table.Th w={140}>
                      <SortableHeader
                        activeSortField={sortField}
                        field="rating"
                        label="Оценка"
                        onSort={toggleSort}
                        sortOrder={sortOrder}
                      />
                    </Table.Th>
                    <Table.Th w={170}>
                      <SortableHeader
                        activeSortField={sortField}
                        field="price"
                        label="Цена, ₽"
                        onSort={toggleSort}
                        sortOrder={sortOrder}
                      />
                    </Table.Th>
                    <Table.Th w={140} />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {isTableLoading
                    ? TableSkeletonRows()
                    : visibleProducts.map((product) => {
                        const isSelected = selectedIds.includes(product.id)
                        const rating = Number(product.rating ?? 0)

                        return (
                          <Table.Tr
                            className={isSelected ? 'product-row selected' : 'product-row'}
                            key={product.id}
                          >
                            <Table.Td>
                              <Checkbox
                                aria-label={`Выбрать ${product.title}`}
                                checked={isSelected}
                                onChange={() => toggleSelection(product.id)}
                              />
                            </Table.Td>
                            <Table.Td>
                              <Group gap="sm" wrap="nowrap">
                                <Avatar
                                  className="product-avatar"
                                  radius={10}
                                  src={product.thumbnail}
                                />
                                <Stack gap={0}>
                                  <Text fw={700}>{product.title}</Text>
                                  <Text c="dimmed" fz="sm">
                                    {product.category ?? 'Без категории'}
                                  </Text>
                                </Stack>
                              </Group>
                            </Table.Td>
                            <Table.Td>
                              <Text fw={700}>{product.brand ?? '—'}</Text>
                            </Table.Td>
                            <Table.Td>{resolveSku(product)}</Table.Td>
                            <Table.Td>
                              <Text c={rating < 3.5 ? 'red.7' : undefined}>
                                {rating.toFixed(1)}/5
                              </Text>
                            </Table.Td>
                            <Table.Td>{priceFormatter.format(product.price)}</Table.Td>
                            <Table.Td>
                              <Group gap="xs" justify="flex-end" wrap="nowrap">
                                <Tooltip label="Редактировать">
                                  <ActionIcon
                                    className="edit-row-action"
                                    color="blue"
                                    onClick={() => setEditingProduct(product)}
                                    radius="xl"
                                    size={34}
                                    variant="filled"
                                  >
                                    <IconPlus size={16} />
                                  </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Заглушка">
                                  <ActionIcon
                                    className="dots-row-action"
                                    radius="xl"
                                    size={34}
                                    variant="default"
                                  >
                                    <IconDots size={16} />
                                  </ActionIcon>
                                </Tooltip>
                              </Group>
                            </Table.Td>
                          </Table.Tr>
                        )
                      })}
                </Table.Tbody>
              </Table>
            </ScrollArea>

            <Group justify="space-between" mt="lg">
              {isTableLoading ? (
                <>
                  <Skeleton height={24} radius="sm" width={220} />
                  <Skeleton height={36} radius="md" width={180} />
                </>
              ) : (
                <>
                  <Text c="dimmed" fz="lg">
                    Показано {startNumber}-{endNumber} из {totalItems}
                  </Text>
                  <Pagination
                    onChange={setPage}
                    radius="md"
                    total={totalPages}
                    value={page}
                  />
                </>
              )}
            </Group>
          </>
        )}
      </Paper>

      <ProductFormModal
        mode="create"
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        opened={isCreateModalOpen}
      />
      <ProductFormModal
        mode="edit"
        onClose={() => setEditingProduct(null)}
        onSubmit={handleEditSubmit}
        opened={editingProduct !== null}
        product={editingProduct}
      />
    </main>
  )
}

export default ProductsPage
