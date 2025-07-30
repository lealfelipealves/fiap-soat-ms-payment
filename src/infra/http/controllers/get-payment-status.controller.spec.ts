import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
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

  describe('Given a valid order ID', () => {
    it('When payment status is requested Then should return payment status', async () => {
      // Arrange
      const mockStatus = 'Aprovado'

      mockGetOrderPaymentStatusUseCase.execute.mockResolvedValue(
        right({ status: mockStatus })
      )

      // Act
      const result = await sut.handle('order-1')

      // Assert
      expect(result).toEqual({
        orderId: 'order-1',
        paymentStatus: mockStatus
      })
      expect(mockGetOrderPaymentStatusUseCase.execute).toHaveBeenCalledWith({
        id: 'order-1'
      })
    })

    it('When payment status is requested with object status Then should return status value', async () => {
      // Arrange
      const mockStatus = {
        getValue: () => 'Aprovado'
      }

      mockGetOrderPaymentStatusUseCase.execute.mockResolvedValue(
        right({ status: mockStatus })
      )

      // Act
      const result = await sut.handle('order-1')

      // Assert
      expect(result).toEqual({
        orderId: 'order-1',
        paymentStatus: 'Aprovado'
      })
    })
  })

  describe('Given an invalid order ID', () => {
    it('When payment status is requested Then should throw error', async () => {
      // Arrange
      mockGetOrderPaymentStatusUseCase.execute.mockResolvedValue(
        left(new ResourceNotFoundError())
      )

      // Act & Assert
      await expect(sut.handle('non-existent')).rejects.toThrow(
        'Pedido não encontrado'
      )
      expect(mockGetOrderPaymentStatusUseCase.execute).toHaveBeenCalledWith({
        id: 'non-existent'
      })
    })
  })
})
