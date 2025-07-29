import {
  Order as PrismaOrder,
  Prisma,
  OrderStatus,
  PaymentStatus as PrismaPaymentStatus
} from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/fastfood/enterprise/entities'
import { Status } from '@/domain/fastfood/enterprise/entities/value-objects'
import { PaymentStatus } from '@/domain/fastfood/enterprise/entities/value-objects/payment-status'

export class PrismaOrdersMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create(
      {
        customerId: new UniqueEntityID(raw.customerId),
        status: Status.create(raw.status),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        paymentId: raw.paymentId?.toString(),
        paymentStatus: PaymentStatus.create(raw.paymentStatus),
        total: raw.total
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      customerId: order.customerId.toString(),
      status: order.status.toString() as OrderStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      paymentId: order.paymentId,
      total: order.total,
      paymentStatus: order.paymentStatus?.toValue() as PrismaPaymentStatus
    }
  }
}
