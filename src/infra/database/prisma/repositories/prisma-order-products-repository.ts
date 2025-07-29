import { OrderProductsRepository } from '@/domain/fastfood/application/repositories/order-products-repository'
import { OrderProduct } from '@/domain/fastfood/enterprise/entities/order-product'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaOrderProductMapper } from '../mappers/prisma-order-product-mapper'

@Injectable()
export class PrismaOrderProductsRepository implements OrderProductsRepository {
  constructor(private prisma: PrismaService) {}

  // async findManyByOrderId(orderId: string): Promise<OrderProduct[]> {
  //   const orderProducts = await this.prisma.product.findMany({
  //     where: {
  //       orderId
  //     }
  //   })

  //   return orderProducts.map(PrismaOrderProductMapper.toDomain)
  // }

  async createMany(products: OrderProduct[]): Promise<void> {
    if (products.length === 0) {
      return
    }

    await this.prisma.orderProduct.createMany({
      data: PrismaOrderProductMapper.toPrisma(products).data
    })
  }

  async deleteMany(products: OrderProduct[]): Promise<void> {
    if (products.length === 0) {
      return
    }

    const productsIds = products.map((product) => {
      return product.id.toString()
    })

    await this.prisma.product.deleteMany({
      where: {
        id: {
          in: productsIds
        }
      }
    })
  }

  // async deleteManyByOrderId(orderId: string): Promise<void> {
  //   await this.prisma.product.deleteMany({
  //     where: {
  //       orderId
  //     }
  //   })
  // }
}
