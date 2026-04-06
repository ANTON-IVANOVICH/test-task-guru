import { Group, Text, UnstyledButton } from '@mantine/core'
import {
  IconArrowsSort,
  IconChevronDown,
  IconChevronUp,
} from '@tabler/icons-react'

import type { SortField, SortOrder } from '@/entities/product/lib/sort'

interface SortableHeaderProps {
  label: string
  field: SortField
  activeSortField: SortField | null
  sortOrder: SortOrder
  onSort: (field: SortField) => void
}

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

export default SortableHeader
