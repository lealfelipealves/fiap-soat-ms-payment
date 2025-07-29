import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { CreateOrderUseCase } from '@/domain/fastfood/application/use-cases/create-order'
import { OrderPresenter } from '../presenters/order-presenter'

import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'

import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const createOrderBodySchema = z.object({
  customerId: z.string().uuid(),
  productIds: z.array(z.string().uuid())
})

const bodyValidationPipe = new ZodValidationPipe(createOrderBodySchema)

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>

@ApiTags('Pedidos')
@Controller('/orders')
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Enviar os produtos escolhidos para a fila'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        customerId: { type: 'string' },
        productIds: { type: 'array', items: { type: 'string' } }
      }
    }
  })
  async handle(@Body(bodyValidationPipe) body: CreateOrderBodySchema) {
    const { customerId, productIds } = body
    const result = await this.createOrder.execute({
      customerId,
      productIds
    })

    if (result.isLeft()) {
      throw new Error()
    }

    return { order: OrderPresenter.toHTTP(result.value.order) }
  }
}
