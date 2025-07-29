import { ProductRepository } from '@/domain/fastfood/application/repositories/product-repository'
import { Product } from '@/domain/fastfood/enterprise/entities'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface EditProductUseCaseRequest {
  productId: string
  name?: string
  description?: string
  price?: number
  category?: string
}

type EditProductUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    product: Product
  }
>

@Injectable()
export class EditProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute({
    productId,
    name,
    description,
    price,
    category
  }: EditProductUseCaseRequest): Promise<EditProductUseCaseResponse> {
    const product = await this.productRepository.findById(productId)

    if (!product) {
      return left(new ResourceNotFoundError())
    }

    product.name = name ?? product.name
    product.description = description ?? product.description
    product.price = price ?? product.price
    product.category = category ?? product.category.toString()

    await this.productRepository.save(product)

    return right({
      product
    })
  }
}
