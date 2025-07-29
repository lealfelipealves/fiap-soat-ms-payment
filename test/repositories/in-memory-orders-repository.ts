import { OrderRepository } from '@/domain/fastfood/application/repositories/order-repository'
import { Order } from '@/domain/fastfood/enterprise/entities'
import { InMemoryProductsRepository } from './in-memory-products-repository'
import { InMemoryOrderProductsRepository } from './in-memory-order-products-repository'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryOrdersRepository implements OrderRepository {
  public items: Order[] = []

  constructor(
    private orderProductsRepository: InMemoryOrderProductsRepository,
    private productsRepository: InMemoryProductsRepository
  ) {}

  async getAll() {
    const orders = this.items.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )

    return orders
  }

  async create(order: Order) {
    this.items.push(order)

    await this.orderProductsRepository.createMany(order.products.getItems())

    DomainEvents.dispatchEventsForAggregate(order.id)
  }
}
