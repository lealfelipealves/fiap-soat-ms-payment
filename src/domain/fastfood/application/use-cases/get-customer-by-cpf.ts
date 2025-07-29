import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CustomerRepository } from '@/domain/fastfood/application/repositories/customer-repository'
import { Customer } from '@/domain/fastfood/enterprise/entities'
import { Injectable } from '@nestjs/common'

interface GetCustomerByCpfUseCaseRequest {
  cpf: string
}

type GetCustomerByCpfUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    customer: Customer | null
  }
>

@Injectable()
export class GetCustomerByCpfUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute({
    cpf
  }: GetCustomerByCpfUseCaseRequest): Promise<GetCustomerByCpfUseCaseResponse> {
    const customer = await this.customerRepository.findByCpf(cpf)

    if (!customer) {
      return left(new ResourceNotFoundError())
    }

    return right({
      customer
    })
  }
}
