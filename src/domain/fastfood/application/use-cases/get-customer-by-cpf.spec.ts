import { GetCustomerByCpfUseCase } from './get-customer-by-cpf'
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository'
import { makeCustomer } from 'test/factories/make-customer'
import { Cpf } from '../../enterprise/entities/value-objects'

let inMemoryCustomersRepository: InMemoryCustomersRepository
let sut: GetCustomerByCpfUseCase

describe('Get Customer By Cpf', () => {
  beforeEach(() => {
    inMemoryCustomersRepository = new InMemoryCustomersRepository()
    sut = new GetCustomerByCpfUseCase(inMemoryCustomersRepository)
  })

  it('should be able to get a customer by cpf', async () => {
    const newCustomer = makeCustomer({
      cpf: Cpf.create('24178530003')
    })

    await inMemoryCustomersRepository.create(newCustomer)

    const result = await sut.execute({
      cpf: '24178530003'
    })

    expect(result.value).toMatchObject({
      customer: expect.objectContaining({
        cpf: newCustomer.cpf
      })
    })
  })
})
