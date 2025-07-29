import {
  Order as PrismaOrder,
  Customer as PrismaCustomer,
  Product as PrismaProduct
} from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Status } from '@/domain/fastfood/enterprise/entities/value-objects'
import { OrderDetails } from '@/domain/fastfood/enterprise/entities/value-objects/order-details'
import { PrismaProductMapper } from './prisma-products-mapper'

type PrismaOrderDetails = PrismaOrder & {
  customer: PrismaCustomer
  products: PrismaProduct[]
}

export class PrismaOrderDetailsMapper {
  static toDomain(raw: PrismaOrderDetails): OrderDetails {
    return OrderDetails.create({
      customerId: new UniqueEntityID(raw.id),
      status: Status.create(raw.status),
      products: raw.products.map(PrismaProductMapper.toDomain),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    })
  }
}
