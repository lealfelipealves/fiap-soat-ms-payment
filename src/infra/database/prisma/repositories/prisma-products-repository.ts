import { ProductRepository } from '@/domain/fastfood/application/repositories/product-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Product } from '@/domain/fastfood/enterprise/entities'
import { PrismaProductMapper } from '../mappers/prisma-products-mapper'
import { ProductCategory } from '@prisma/client'

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private prisma: PrismaService) {}
  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: {
        id
      }
    })

    if (!product) {
      return null
    }

    return PrismaProductMapper.toDomain(product)
  }

  async findManyByCategory(category: string): Promise<Product[]> {
    const product = await this.prisma.product.findMany({
      where: {
        category: category as ProductCategory
      }
    })

    return product.map(PrismaProductMapper.toDomain)
  }

  async save(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product)

    await this.prisma.product.update({
      where: {
        id: product.id.toString()
      },
      data
    })
  }

  async create(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product)

    await this.prisma.product.create({
      data
    })
  }

  async delete(product: Product): Promise<void> {
    await this.prisma.product.delete({
      where: {
        id: product.id.toString()
      }
    })
  }
}
