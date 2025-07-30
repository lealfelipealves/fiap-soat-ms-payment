import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { HttpException } from '@nestjs/common'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PaymentWebhookController } from './webhook-payment.controller'

describe('Payment Webhook Controller', () => {
  let sut: PaymentWebhookController
  let mockUpdatePaymentStatusUseCase: any

  beforeEach(() => {
    mockUpdatePaymentStatusUseCase = {
      execute: vi.fn()
    }

    sut = new PaymentWebhookController(mockUpdatePaymentStatusUseCase)
  })

  describe('Given a valid payment webhook with approved status', () => {
    it('When webhook is processed Then should process successfully', async () => {
      // Arrange
      const mockOrder = {
        id: 'order-1',
        customerId: 'customer-1',
        paymentStatus: 'Aprovado'
      }

      mockUpdatePaymentStatusUseCase.execute.mockResolvedValue(
        right({ order: mockOrder })
      )

      // Act
      const result = await sut.handle({
        orderId: 'order-1',
        paymentStatus: 'approved'
      })

      // Assert
      expect(result).toBeUndefined()
      expect(mockUpdatePaymentStatusUseCase.execute).toHaveBeenCalledWith({
        id: 'order-1',
        paymentStatus: 'approved'
      })
    })
  })

  describe('Given a valid payment webhook with rejected status', () => {
    it('When webhook is processed Then should process successfully', async () => {
      // Arrange
      const mockOrder = {
        id: 'order-1',
        customerId: 'customer-1',
        paymentStatus: 'Rejeitado'
      }

      mockUpdatePaymentStatusUseCase.execute.mockResolvedValue(
        right({ order: mockOrder })
      )

      // Act
      const result = await sut.handle({
        orderId: 'order-1',
        paymentStatus: 'rejected'
      })

      // Assert
      expect(result).toBeUndefined()
      expect(mockUpdatePaymentStatusUseCase.execute).toHaveBeenCalledWith({
        id: 'order-1',
        paymentStatus: 'rejected'
      })
    })
  })

  describe('Given an invalid order ID', () => {
    it('When webhook is processed Then should throw ResourceNotFoundError', async () => {
      // Arrange
      mockUpdatePaymentStatusUseCase.execute.mockResolvedValue(
        left(new ResourceNotFoundError())
      )

      // Act & Assert
      await expect(
        sut.handle({
          orderId: 'non-existent',
          paymentStatus: 'approved'
        })
      ).rejects.toThrow(HttpException)
      expect(mockUpdatePaymentStatusUseCase.execute).toHaveBeenCalledWith({
        id: 'non-existent',
        paymentStatus: 'approved'
      })
    })
  })

  describe('Given a webhook with missing data', () => {
    it('When webhook is processed Then should return early without processing', async () => {
      // Arrange
      mockUpdatePaymentStatusUseCase.execute.mockResolvedValue(
        right({ order: {} })
      )

      // Act
      const result = await sut.handle({
        orderId: '',
        paymentStatus: 'approved'
      })

      // Assert
      expect(result).toBeUndefined()
      expect(mockUpdatePaymentStatusUseCase.execute).not.toHaveBeenCalled()
    })

    it('When webhook is processed with missing payment status Then should return early', async () => {
      // Arrange
      mockUpdatePaymentStatusUseCase.execute.mockResolvedValue(
        right({ order: {} })
      )

      // Act
      const result = await sut.handle({
        orderId: 'order-1',
        paymentStatus: ''
      })

      // Assert
      expect(result).toBeUndefined()
      expect(mockUpdatePaymentStatusUseCase.execute).not.toHaveBeenCalled()
    })
  })

  describe('Given a webhook with unknown error', () => {
    it('When webhook is processed Then should throw BadRequest error', async () => {
      // Arrange
      const mockError = new Error('Unknown error')
      mockUpdatePaymentStatusUseCase.execute.mockResolvedValue(left(mockError))

      // Act & Assert
      await expect(
        sut.handle({
          orderId: 'order-1',
          paymentStatus: 'approved'
        })
      ).rejects.toThrow(HttpException)
      expect(mockUpdatePaymentStatusUseCase.execute).toHaveBeenCalledWith({
        id: 'order-1',
        paymentStatus: 'approved'
      })
    })
  })
})
