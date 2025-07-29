import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CreateOrderUseCase } from './create-order'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryOrderProductsRepository } from 'test/repositories/in-memory-order-products-repository'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let inMemoryOrderProductsRepository: InMemoryOrderProductsRepository
let sut: CreateOrderUseCase

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryOrderProductsRepository = new InMemoryOrderProductsRepository()
    inMemoryProductsRepository = new InMemoryProductsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderProductsRepository,
      inMemoryProductsRepository
    )
    sut = new CreateOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to create a order', async () => {
    const result = await sut.execute({
      customerId: '123456',
      productIds: ['1', '2']
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items[0]).toEqual(result.value?.order)
    expect(
      inMemoryOrdersRepository.items[0].products.currentItems
    ).toHaveLength(2)
    expect(inMemoryOrdersRepository.items[0].products.currentItems).toEqual([
      expect.objectContaining({ productId: new UniqueEntityID('1') }),
      expect.objectContaining({ productId: new UniqueEntityID('2') })
    ])
  })

  it('should persist products when creating a new order', async () => {
    const result = await sut.execute({
      customerId: '123456',
      productIds: ['1', '2']
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderProductsRepository.items).toHaveLength(2)
    expect(inMemoryOrderProductsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          productId: new UniqueEntityID('1')
        }),
        expect.objectContaining({
          productId: new UniqueEntityID('1')
        })
      ])
    )
  })
})
