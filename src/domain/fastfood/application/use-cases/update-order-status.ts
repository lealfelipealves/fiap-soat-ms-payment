import { OrderRepository } from '@/domain/fastfood/application/repositories/order-repository'
import { Order } from '@/domain/fastfood/enterprise/entities'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Status } from '../../enterprise/entities/value-objects'

interface UpdateOrderStatusUseCaseRequest {
  id: string
}

type UpdateOrderStatusUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute({
    id
  }: UpdateOrderStatusUseCaseRequest): Promise<UpdateOrderStatusUseCaseResponse> {
    const order = await this.orderRepository.findById(id)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (!order.paymentStatus || order.paymentStatus.toValue() !== 'Aprovado') {
      return left(new Error('O pagamento do pedido não foi aprovado.'))
    }

    if (!order.status.canTransitionTo('Preparação')) {
      return left(
        new Error(
          `Não é possível mudar o status de ${order.status.toValue()} para Preparação.`
        )
      )
    }

    order.status = Status.create('Preparação')

    await this.orderRepository.save(order)

    return right({ order })
  }
}
