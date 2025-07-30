import { DomainEvents } from '@/core/events/domain-events'
import { OrderRepository } from '@/domain/fastfood/application/repositories/order-repository'
import { Order } from '@/domain/fastfood/enterprise/entities'
import { InMemoryOrderProductsRepository } from './in-memory-order-products-repository'
import { InMemoryProductsRepository } from './in-memory-products-repository'

export class InMemoryOrdersRepository implements OrderRepository {
  public items: Order[] = []

  constructor(
    private orderProductsRepository?: InMemoryOrderProductsRepository,
    private productsRepository?: InMemoryProductsRepository
  ) {}

  async getAll() {
    const orders = this.items.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )

    return orders
  }

  async findById(id: string) {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }

  async save(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id.equals(order.id))

    if (itemIndex >= 0) {
      this.items[itemIndex] = order
    }
  }

  async create(order: Order) {
    this.items.push(order)

    if (this.orderProductsRepository) {
      await this.orderProductsRepository.createMany(order.products.getItems())
    }

    DomainEvents.dispatchEventsForAggregate(order.id)
  }
}
