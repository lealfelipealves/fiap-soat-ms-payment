import { GetAllOrderUseCase } from './get-all-order'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'
import { InMemoryOrderProductsRepository } from 'test/repositories/in-memory-order-products-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order } from '../../enterprise/entities'
import { OrderProductList } from '../../enterprise/entities/order-product-list'
import { OrderProduct } from '../../enterprise/entities/order-product'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryProductsRepository: InMemoryProductsRepository
let inMemoryOrderProductsRepository: InMemoryOrderProductsRepository
let sut: GetAllOrderUseCase

describe('Get All Orders Use Case', () => {
  beforeEach(() => {
    inMemoryOrderProductsRepository = new InMemoryOrderProductsRepository()
    inMemoryProductsRepository = new InMemoryProductsRepository()

    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderProductsRepository,
      inMemoryProductsRepository
    )
    sut = new GetAllOrderUseCase(inMemoryOrdersRepository)
  })

  it('should return all orders', async () => {
    const customerId = '123456'
    const productIds = ['1', '2']

    const order = Order.create({
      customerId: new UniqueEntityID(customerId)
    })

    const orderProducts = productIds.map((productId) => {
      return OrderProduct.create({
        orderId: order.id,
        productId: new UniqueEntityID(productId)
      })
    })

    order.products = new OrderProductList(orderProducts)

    await inMemoryOrdersRepository.create(order)

    const result = await sut.execute()

    expect(result.value?.orders).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: order.id
        })
      ])
    )
  })
})
