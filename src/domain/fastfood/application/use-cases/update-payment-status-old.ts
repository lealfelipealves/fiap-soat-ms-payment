import { Either, left, right } from '@/core/either'
import { PaymentStatus } from '../../enterprise/entities/value-objects/payment-status'
import { OrderRepository } from '../repositories/order-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Order } from '@/domain/fastfood/enterprise/entities'

interface UpdatePaymentStatusUseCaseRequest {
  orderId: string
  paymentStatus: string
}

type UpdatePaymentStatusUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

export class UpdatePaymentStatusUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    orderId,
    paymentStatus
  }: UpdatePaymentStatusUseCaseRequest): Promise<UpdatePaymentStatusUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId)
    if (!order) {
      return left(new ResourceNotFoundError())
    }

    order.paymentStatus = PaymentStatus.create(paymentStatus)

    await this.orderRepository.save(order)

    return right({
      order
    })
  }
}
