import { Button, Group, Paper, TextInput, Title } from '@mantine/core'
import { IconLogout, IconSearch } from '@tabler/icons-react'

interface ProductsToolbarProps {
  search: string
  setSearch: (value: string) => void
  onLogout: () => void
}

const ProductsToolbar = ({ search, setSearch, onLogout }: ProductsToolbarProps) => (
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
      <Button leftSection={<IconLogout size={16} />} onClick={onLogout} variant="default">
        Выйти
      </Button>
    </Group>
  </Paper>
)

export default ProductsToolbar
