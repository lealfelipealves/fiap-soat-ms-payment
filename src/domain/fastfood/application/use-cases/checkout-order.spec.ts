import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Order } from '@/domain/fastfood/enterprise/entities'
import { Status } from '@/domain/fastfood/enterprise/entities/value-objects'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckoutOrderUseCase } from './checkout-order'

describe('Checkout Order Use Case', () => {
  let sut: CheckoutOrderUseCase
  let mockOrderRepository: any

  beforeEach(() => {
    mockOrderRepository = {
      findById: vi.fn(),
      save: vi.fn()
    }

    sut = new CheckoutOrderUseCase(mockOrderRepository)
  })

  describe('Given an existing order', () => {
    it('When checkout is executed Then should finalize the order successfully', async () => {
      // Arrange
      const order = Order.create({
        customerId: new UniqueEntityID('customer-1')
      })
      mockOrderRepository.findById.mockResolvedValue(order)

      // Act
      const result = await sut.execute({ id: order.id.toString() })

      // Assert
      expect(result.isRight()).toBe(true)
      if (result.isRight()) {
        expect(result.value.order.status.getValue()).toBe(Status.FINALIZED)
        expect(mockOrderRepository.save).toHaveBeenCalledWith(order)
      }
    })

    it('When checkout is executed Then should save the order with finalized status', async () => {
      // Arrange
      const order = Order.create({
        customerId: new UniqueEntityID('customer-1')
      })
      mockOrderRepository.findById.mockResolvedValue(order)

      // Act
      await sut.execute({ id: order.id.toString() })

      // Assert
      expect(mockOrderRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: order.id,
          status: expect.objectContaining({
            value: Status.FINALIZED
          })
        })
      )
    })
  })

  describe('Given a non-existing order', () => {
    it('When checkout is executed Then should return ResourceNotFoundError', async () => {
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

    it('When checkout is executed Then should not call save method', async () => {
      // Arrange
      const nonExistentOrderId = 'non-existent-id'
      mockOrderRepository.findById.mockResolvedValue(null)

      // Act
      await sut.execute({ id: nonExistentOrderId })

      // Assert
      expect(mockOrderRepository.save).not.toHaveBeenCalled()
    })
  })

  describe('Given an order that is already finalized', () => {
    it('When checkout is executed Then should keep the order finalized', async () => {
      // Arrange
      const order = Order.create({
        customerId: new UniqueEntityID('customer-1')
      })
      order.status = Status.create(Status.FINALIZED)
      mockOrderRepository.findById.mockResolvedValue(order)

      // Act
      const result = await sut.execute({ id: order.id.toString() })

      // Assert
      expect(result.isRight()).toBe(true)
      if (result.isRight()) {
        expect(result.value.order.status.getValue()).toBe(Status.FINALIZED)
      }
    })
  })
})
