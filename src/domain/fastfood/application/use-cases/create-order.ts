import { OrderRepository } from '@/domain/fastfood/application/repositories/order-repository'
import { Order } from '@/domain/fastfood/enterprise/entities'
import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderProduct } from '../../enterprise/entities/order-product'
import { OrderProductList } from '../../enterprise/entities/order-product-list'
import { Injectable } from '@nestjs/common'

interface CreateOrderUseCaseRequest {
  customerId: string
  productIds: string[]
}

type CreateOrderUseCaseResponse = Either<
  null,
  {
    order: Order
  }
>

@Injectable()
export class CreateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute({
    customerId,
    productIds
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const order = Order.create({
      customerId: new UniqueEntityID(customerId)
    })

    const orderProducts = productIds.map((productId) => {
      return OrderProduct.create({
        orderId: order.id,
        productId: new UniqueEntityID(productId)
      })
    })

    order.products = new OrderProductList(orderProducts)

    await this.orderRepository.create(order)

    return right({
      order
    })
  }
}
