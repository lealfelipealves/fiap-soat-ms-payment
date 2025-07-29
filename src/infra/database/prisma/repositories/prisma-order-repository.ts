import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { OrderRepository } from '@/domain/fastfood/application/repositories/order-repository'
import { PrismaOrdersMapper } from '../mappers/prisma-orders-mapper'
import { Order } from '@/domain/fastfood/enterprise/entities'
import { OrderProductsRepository } from '@/domain/fastfood/application/repositories/order-products-repository'
import { DomainEvents } from '@/core/events/domain-events'
@Injectable()
export class PrismaOrdersRepository implements OrderRepository {
  constructor(
    private prisma: PrismaService,
    private orderProductRepository: OrderProductsRepository
  ) {}

  async getAll(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        status: {
          not: 'Finalizado'
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!orders) {
      return []
    }

    const statusOrder = ['Pronto', 'Preparação', 'Recebido']

    const sortedOrders = orders
      .filter((order) => statusOrder.includes(order.status))
      .sort((a, b) => {
        const statusA = statusOrder.indexOf(a.status)
        const statusB = statusOrder.indexOf(b.status)

        if (statusA === statusB) {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        }

        return statusA - statusB
      })

    return sortedOrders.map(PrismaOrdersMapper.toDomain)
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id
      }
    })

    if (!order) {
      return null
    }

    return PrismaOrdersMapper.toDomain(order)
  }

  async create(order: Order): Promise<void> {
    const data = PrismaOrdersMapper.toPrisma(order)

    await this.prisma.order.create({
      data
    })

    await this.orderProductRepository.createMany(order.products.getItems())

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrdersMapper.toPrisma(order)

    await this.prisma.order.update({
      where: {
        id: order.id.toString()
      },
      data
    })

    await this.orderProductRepository.deleteMany(order.products.getItems())

    await this.orderProductRepository.createMany(order.products.getItems())

    DomainEvents.dispatchEventsForAggregate(order.id)
  }
}
