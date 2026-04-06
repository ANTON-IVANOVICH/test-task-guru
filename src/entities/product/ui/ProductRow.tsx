import {
  ActionIcon,
  Avatar,
  Checkbox,
  Group,
  Stack,
  Table,
  Text,
  Tooltip,
} from '@mantine/core'
import { IconDots, IconPlus } from '@tabler/icons-react'

import { formatPrice, resolveSku } from '@/entities/product/lib/formatters'
import type { Product } from '@/entities/product/model/types'

interface ProductRowProps {
  product: Product
  isSelected: boolean
  onToggleSelection: (id: number) => void
  onOpenEdit: (product: Product) => void
}

const ProductRow = ({
  product,
  isSelected,
  onToggleSelection,
  onOpenEdit,
}: ProductRowProps) => {
  const rating = Number(product.rating ?? 0)

  return (
    <Table.Tr className={isSelected ? 'product-row selected' : 'product-row'}>
      <Table.Td>
        <Checkbox
          aria-label={`Выбрать ${product.title}`}
          checked={isSelected}
          onChange={() => onToggleSelection(product.id)}
        />
      </Table.Td>
      <Table.Td>
        <Group gap="sm" wrap="nowrap">
          <Avatar className="product-avatar" radius={10} src={product.thumbnail} />
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
        <Text c={rating < 3.5 ? 'red.7' : undefined}>{rating.toFixed(1)}/5</Text>
      </Table.Td>
      <Table.Td>{formatPrice(product.price)}</Table.Td>
      <Table.Td>
        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <Tooltip label="Редактировать">
            <ActionIcon
              className="edit-row-action"
              color="blue"
              onClick={() => onOpenEdit(product)}
              radius="xl"
              size={34}
              variant="filled"
            >
              <IconPlus size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Заглушка">
            <ActionIcon className="dots-row-action" radius="xl" size={34} variant="default">
              <IconDots size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  )
}

export default ProductRow
