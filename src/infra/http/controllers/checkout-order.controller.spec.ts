import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckoutOrderController } from './checkout-order.controller'

describe('Checkout Order Controller', () => {
  let sut: CheckoutOrderController
  let mockCheckoutOrderUseCase: any

  beforeEach(() => {
    mockCheckoutOrderUseCase = {
      execute: vi.fn()
    }

    sut = new CheckoutOrderController(mockCheckoutOrderUseCase)
  })

  it('should be able to checkout an order', async () => {
    const mockOrder = {
      id: 'order-1',
      customerId: 'customer-1',
      status: 'Finalizado'
    }

    mockCheckoutOrderUseCase.execute.mockResolvedValue({
      isRight: () => true,
      value: { order: mockOrder }
    })

    const result = await sut.handle({
      id: 'order-1'
    })

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({ order: mockOrder })
    expect(mockCheckoutOrderUseCase.execute).toHaveBeenCalledWith({
      id: 'order-1'
    })
  })

  it('should return error when order is not found', async () => {
    mockCheckoutOrderUseCase.execute.mockResolvedValue({
      isRight: () => false,
      value: { message: 'Order not found' }
    })

    const result = await sut.handle({
      id: 'non-existent'
    })

    expect(result.statusCode).toBe(404)
    expect(result.body).toEqual({ message: 'Order not found' })
  })
})
