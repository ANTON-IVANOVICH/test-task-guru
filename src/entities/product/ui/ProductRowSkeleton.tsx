import { Group, Skeleton, Stack, Table } from '@mantine/core'

const ProductRowSkeleton = () => (
  <Table.Tr className="product-row">
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
)

export default ProductRowSkeleton
