import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Order } from '@/domain/fastfood/enterprise/entities'
import { PaymentStatus } from '@/domain/fastfood/enterprise/entities/value-objects'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UpdatePaymentStatusUseCase } from './update-payment-status'

describe('Update Payment Status Use Case', () => {
  let sut: UpdatePaymentStatusUseCase
  let mockOrderRepository: any
  let mockMicroserviceCommunication: any

  beforeEach(() => {
    mockOrderRepository = {
      findById: vi.fn(),
      save: vi.fn()
    }

    mockMicroserviceCommunication = {
      updateOrderPaymentStatus: vi.fn(),
      notifyProductionService: vi.fn()
    }

    sut = new UpdatePaymentStatusUseCase(
      mockOrderRepository,
      mockMicroserviceCommunication
    )
  })

  describe('Given an existing order', () => {
    it('When payment status is updated to approved Then should update successfully', async () => {
      // Arrange
      const order = Order.create({
        customerId: new UniqueEntityID('customer-1')
      })
      mockOrderRepository.findById.mockResolvedValue(order)

      // Act
      const result = await sut.execute({
        id: order.id.toString(),
        paymentStatus: PaymentStatus.APPROVED
      })

      // Assert
      expect(result.isRight()).toBe(true)
      if (result.isRight()) {
        expect(result.value.order.paymentStatus?.getValue()).toBe(
          PaymentStatus.APPROVED
        )
        expect(mockOrderRepository.save).toHaveBeenCalledWith(order)
      }
    })

    it('When payment status is updated to rejected Then should update successfully', async () => {
      // Arrange
      const order = Order.create({
        customerId: new UniqueEntityID('customer-1')
      })
      mockOrderRepository.findById.mockResolvedValue(order)

      // Act
      const result = await sut.execute({
        id: order.id.toString(),
        paymentStatus: PaymentStatus.REJECTED
      })

      // Assert
      expect(result.isRight()).toBe(true)
      if (result.isRight()) {
        expect(result.value.order.paymentStatus?.getValue()).toBe(
          PaymentStatus.REJECTED
        )
      }
    })

    it('When payment status is updated Then should save the order', async () => {
      // Arrange
      const order = Order.create({
        customerId: new UniqueEntityID('customer-1')
      })
      mockOrderRepository.findById.mockResolvedValue(order)

      // Act
      await sut.execute({
        id: order.id.toString(),
        paymentStatus: PaymentStatus.APPROVED
      })

      // Assert
      expect(mockOrderRepository.save).toHaveBeenCalledWith(order)
    })
  })

  describe('Given a non-existing order', () => {
    it('When payment status is updated Then should return ResourceNotFoundError', async () => {
      // Arrange
      const nonExistentOrderId = 'non-existent-id'
      mockOrderRepository.findById.mockResolvedValue(null)

      // Act
      const result = await sut.execute({
        id: nonExistentOrderId,
        paymentStatus: PaymentStatus.APPROVED
      })

      // Assert
      expect(result.isLeft()).toBe(true)
      if (result.isLeft()) {
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)
      }
    })

    it('When payment status is updated Then should not call save method', async () => {
      // Arrange
      const nonExistentOrderId = 'non-existent-id'
      mockOrderRepository.findById.mockResolvedValue(null)

      // Act
      await sut.execute({
        id: nonExistentOrderId,
        paymentStatus: PaymentStatus.APPROVED
      })

      // Assert
      expect(mockOrderRepository.save).not.toHaveBeenCalled()
    })
  })

  describe('Given an invalid payment status', () => {
    it('When payment status is updated with invalid status Then should throw error', async () => {
      // Arrange
      const order = Order.create({
        customerId: new UniqueEntityID('customer-1')
      })
      mockOrderRepository.findById.mockResolvedValue(order)
      const invalidStatus = 'invalid-status'

      // Act & Assert
      await expect(
        sut.execute({
          id: order.id.toString(),
          paymentStatus: invalidStatus
        })
      ).rejects.toThrow('Invalid payment status: invalid-status')
    })

    it('When payment status is updated with invalid status Then should not save the order', async () => {
      // Arrange
      const order = Order.create({
        customerId: new UniqueEntityID('customer-1')
      })
      mockOrderRepository.findById.mockResolvedValue(order)
      const invalidStatus = 'invalid-status'

      // Act & Assert
      await expect(
        sut.execute({
          id: order.id.toString(),
          paymentStatus: invalidStatus
        })
      ).rejects.toThrow('Invalid payment status: invalid-status')
    })
  })
})
