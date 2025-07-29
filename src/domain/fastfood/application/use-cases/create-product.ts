import { ProductRepository } from '@/domain/fastfood/application/repositories/product-repository'
import { Product } from '@/domain/fastfood/enterprise/entities'
import { Category } from '@/domain/fastfood/enterprise/entities/value-objects'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface CreateProductUseCaseRequest {
  name: string
  description: string
  price: number
  category: string
}

type CreateProductUseCaseResponse = Either<
  null,
  {
    product: Product
  }
>

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute({
    name,
    description,
    price,
    category
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const product = Product.create({
      name: name,
      description: description,
      price: price,
      category: Category.create(category)
    })

    await this.productRepository.create(product)

    return right({
      product
    })
  }
}
