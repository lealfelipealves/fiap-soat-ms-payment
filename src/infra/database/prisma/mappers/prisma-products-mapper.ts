import {
  Product as PrismaProduct,
  Prisma,
  ProductCategory
} from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Product } from '@/domain/fastfood/enterprise/entities/product'
import { Category } from '@/domain/fastfood/enterprise/entities/value-objects/category'

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct): Product {
    return Product.create(
      {
        name: raw.name,
        description: raw.description,
        price: raw.price,
        category: Category.create(raw.category)
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(product: Product): Prisma.ProductUncheckedCreateInput {
    return {
      id: product.id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category.toString() as ProductCategory
    }
  }
}
