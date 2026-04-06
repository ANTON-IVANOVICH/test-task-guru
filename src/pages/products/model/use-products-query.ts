import { useDebouncedValue } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'

import { fetchProducts } from '@/entities/product/api/product-api'
import type { Product } from '@/entities/product/model/types'
import { ApiError } from '@/shared/api/http'

interface ProductsQueryModel {
  debouncedSearch: string
  products: Product[]
  isLoading: boolean
  isError: boolean
  errorMessage: string | null
  refetch: () => Promise<unknown>
}

export const useProductsQuery = (search: string): ProductsQueryModel => {
  const [debouncedSearch] = useDebouncedValue(search, 350)

  const productsQuery = useQuery({
    queryKey: ['products', debouncedSearch],
    queryFn: () => fetchProducts(debouncedSearch),
    staleTime: 60_000,
    retry: 1,
  })

  const errorMessage = productsQuery.isError
    ? productsQuery.error instanceof ApiError
      ? productsQuery.error.message
      : 'Не удалось загрузить товары'
    : null

  return {
    debouncedSearch,
    products: productsQuery.data ?? [],
    isLoading: productsQuery.isFetching && !productsQuery.isError,
    isError: productsQuery.isError,
    errorMessage,
    refetch: productsQuery.refetch,
  }
}
