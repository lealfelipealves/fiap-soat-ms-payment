import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Order } from '@/domain/fastfood/enterprise/entities'
import { PaymentStatus } from '@/domain/fastfood/enterprise/entities/value-objects'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GetOrderPaymentStatusUseCase } from './get-order-payment-status'

describe('Get Order Payment Status', () => {
  let sut: GetOrderPaymentStatusUseCase
  let mockOrderRepository: any

  beforeEach(() => {
    mockOrderRepository = {
      findById: vi.fn()
    }

    sut = new GetOrderPaymentStatusUseCase(mockOrderRepository)
  })

  it('should be able to get order payment status', async () => {
    const order = Order.create({
      customerId: new UniqueEntityID('customer-1')
    })
    order.paymentStatus = PaymentStatus.create('Aprovado')

    mockOrderRepository.findById.mockResolvedValue(order)

    const result = await sut.execute({
      id: 'order-1'
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.status.getValue()).toBe('Aprovado')
      expect(mockOrderRepository.findById).toHaveBeenCalledWith('order-1')
    }
  })

  it('should return empty string when order has no payment status', async () => {
    const order = Order.create({
      customerId: new UniqueEntityID('customer-1')
    })

    mockOrderRepository.findById.mockResolvedValue(order)

    const result = await sut.execute({
      id: 'order-1'
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.status).toBe('')
    }
  })

  it('should return error when order is not found', async () => {
    mockOrderRepository.findById.mockResolvedValue(null)

    const result = await sut.execute({
      id: 'non-existent'
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })
})
