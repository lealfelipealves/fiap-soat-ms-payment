import { Either, left, right } from '@/core/either'
import { OrderRepository } from '../repositories/order-repository'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { PaymentStatus } from '../../enterprise/entities/value-objects/payment-status'

interface GetOrderPaymentStatusUseCaseRequest {
  id: string
}

type GetOrderPaymentStatusUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    status: PaymentStatus | ''
  }
>

@Injectable()
export class GetOrderPaymentStatusUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute({
    id
  }: GetOrderPaymentStatusUseCaseRequest): Promise<GetOrderPaymentStatusUseCaseResponse> {
    const order = await this.orderRepository.findById(id)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    return right({
      status: order.paymentStatus || ''
    })
  }
}
