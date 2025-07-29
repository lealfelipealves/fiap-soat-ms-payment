import { Customer as PrismaCustomer, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Customer } from '@/domain/fastfood/enterprise/entities/customer'
import { Cpf, Email } from '@/domain/fastfood/enterprise/entities/value-objects'

export class PrismaCustomerMapper {
  static toDomain(raw: PrismaCustomer): Customer {
    const cpfValueObject = raw.cpf ? Cpf.create(raw.cpf) : undefined
    const emailValueObject = raw.email ? Email.create(raw.email) : undefined

    return Customer.create(
      {
        cpf: cpfValueObject,
        name: raw.name ?? undefined,
        email: emailValueObject
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(customer: Customer): Prisma.CustomerUncheckedCreateInput {
    return {
      id: customer.id.toString(),
      cpf: customer.cpf?.toString(),
      name: customer.name,
      email: customer.email?.toString()
    }
  }
}
