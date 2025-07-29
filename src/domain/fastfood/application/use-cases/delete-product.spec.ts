import { makeProduct } from 'test/factories/make-product'
import { DeleteProductUseCase } from './delete-product'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: DeleteProductUseCase

describe('Delete Product', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new DeleteProductUseCase(inMemoryProductsRepository)
  })

  it('should be able to delete a product', async () => {
    const id = new UniqueEntityID()
    const newProduct = makeProduct({}, id)

    await inMemoryProductsRepository.create(newProduct)

    await sut.execute({
      productId: id.toString()
    })

    expect(inMemoryProductsRepository.items).toHaveLength(0)
  })
})
