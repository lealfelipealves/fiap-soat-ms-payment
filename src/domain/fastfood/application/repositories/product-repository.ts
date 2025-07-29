import { Product } from '@/domain/fastfood/enterprise/entities/product'

export abstract class ProductRepository {
  abstract findById(id: string): Promise<Product | null>
  abstract findManyByCategory(category: string): Promise<Product[]>
  abstract save(product: Product): Promise<void>
  abstract create(product: Product): Promise<void>
  abstract delete(product: Product): Promise<void>
}
