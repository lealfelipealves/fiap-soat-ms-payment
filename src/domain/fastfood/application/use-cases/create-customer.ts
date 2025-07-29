import { CustomerRepository } from '@/domain/fastfood/application/repositories/customer-repository'
import { Customer } from '@/domain/fastfood/enterprise/entities'
import { Cpf, Email } from '@/domain/fastfood/enterprise/entities/value-objects'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface CreateCustomerUseCaseRequest {
  cpf?: string
  name?: string
  email?: string
}

type CreateCustomerUseCaseResponse = Either<
  null,
  {
    customer: Customer
  }
>

@Injectable()
export class CreateCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute({
    cpf,
    name,
    email
  }: CreateCustomerUseCaseRequest): Promise<CreateCustomerUseCaseResponse> {
    const cpfValueObject = cpf ? Cpf.create(cpf) : undefined
    const emailValueObject = email ? Email.create(email) : undefined

    const customer = Customer.create({
      cpf: cpfValueObject,
      name: name,
      email: emailValueObject
    })

    await this.customerRepository.create(customer)

    return right({
      customer
    })
  }
}
