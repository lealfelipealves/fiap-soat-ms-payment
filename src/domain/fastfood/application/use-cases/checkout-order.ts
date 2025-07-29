import { OrderRepository } from '@/domain/fastfood/application/repositories/order-repository'
import { Order } from '@/domain/fastfood/enterprise/entities'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Status } from '../../enterprise/entities/value-objects'

interface CheckoutOrderUseCaseRequest {
  id: string
}

type CheckoutOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class CheckoutOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute({
    id
  }: CheckoutOrderUseCaseRequest): Promise<CheckoutOrderUseCaseResponse> {
    const order = await this.orderRepository.findById(id)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    order.status = Status.create(Status.FINALIZED)

    await this.orderRepository.save(order)

    return right({
      order
    })
  }
}
