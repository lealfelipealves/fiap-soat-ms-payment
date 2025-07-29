import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { GetOrderPaymentStatusUseCase } from '@/domain/fastfood/application/use-cases/get-order-payment-status'

@ApiTags('Pedidos')
@Controller('/order/:id/payment-status')
export class GetOrderPaymentStatusController {
  constructor(private getOrderPaymentStatus: GetOrderPaymentStatusUseCase) {}

  @Get('')
  @ApiOperation({
    summary: 'Buscar status pagamento pedido'
  })
  async handle(@Param('id') id: string) {
    const result = await this.getOrderPaymentStatus.execute({ id })

    if (result.isLeft()) {
      throw new ResourceNotFoundError()
    }

    if (result.value.status === null) {
      throw new ResourceNotFoundError()
    }

    return { status: result.value.status }
  }
}
