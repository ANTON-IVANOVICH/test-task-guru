import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
  Title,
  Tooltip,
} from '@mantine/core'
import { IconPlus, IconRefresh } from '@tabler/icons-react'

import type { SortField, SortOrder } from '@/entities/product/lib/sort'
import type { Product } from '@/entities/product/model/types'
import ProductRow from '@/entities/product/ui/ProductRow'
import ProductRowSkeleton from '@/entities/product/ui/ProductRowSkeleton'
import SortableHeader from '@/entities/product/ui/SortableHeader'

interface ProductsTableProps {
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
  onRefresh: () => void
  onOpenCreate: () => void
}

const SKELETON_ROWS_COUNT = 6

const ProductsTable = ({
  rows,
  isLoading,
  isError,
  errorMessage,
  sortField,
  sortOrder,
  selectedIds,
  currentPageIds,
  isCurrentPageSelected,
  isCurrentPagePartiallySelected,
  onToggleSort,
  onToggleSelection,
  onTogglePageSelection,
  onRetry,
  onOpenEdit,
  onRefresh,
  onOpenCreate,
}: ProductsTableProps) => (
  <>
    <Group justify="space-between" mb="lg">
      <Title order={3}>Все позиции</Title>
      <Group gap="sm">
        <Tooltip label="Обновить таблицу">
          <ActionIcon
            aria-label="Обновить таблицу"
            onClick={onRefresh}
            size={40}
            variant="default"
          >
            <IconRefresh size={18} />
          </ActionIcon>
        </Tooltip>
        <Button leftSection={<IconPlus size={16} />} onClick={onOpenCreate} size="md">
          Добавить
        </Button>
      </Group>
    </Group>

    {isError ? (
      <Stack align="center" gap={6} py="xl">
        <Text c="red.7" ta="center">
          {errorMessage ?? 'Не удалось загрузить товары'}
        </Text>
        <Button onClick={onRetry} variant="light">
          Повторить
        </Button>
      </Stack>
    ) : (
      <ScrollArea>
        <Table className="products-table" highlightOnHover verticalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={44}>
                <Checkbox
                  aria-label="Выбрать все строки на странице"
                  checked={isCurrentPageSelected}
                  indeterminate={isCurrentPagePartiallySelected}
                  onChange={() => onTogglePageSelection(currentPageIds)}
                />
              </Table.Th>
              <Table.Th>
                <SortableHeader
                  activeSortField={sortField}
                  field="title"
                  label="Наименование"
                  onSort={onToggleSort}
                  sortOrder={sortOrder}
                />
              </Table.Th>
              <Table.Th>
                <SortableHeader
                  activeSortField={sortField}
                  field="brand"
                  label="Вендор"
                  onSort={onToggleSort}
                  sortOrder={sortOrder}
                />
              </Table.Th>
              <Table.Th>
                <SortableHeader
                  activeSortField={sortField}
                  field="sku"
                  label="Артикул"
                  onSort={onToggleSort}
                  sortOrder={sortOrder}
                />
              </Table.Th>
              <Table.Th w={140}>
                <SortableHeader
                  activeSortField={sortField}
                  field="rating"
                  label="Оценка"
                  onSort={onToggleSort}
                  sortOrder={sortOrder}
                />
              </Table.Th>
              <Table.Th w={170}>
                <SortableHeader
                  activeSortField={sortField}
                  field="price"
                  label="Цена, ₽"
                  onSort={onToggleSort}
                  sortOrder={sortOrder}
                />
              </Table.Th>
              <Table.Th w={140} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading
              ? Array.from({ length: SKELETON_ROWS_COUNT }).map((_, index) => (
                  <ProductRowSkeleton key={`skeleton-${index}`} />
                ))
              : rows.map((product) => (
                  <ProductRow
                    isSelected={selectedIds.includes(product.id)}
                    key={product.id}
                    onOpenEdit={onOpenEdit}
                    onToggleSelection={onToggleSelection}
                    product={product}
                  />
                ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    )}
  </>
)

export default ProductsTable
