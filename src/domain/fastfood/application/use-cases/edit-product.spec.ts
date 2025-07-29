import { makeProduct } from 'test/factories/make-product'
import { EditProductUseCase } from './edit-product'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: EditProductUseCase

describe('Edit Product', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new EditProductUseCase(inMemoryProductsRepository)
  })

  it('should be able to edit a product', async () => {
    const id = new UniqueEntityID()
    const newProduct = makeProduct({}, id)

    await inMemoryProductsRepository.create(newProduct)

    const result = await sut.execute({
      productId: newProduct.id.toValue(),
      name: 'Product 1 Editado',
      description: 'Product 1 Editado description',
      price: 250,
      category: 'Sobremesa'
    })

    expect(result.isRight()).toBe(true)
  })
})
