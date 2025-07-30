import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
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

  describe('Given a valid order ID', () => {
    it('When checkout is executed Then should return success response', async () => {
      // Arrange
      const mockOrder = {
        id: 'order-1',
        customerId: 'customer-1',
        status: 'Finalizado'
      }

      mockCheckoutOrderUseCase.execute.mockResolvedValue(
        right({ order: mockOrder })
      )

      // Act
      const result = await sut.handle('order-1')

      // Assert
      expect(result).toEqual({ order: mockOrder })
      expect(mockCheckoutOrderUseCase.execute).toHaveBeenCalledWith({
        id: 'order-1'
      })
    })
  })

  describe('Given an invalid order ID', () => {
    it('When checkout is executed Then should throw ResourceNotFoundError', async () => {
      // Arrange
      mockCheckoutOrderUseCase.execute.mockResolvedValue(
        left(new ResourceNotFoundError())
      )

      // Act & Assert
      await expect(sut.handle('non-existent')).rejects.toThrow(
        ResourceNotFoundError
      )
      expect(mockCheckoutOrderUseCase.execute).toHaveBeenCalledWith({
        id: 'non-existent'
      })
    })
  })
})
