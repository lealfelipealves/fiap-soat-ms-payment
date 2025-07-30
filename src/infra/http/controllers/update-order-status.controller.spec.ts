import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { HttpException } from '@nestjs/common'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UpdateOrderStatusController } from './update-order-status.controller'

describe('Update Order Status Controller', () => {
  let sut: UpdateOrderStatusController
  let mockUpdateOrderStatusUseCase: any

  beforeEach(() => {
    mockUpdateOrderStatusUseCase = {
      execute: vi.fn()
    }

    sut = new UpdateOrderStatusController(mockUpdateOrderStatusUseCase)
  })

  describe('Given a valid order ID', () => {
    it('When order status is updated Then should return success response', async () => {
      // Arrange
      const mockOrder = {
        id: 'order-1',
        customerId: 'customer-1',
        status: 'Em Preparação'
      }

      mockUpdateOrderStatusUseCase.execute.mockResolvedValue(
        right({ order: mockOrder })
      )

      // Act
      const result = await sut.handle('order-1')

      // Assert
      expect(result).toEqual({
        message: 'Status atualizado para "Preparação".',
        orderId: 'order-1'
      })
      expect(mockUpdateOrderStatusUseCase.execute).toHaveBeenCalledWith({
        id: 'order-1'
      })
    })
  })

  describe('Given an invalid order ID', () => {
    it('When order status is updated Then should throw ResourceNotFoundError', async () => {
      // Arrange
      mockUpdateOrderStatusUseCase.execute.mockResolvedValue(
        left(new ResourceNotFoundError())
      )

      // Act & Assert
      await expect(sut.handle('non-existent')).rejects.toThrow(HttpException)
      expect(mockUpdateOrderStatusUseCase.execute).toHaveBeenCalledWith({
        id: 'non-existent'
      })
    })
  })

  describe('Given an order with payment not approved', () => {
    it('When order status is updated Then should throw BadRequest error', async () => {
      // Arrange
      const mockError = new Error('Payment not approved')
      mockUpdateOrderStatusUseCase.execute.mockResolvedValue(left(mockError))

      // Act & Assert
      await expect(sut.handle('order-1')).rejects.toThrow(HttpException)
      expect(mockUpdateOrderStatusUseCase.execute).toHaveBeenCalledWith({
        id: 'order-1'
      })
    })
  })
})
