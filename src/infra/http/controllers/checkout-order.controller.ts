import { Controller, Param, Put } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CheckoutOrderUseCase } from '@/domain/fastfood/application/use-cases/checkout-order'
import { OrderPresenter } from '../presenters/order-presenter'

@ApiTags('Pagamentos')
@Controller('/checkout/:id')
export class CheckoutOrderController {
  constructor(private checkoutOrder: CheckoutOrderUseCase) {}

  @Put()
  @ApiOperation({
    summary: 'Finalização do pedido',
    description: 'O checkout é a finalização do pedido'
  })
  async handle(@Param('id') id: string) {
    const result = await this.checkoutOrder.execute({ id })

    if (result.isLeft()) {
      throw new ResourceNotFoundError()
    }

    const { order } = result.value

    return { order: OrderPresenter.toHTTP(order) }
  }
}
