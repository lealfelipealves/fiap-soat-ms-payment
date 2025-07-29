import { Either, right } from '@/core/either'
import { ProductRepository } from '../repositories/product-repository'
import { Product } from '../../enterprise/entities'
import { Injectable } from '@nestjs/common'

interface GetProductByCategoryUseCaseRequest {
  category: string
  page?: number
}

type GetProductByCategoryUseCaseResponse = Either<
  null,
  {
    products: Product[]
  }
>

@Injectable()
export class GetProductByCategoryUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    category
  }: GetProductByCategoryUseCaseRequest): Promise<GetProductByCategoryUseCaseResponse> {
    const products = await this.productRepository.findManyByCategory(category)

    return right({
      products
    })
  }
}
