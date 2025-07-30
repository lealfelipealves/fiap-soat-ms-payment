import { beforeEach, describe, expect, it, vi } from 'vitest'
import { WebhookPaymentController } from './webhook-payment.controller'

describe('Webhook Payment Controller', () => {
  let sut: WebhookPaymentController
  let mockUpdatePaymentStatusUseCase: any

  beforeEach(() => {
    mockUpdatePaymentStatusUseCase = {
      execute: vi.fn()
    }

    sut = new WebhookPaymentController(mockUpdatePaymentStatusUseCase)
  })

  it('should be able to process payment webhook', async () => {
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
      orderId: 'order-1',
      status: 'approved',
      amount: 15.99
    })

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({ message: 'Payment processed successfully' })
    expect(mockUpdatePaymentStatusUseCase.execute).toHaveBeenCalledWith({
      id: 'order-1',
      paymentStatus: 'Aprovado'
    })
  })

  it('should handle rejected payment', async () => {
    const mockOrder = {
      id: 'order-1',
      customerId: 'customer-1',
      paymentStatus: 'Rejeitado'
    }

    mockUpdatePaymentStatusUseCase.execute.mockResolvedValue({
      isRight: () => true,
      value: { order: mockOrder }
    })

    const result = await sut.handle({
      orderId: 'order-1',
      status: 'rejected',
      amount: 15.99
    })

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({ message: 'Payment processed successfully' })
    expect(mockUpdatePaymentStatusUseCase.execute).toHaveBeenCalledWith({
      id: 'order-1',
      paymentStatus: 'Rejeitado'
    })
  })

  it('should return error when order is not found', async () => {
    mockUpdatePaymentStatusUseCase.execute.mockResolvedValue({
      isRight: () => false,
      value: { message: 'Order not found' }
    })

    const result = await sut.handle({
      orderId: 'non-existent',
      status: 'approved',
      amount: 15.99
    })

    expect(result.statusCode).toBe(404)
    expect(result.body).toEqual({ message: 'Order not found' })
  })

  it('should handle unknown payment status', async () => {
    const result = await sut.handle({
      orderId: 'order-1',
      status: 'unknown',
      amount: 15.99
    })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({ message: 'Invalid payment status' })
  })
})
