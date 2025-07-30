import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Order } from '@/domain/fastfood/enterprise/entities'
import { MicroserviceCommunicationService } from '@/infra/http/services/microservice-communication.service'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UpdatePaymentStatusUseCase } from './update-payment-status'

describe('Update Payment Status', () => {
  let sut: UpdatePaymentStatusUseCase
  let mockOrderRepository: any
  let mockMicroserviceCommunication: MicroserviceCommunicationService

  beforeEach(() => {
    mockOrderRepository = {
      findById: vi.fn(),
      save: vi.fn()
    }

    mockMicroserviceCommunication = {
      updateOrderPaymentStatus: vi.fn(),
      notifyProductionService: vi.fn(),
      getOrderById: vi.fn()
    } as any

    sut = new UpdatePaymentStatusUseCase(
      mockOrderRepository,
      mockMicroserviceCommunication
    )
  })

  it('should be able to update payment status', async () => {
    const order = Order.create({
      customerId: new UniqueEntityID('customer-1')
    })

    mockOrderRepository.findById.mockResolvedValue(order)
    vi.mocked(
      mockMicroserviceCommunication.updateOrderPaymentStatus
    ).mockResolvedValue()
    vi.mocked(
      mockMicroserviceCommunication.notifyProductionService
    ).mockResolvedValue()

    const result = await sut.execute({
      id: 'order-1',
      paymentStatus: 'Aprovado'
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.order.paymentStatus?.getValue()).toBe('Aprovado')
      expect(mockOrderRepository.save).toHaveBeenCalledWith(order)
    }
  })

  it('should return error when order is not found', async () => {
    mockOrderRepository.findById.mockResolvedValue(null)

    const result = await sut.execute({
      id: 'non-existent',
      paymentStatus: 'Aprovado'
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })

  it('should notify other microservices when payment is approved', async () => {
    const order = Order.create({
      customerId: new UniqueEntityID('customer-1')
    })

    mockOrderRepository.findById.mockResolvedValue(order)
    vi.mocked(
      mockMicroserviceCommunication.updateOrderPaymentStatus
    ).mockResolvedValue()
    vi.mocked(
      mockMicroserviceCommunication.notifyProductionService
    ).mockResolvedValue()

    await sut.execute({
      id: 'order-1',
      paymentStatus: 'Aprovado'
    })

    expect(
      mockMicroserviceCommunication.updateOrderPaymentStatus
    ).toHaveBeenCalledWith('order-1', 'Aprovado')
    expect(
      mockMicroserviceCommunication.notifyProductionService
    ).toHaveBeenCalledWith('order-1')
  })

  it('should not notify production service when payment is not approved', async () => {
    const order = Order.create({
      customerId: new UniqueEntityID('customer-1')
    })

    mockOrderRepository.findById.mockResolvedValue(order)
    vi.mocked(
      mockMicroserviceCommunication.updateOrderPaymentStatus
    ).mockResolvedValue()
    vi.mocked(
      mockMicroserviceCommunication.notifyProductionService
    ).mockResolvedValue()

    await sut.execute({
      id: 'order-1',
      paymentStatus: 'Recusado'
    })

    expect(
      mockMicroserviceCommunication.updateOrderPaymentStatus
    ).toHaveBeenCalledWith('order-1', 'Recusado')
    expect(
      mockMicroserviceCommunication.notifyProductionService
    ).not.toHaveBeenCalled()
  })

  it('should continue execution even if microservice communication fails', async () => {
    const order = Order.create({
      customerId: new UniqueEntityID('customer-1')
    })

    mockOrderRepository.findById.mockResolvedValue(order)
    vi.mocked(
      mockMicroserviceCommunication.updateOrderPaymentStatus
    ).mockRejectedValue(new Error('Communication error'))
    vi.mocked(
      mockMicroserviceCommunication.notifyProductionService
    ).mockResolvedValue()

    const result = await sut.execute({
      id: 'order-1',
      paymentStatus: 'Aprovado'
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.order.paymentStatus?.getValue()).toBe('Aprovado')
    }
  })

  it('should call repository methods correctly', async () => {
    const order = Order.create({
      customerId: new UniqueEntityID('customer-1')
    })

    mockOrderRepository.findById.mockResolvedValue(order)
    vi.mocked(
      mockMicroserviceCommunication.updateOrderPaymentStatus
    ).mockResolvedValue()
    vi.mocked(
      mockMicroserviceCommunication.notifyProductionService
    ).mockResolvedValue()

    await sut.execute({
      id: 'order-1',
      paymentStatus: 'Aprovado'
    })

    expect(mockOrderRepository.findById).toHaveBeenCalledWith('order-1')
    expect(mockOrderRepository.save).toHaveBeenCalledWith(order)
  })

  it('should update payment status with different values', async () => {
    const order = Order.create({
      customerId: new UniqueEntityID('customer-1')
    })

    mockOrderRepository.findById.mockResolvedValue(order)
    vi.mocked(
      mockMicroserviceCommunication.updateOrderPaymentStatus
    ).mockResolvedValue()
    vi.mocked(
      mockMicroserviceCommunication.notifyProductionService
    ).mockResolvedValue()

    const result = await sut.execute({
      id: 'order-1',
      paymentStatus: 'Pendente'
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.order.paymentStatus?.getValue()).toBe('Pendente')
    }
  })
})
