import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Customer, CustomerProps } from '@/domain/fastfood/enterprise/entities'
import { Injectable } from '@nestjs/common'
import { Email } from '@/domain/fastfood/enterprise/entities/value-objects'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaCustomerMapper } from '@/infra/database/prisma/mappers/prisma-customers-mapper'

export function makeCustomer(
  override: Partial<CustomerProps> = {},
  id?: UniqueEntityID
) {
  const customer = Customer.create(
    {
      name: faker.person.firstName(),
      email: Email.create(faker.internet.email()),
      ...override
    },
    id
  )

  return customer
}

@Injectable()
export class CustomerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCustomer(
    data: Partial<CustomerProps> = {}
  ): Promise<Customer> {
    const customer = makeCustomer(data)

    await this.prisma.customer.create({
      data: PrismaCustomerMapper.toPrisma(customer)
    })

    return customer
  }
}
