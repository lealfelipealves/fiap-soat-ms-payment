import { Controller, Delete, HttpCode, Param } from '@nestjs/common'

import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { DeleteProductUseCase } from '@/domain/fastfood/application/use-cases/delete-product'

@ApiTags('Produtos')
@Controller('/products/:id')
export class DeleteProductController {
  constructor(private deleteProduct: DeleteProductUseCase) {}

  @Delete()
  @HttpCode(204)
  @ApiOperation({
    summary: 'Remover um produto'
  })
  async handle(@Param('id') id: string) {
    const result = await this.deleteProduct.execute({ productId: id })

    if (result.isLeft()) {
      throw new Error()
    }
  }
}
