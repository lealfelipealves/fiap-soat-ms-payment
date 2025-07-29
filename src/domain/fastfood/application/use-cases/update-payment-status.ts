import { OrderRepository } from '@/domain/fastfood/application/repositories/order-repository'
import { Order } from '@/domain/fastfood/enterprise/entities'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { PaymentStatus } from '../../enterprise/entities/value-objects'

interface UpdatePaymentStatusUseCaseRequest {
  id: string
  paymentStatus: string
}

type UpdatePaymentStatusUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class UpdatePaymentStatusUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute({
    id,
    paymentStatus
  }: UpdatePaymentStatusUseCaseRequest): Promise<UpdatePaymentStatusUseCaseResponse> {
    const order = await this.orderRepository.findById(id)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    order.paymentStatus = PaymentStatus.create(paymentStatus)

    await this.orderRepository.save(order)

    return right({ order })
  }
}
