import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UpdatePaymentStatusUseCase } from '@/domain/fastfood/application/use-cases/update-payment-status'
import { PaymentStatus } from '@/domain/fastfood/enterprise/entities/value-objects'
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  HttpException
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger'

@ApiTags('Pagamentos')
@Controller('/webhooks')
export class PaymentWebhookController {
  constructor(private updateOrderPaymentStatus: UpdatePaymentStatusUseCase) {}

  @Post('/mercado-pago')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Simular webhook de pagamento aprovado ou recusado'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        orderId: { type: 'string' },
        paymentStatus: {
          type: 'string',
          enum: PaymentStatus.VALID_STATUS.slice()
        }
      }
    }
  })
  async handle(@Body() body: { orderId: string; paymentStatus: string }) {
    const { orderId, paymentStatus } = body

    if (!orderId || !paymentStatus) return

    const result = await this.updateOrderPaymentStatus.execute({
      id: orderId,
      paymentStatus
    })

    if (result.isLeft()) {
      const error = result.value
      if (error instanceof ResourceNotFoundError) {
        throw new HttpException('Pedido não encontrado', HttpStatus.NOT_FOUND)
      }

      throw new HttpException(
        { message: 'O status do pagamento não foi atualizado.' },
        HttpStatus.BAD_REQUEST
      )
    }
  }
}
