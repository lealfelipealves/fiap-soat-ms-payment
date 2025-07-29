import {
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Patch
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UpdateOrderStatusUseCase } from '@/domain/fastfood/application/use-cases/update-order-status'

@ApiTags('Pagamentos')
@Controller('/checkout/:id')
export class UpdateOrderStatusController {
  constructor(private updateOrderToInPreparation: UpdateOrderStatusUseCase) {}

  @Patch('/start-preparation')
  @ApiOperation({
    summary:
      'Atualizar status do pedido para "Preparação" após pagamento aprovado'
  })
  async handle(@Param('id') id: string) {
    const result = await this.updateOrderToInPreparation.execute({
      id
    })

    if (result.isLeft()) {
      const error = result.value
      if (error instanceof ResourceNotFoundError) {
        throw new HttpException('Pedido não encontrado', HttpStatus.NOT_FOUND)
      }

      throw new HttpException(
        { message: 'O pagamento do pedido não foi aprovado.' },
        HttpStatus.BAD_REQUEST
      )
    }

    return {
      message: 'Status atualizado para "Preparação".',
      orderId: id
    }
  }
}
