import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Order } from '@/domain/fastfood/enterprise/entities'
import {
  PaymentStatus,
  Status
} from '@/domain/fastfood/enterprise/entities/value-objects'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UpdateOrderStatusUseCase } from './update-order-status'

describe('Update Order Status Use Case', () => {
  let sut: UpdateOrderStatusUseCase
  let mockOrderRepository: any

  beforeEach(() => {
    mockOrderRepository = {
      findById: vi.fn(),
      save: vi.fn()
    }

    sut = new UpdateOrderStatusUseCase(mockOrderRepository)
  })

  describe('Given an existing order with approved payment', () => {
    it('When order status is updated to preparation Then should update successfully', async () => {
      // Arrange
      const order = Order.create({
        customerId: new UniqueEntityID('customer-1')
      })
      order.paymentStatus = PaymentStatus.create(PaymentStatus.APPROVED)
      mockOrderRepository.findById.mockResolvedValue(order)

      // Act
      const result = await sut.execute({ id: order.id.toString() })

      // Assert
      expect(result.isRight()).toBe(true)
      if (result.isRight()) {
        expect(result.value.order.status.getValue()).toBe(Status.IN_PREPARATION)
        expect(mockOrderRepository.save).toHaveBeenCalledWith(order)
      }
    })

    it('When order status is updated Then should save the order', async () => {
      // Arrange
      const order = Order.create({
        customerId: new UniqueEntityID('customer-1')
      })
      order.paymentStatus = PaymentStatus.create(PaymentStatus.APPROVED)
      mockOrderRepository.findById.mockResolvedValue(order)

      // Act
      await sut.execute({ id: order.id.toString() })

      // Assert
      expect(mockOrderRepository.save).toHaveBeenCalledWith(order)
    })
  })

  describe('Given an existing order with rejected payment', () => {
    it('When order status is updated Then should return error', async () => {
      // Arrange
      const order = Order.create({
        customerId: new UniqueEntityID('customer-1')
      })
      order.paymentStatus = PaymentStatus.create(PaymentStatus.REJECTED)
      mockOrderRepository.findById.mockResolvedValue(order)

      // Act
      const result = await sut.execute({ id: order.id.toString() })

      // Assert
      expect(result.isLeft()).toBe(true)
      if (result.isLeft()) {
        expect(result.value).toBeInstanceOf(Error)
        expect(result.value.message).toBe(
          'O pagamento do pedido não foi aprovado.'
        )
      }
    })

    it('When order status is updated Then should not save the order', async () => {
      // Arrange
      const order = Order.create({
        customerId: new UniqueEntityID('customer-1')
      })
      order.paymentStatus = PaymentStatus.create(PaymentStatus.REJECTED)
      mockOrderRepository.findById.mockResolvedValue(order)

      // Act
      await sut.execute({ id: order.id.toString() })

      // Assert
      expect(mockOrderRepository.save).not.toHaveBeenCalled()
    })
  })

  describe('Given an existing order with pending payment', () => {
    it('When order status is updated Then should return error', async () => {
      // Arrange
      const order = Order.create({
        customerId: new UniqueEntityID('customer-1')
      })
      order.paymentStatus = PaymentStatus.create(PaymentStatus.PENDING)
      mockOrderRepository.findById.mockResolvedValue(order)

      // Act
      const result = await sut.execute({ id: order.id.toString() })

      // Assert
      expect(result.isLeft()).toBe(true)
      if (result.isLeft()) {
        expect(result.value).toBeInstanceOf(Error)
        expect(result.value.message).toBe(
          'O pagamento do pedido não foi aprovado.'
        )
      }
    })
  })

  describe('Given a non-existing order', () => {
    it('When order status is updated Then should return ResourceNotFoundError', async () => {
      // Arrange
      const nonExistentOrderId = 'non-existent-id'
      mockOrderRepository.findById.mockResolvedValue(null)

      // Act
      const result = await sut.execute({ id: nonExistentOrderId })

      // Assert
      expect(result.isLeft()).toBe(true)
      if (result.isLeft()) {
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)
      }
    })

    it('When order status is updated Then should not call save method', async () => {
      // Arrange
      const nonExistentOrderId = 'non-existent-id'
      mockOrderRepository.findById.mockResolvedValue(null)

      // Act
      await sut.execute({ id: nonExistentOrderId })

      // Assert
      expect(mockOrderRepository.save).not.toHaveBeenCalled()
    })
  })

  describe('Given an order that is already in preparation', () => {
    it('When order status is updated Then should return error about transition', async () => {
      // Arrange
      const order = Order.create({
        customerId: new UniqueEntityID('customer-1')
      })
      order.paymentStatus = PaymentStatus.create(PaymentStatus.APPROVED)
      order.status = Status.create(Status.IN_PREPARATION)
      mockOrderRepository.findById.mockResolvedValue(order)

      // Act
      const result = await sut.execute({ id: order.id.toString() })

      // Assert
      expect(result.isLeft()).toBe(true)
      if (result.isLeft()) {
        expect(result.value).toBeInstanceOf(Error)
        expect(result.value.message).toBe(
          'Não é possível mudar o status de Preparação para Preparação.'
        )
      }
    })
  })

  describe('Given edge cases', () => {
    it('When order status is updated with empty string ID Then should return ResourceNotFoundError', async () => {
      // Arrange
      const emptyId = ''
      mockOrderRepository.findById.mockResolvedValue(null)

      // Act
      const result = await sut.execute({ id: emptyId })

      // Assert
      expect(result.isLeft()).toBe(true)
      if (result.isLeft()) {
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)
      }
    })

    it('When order status is updated with null ID Then should return ResourceNotFoundError', async () => {
      // Arrange
      const nullId = null as any
      mockOrderRepository.findById.mockResolvedValue(null)

      // Act
      const result = await sut.execute({ id: nullId })

      // Assert
      expect(result.isLeft()).toBe(true)
      if (result.isLeft()) {
        expect(result.value).toBeInstanceOf(ResourceNotFoundError)
      }
    })
  })
})
