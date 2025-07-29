import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CustomerRepository } from '@/domain/fastfood/application/repositories/customer-repository'
import { PrismaCustomerMapper } from '../mappers/prisma-customers-mapper'
import { Customer } from '@/domain/fastfood/enterprise/entities'

@Injectable()
export class PrismaCustomersRepository implements CustomerRepository {
  constructor(private prisma: PrismaService) {}

  async findByCpf(cpf: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findFirst({
      where: {
        cpf
      }
    })

    if (!customer) {
      return null
    }

    return PrismaCustomerMapper.toDomain(customer)
  }

  async create(customer: Customer): Promise<void> {
    const data = PrismaCustomerMapper.toPrisma(customer)

    await this.prisma.customer.create({
      data
    })
  }
}
