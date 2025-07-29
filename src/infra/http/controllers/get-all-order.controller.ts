import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { GetAllOrderUseCase } from '@/domain/fastfood/application/use-cases/get-all-order'
import { OrderPresenter } from '../presenters/order-presenter'

@ApiTags('Pedidos')
@Controller('/orders')
export class GetAllOrderController {
  constructor(private getAllOrder: GetAllOrderUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Listar os pedidos'
  })
  async handle() {
    const result = await this.getAllOrder.execute()

    if (result.isLeft()) {
      throw new ResourceNotFoundError()
    }

    const { orders } = result.value

    return { orders: orders.map(OrderPresenter.toHTTP) }
  }
}
