import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UpdateOrderStatusController } from './update-order-status.controller'

describe('Update Order Status Controller', () => {
  let sut: UpdateOrderStatusController
  let mockUpdatePaymentStatusUseCase: any

  beforeEach(() => {
    mockUpdatePaymentStatusUseCase = {
      execute: vi.fn()
    }

    sut = new UpdateOrderStatusController(mockUpdatePaymentStatusUseCase)
  })

  it('should be able to update order status', async () => {
    const mockOrder = {
      id: 'order-1',
      customerId: 'customer-1',
      paymentStatus: 'Aprovado'
    }

    mockUpdatePaymentStatusUseCase.execute.mockResolvedValue({
      isRight: () => true,
      value: { order: mockOrder }
    })

    const result = await sut.handle({
      id: 'order-1',
      paymentStatus: 'Aprovado'
    })

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({ order: mockOrder })
    expect(mockUpdatePaymentStatusUseCase.execute).toHaveBeenCalledWith({
      id: 'order-1',
      paymentStatus: 'Aprovado'
    })
  })

  it('should return error when order is not found', async () => {
    mockUpdatePaymentStatusUseCase.execute.mockResolvedValue({
      isRight: () => false,
      value: { message: 'Order not found' }
    })

    const result = await sut.handle({
      id: 'non-existent',
      paymentStatus: 'Aprovado'
    })

    expect(result.statusCode).toBe(404)
    expect(result.body).toEqual({ message: 'Order not found' })
  })
})
