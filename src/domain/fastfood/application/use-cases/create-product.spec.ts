import { CreateProductUseCase } from './create-product'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: CreateProductUseCase

describe('Create Product', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new CreateProductUseCase(inMemoryProductsRepository)
  })

  it('should be able to create a product', async () => {
    const result = await sut.execute({
      name: 'Product 1',
      description: 'Product 1 description',
      price: 100,
      category: 'Lanche'
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProductsRepository.items[0]).toEqual(result.value?.product)
    expect(inMemoryProductsRepository.items[0].name).toEqual('Product 1')
    expect(inMemoryProductsRepository.items[0].description).toEqual(
      'Product 1 description'
    )
    expect(inMemoryProductsRepository.items[0].price).toEqual(100)
    expect(inMemoryProductsRepository.items[0].category.getValue()).toEqual(
      'Lanche'
    )
  })
})
