export interface Product {
  id: number
  title: string
  description?: string
  category?: string
  price: number
  rating: number
  brand?: string
  sku?: string
  thumbnail?: string
}

export interface ProductCollectionResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface ProductDraft {
  title: string
  price: number
  brand: string
  sku: string
  category?: string
  rating?: number
}
