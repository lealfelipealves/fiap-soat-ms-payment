import { makeProduct } from 'test/factories/make-product'
import { GetProductByCategoryUseCase } from './get-product-by-category'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { Category } from '../../enterprise/entities/value-objects'

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: GetProductByCategoryUseCase

describe('Get Product By Category', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new GetProductByCategoryUseCase(inMemoryProductsRepository)
  })

  it('should be able to get a product by category', async () => {
    const category = Category.create(Category.DRINK)
    const newProduct = makeProduct({
      category: category
    })
    await inMemoryProductsRepository.create(newProduct)

    const result = await sut.execute({
      category: Category.DRINK
    })

    expect(result.value?.products).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: newProduct.name,
          description: newProduct.description,
          price: newProduct.price,
          category: category
        })
      ])
    )
  })
})
