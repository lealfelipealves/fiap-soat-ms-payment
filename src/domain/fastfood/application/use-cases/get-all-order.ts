import { Either, right } from '@/core/either'
import { OrderRepository } from '../repositories/order-repository'
import { Injectable } from '@nestjs/common'
import { Order } from '../../enterprise/entities'

type GetAllOrderUseCaseResponse = Either<
  null,
  {
    orders: Order[]
  }
>

@Injectable()
export class GetAllOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(): Promise<GetAllOrderUseCaseResponse> {
    const orders = await this.orderRepository.getAll()

    return right({
      orders
    })
  }
}
