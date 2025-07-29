import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Product, ProductProps } from '@/domain/fastfood/enterprise/entities'
import { Category } from '@/domain/fastfood/enterprise/entities/value-objects'

export function makeProduct(
  override: Partial<ProductProps> = {},
  id?: UniqueEntityID
) {
  const category = Category.create(
    faker.helpers.arrayElement(Category.VALID_CATEGORIES)
  )

  const product = Product.create(
    {
      name: faker.person.firstName(),
      description: faker.lorem.sentence(),
      price: faker.number.float(),
      category: category,
      ...override
    },
    id
  )

  return product
}
