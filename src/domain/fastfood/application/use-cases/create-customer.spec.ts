import { CreateCustomerUseCase } from './create-customer'
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository'

let inMemoryCustomersRepository: InMemoryCustomersRepository
let sut: CreateCustomerUseCase

describe('Create Customer', () => {
  beforeEach(() => {
    inMemoryCustomersRepository = new InMemoryCustomersRepository()
    sut = new CreateCustomerUseCase(inMemoryCustomersRepository)
  })

  it('should be able to create a customer', async () => {
    const result = await sut.execute({
      cpf: '24178530003',
      name: 'Customer 1',
      email: 'customer1@email.com'
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCustomersRepository.items[0]).toEqual(result.value?.customer)
    expect(inMemoryCustomersRepository.items[0].name).toEqual('Customer 1')
    expect(inMemoryCustomersRepository.items[0].email?.toString()).toEqual(
      'customer1@email.com'
    )
  })
})
