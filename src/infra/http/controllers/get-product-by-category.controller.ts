import { Controller, Get, Param } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { GetProductByCategoryUseCase } from '@/domain/fastfood/application/use-cases/get-product-by-category'
import { ProductPresenter } from '../presenters/product-presenter'
import { Category } from '@/domain/fastfood/enterprise/entities/value-objects'

@ApiTags('Produtos')
@Controller('/products/:category')
export class GetProductByCategoryController {
  constructor(private getProductByCategory: GetProductByCategoryUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Buscar produtos por categoria'
  })
  @ApiParam({
    name: 'category',
    type: 'string',
    enum: Category.VALID_CATEGORIES,
    required: true
  })
  async handle(@Param('category') category: string) {
    const result = await this.getProductByCategory.execute({
      category
    })

    if (result.isLeft()) {
      throw new ResourceNotFoundError()
    }

    const { products } = result.value

    return { products: products.map(ProductPresenter.toHTTP) }
  }
}
