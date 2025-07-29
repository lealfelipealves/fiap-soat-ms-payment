import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaCustomersRepository } from './prisma/repositories/prisma-customers-repository'
import { CustomerRepository } from '@/domain/fastfood/application/repositories/customer-repository'
import { ProductRepository } from '@/domain/fastfood/application/repositories/product-repository'
import { PrismaProductRepository } from './prisma/repositories/prisma-products-repository'
import { OrderRepository } from '@/domain/fastfood/application/repositories/order-repository'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-order-repository'
import { OrderProductsRepository } from '@/domain/fastfood/application/repositories/order-products-repository'
import { PrismaOrderProductsRepository } from './prisma/repositories/prisma-order-products-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: CustomerRepository,
      useClass: PrismaCustomersRepository
    },
    {
      provide: ProductRepository,
      useClass: PrismaProductRepository
    },
    {
      provide: OrderRepository,
      useClass: PrismaOrdersRepository
    },
    {
      provide: OrderProductsRepository,
      useClass: PrismaOrderProductsRepository
    }
  ],
  exports: [
    PrismaService,
    CustomerRepository,
    ProductRepository,
    OrderRepository,
    OrderProductsRepository
  ]
})
export class DatabaseModule {}
