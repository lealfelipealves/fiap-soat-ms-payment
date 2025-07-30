import { GetOrderPaymentStatusUseCase } from '@/domain/fastfood/application/use-cases/get-order-payment-status'
import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Pagamentos')
@Controller('/payments')
export class GetPaymentStatusController {
  constructor(private getOrderPaymentStatus: GetOrderPaymentStatusUseCase) {}

  @Get('/:orderId/status')
  @ApiOperation({
    summary: 'Consultar status de pagamento de um pedido'
  })
  async handle(@Param('orderId') orderId: string) {
    const result = await this.getOrderPaymentStatus.execute({ id: orderId })

    if (result.isLeft()) {
      throw new Error('Pedido não encontrado')
    }

    return {
      orderId,
      paymentStatus:
        typeof result.value.status === 'string'
          ? result.value.status
          : result.value.status?.getValue() || 'Não definido'
    }
  }
}
