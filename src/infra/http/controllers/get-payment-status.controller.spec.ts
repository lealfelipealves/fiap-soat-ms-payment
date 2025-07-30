import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GetPaymentStatusController } from './get-payment-status.controller'

describe('Get Payment Status Controller', () => {
  let sut: GetPaymentStatusController
  let mockGetOrderPaymentStatusUseCase: any

  beforeEach(() => {
    mockGetOrderPaymentStatusUseCase = {
      execute: vi.fn()
    }

    sut = new GetPaymentStatusController(mockGetOrderPaymentStatusUseCase)
  })

  it('should be able to get payment status', async () => {
    const mockStatus = 'Aprovado'

    mockGetOrderPaymentStatusUseCase.execute.mockResolvedValue({
      isRight: () => true,
      value: { status: mockStatus }
    })

    const result = await sut.handle({
      id: 'order-1'
    })

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({ status: mockStatus })
    expect(mockGetOrderPaymentStatusUseCase.execute).toHaveBeenCalledWith({
      id: 'order-1'
    })
  })

  it('should return error when order is not found', async () => {
    mockGetOrderPaymentStatusUseCase.execute.mockResolvedValue({
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
