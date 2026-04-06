import { Group, Pagination, Skeleton, Text } from '@mantine/core'

interface ProductsFooterProps {
  isLoading: boolean
  page: number
  totalPages: number
  startNumber: number
  endNumber: number
  totalItems: number
  onSetPage: (page: number) => void
}

const ProductsFooter = ({
  isLoading,
  page,
  totalPages,
  startNumber,
  endNumber,
  totalItems,
  onSetPage,
}: ProductsFooterProps) => (
  <Group justify="space-between" mt="lg">
    {isLoading ? (
      <>
        <Skeleton height={24} radius="sm" width={220} />
        <Skeleton height={36} radius="md" width={180} />
      </>
    ) : (
      <>
        <Text c="dimmed" fz="lg">
          Показано {startNumber}-{endNumber} из {totalItems}
        </Text>
        <Pagination onChange={onSetPage} radius="md" total={totalPages} value={page} />
      </>
    )}
  </Group>
)

export default ProductsFooter
