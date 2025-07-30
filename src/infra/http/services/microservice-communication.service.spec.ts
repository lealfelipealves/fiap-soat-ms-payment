import { HttpException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  MicroserviceCommunicationService,
  Order
} from './microservice-communication.service'

describe('MicroserviceCommunicationService', () => {
  let service: MicroserviceCommunicationService
  let configService: ConfigService

  const mockConfigService = {
    get: vi.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MicroserviceCommunicationService,
        {
          provide: ConfigService,
          useValue: mockConfigService
        }
      ]
    }).compile()

    service = module.get<MicroserviceCommunicationService>(
      MicroserviceCommunicationService
    )
    configService = module.get<ConfigService>(ConfigService)
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  describe('constructor', () => {
    it('should initialize with default URLs when config is not provided', () => {
      mockConfigService.get.mockReturnValue(undefined)

      new MicroserviceCommunicationService(configService)

      expect(mockConfigService.get).toHaveBeenCalledWith('ORDER_SERVICE_URL')
      expect(mockConfigService.get).toHaveBeenCalledWith(
        'PRODUCTION_SERVICE_URL'
      )
    })

    it('should initialize with configured URLs', () => {
      mockConfigService.get
        .mockReturnValueOnce('http://order:3333')
        .mockReturnValueOnce('http://production:3335')

      new MicroserviceCommunicationService(configService)

      expect(mockConfigService.get).toHaveBeenCalledWith('ORDER_SERVICE_URL')
      expect(mockConfigService.get).toHaveBeenCalledWith(
        'PRODUCTION_SERVICE_URL'
      )
    })
  })

  describe('getOrderById', () => {
    it('should return order when API call is successful', async () => {
      const mockOrder: Order = {
        id: 'order-1',
        customerId: 'customer-1',
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ order: mockOrder })
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      const result = await service.getOrderById('order-1')

      expect(result).toEqual(mockOrder)
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3333/order/order-1'
      )
    })

    it('should throw HttpException when order is not found', async () => {
      const mockResponse = {
        ok: false,
        status: 404
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      await expect(service.getOrderById('order-1')).rejects.toThrow(
        HttpException
      )
      await expect(service.getOrderById('order-1')).rejects.toThrow(
        'Pedido não encontrado'
      )
    })

    it('should throw HttpException when API call fails', async () => {
      const mockResponse = {
        ok: false,
        status: 500
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      await expect(service.getOrderById('order-1')).rejects.toThrow(
        HttpException
      )
      await expect(service.getOrderById('order-1')).rejects.toThrow(
        'Erro ao buscar pedido'
      )
    })

    it('should throw HttpException when fetch throws an error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(service.getOrderById('order-1')).rejects.toThrow(
        HttpException
      )
      await expect(service.getOrderById('order-1')).rejects.toThrow(
        'Erro de comunicação com microserviço de pedidos'
      )
    })
  })

  describe('updateOrderPaymentStatus', () => {
    it('should successfully update order payment status', async () => {
      const mockResponse = {
        ok: true
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      await expect(
        service.updateOrderPaymentStatus('order-1', 'approved')
      ).resolves.not.toThrow()

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3333/orders/order-1/payment-status',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            paymentStatus: 'approved'
          })
        }
      )
    })

    it('should throw HttpException when update fails', async () => {
      const mockResponse = {
        ok: false
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      await expect(
        service.updateOrderPaymentStatus('order-1', 'approved')
      ).rejects.toThrow(HttpException)
      await expect(
        service.updateOrderPaymentStatus('order-1', 'approved')
      ).rejects.toThrow('Erro ao atualizar status de pagamento do pedido')
    })

    it('should throw HttpException when fetch throws an error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(
        service.updateOrderPaymentStatus('order-1', 'approved')
      ).rejects.toThrow(HttpException)
      await expect(
        service.updateOrderPaymentStatus('order-1', 'approved')
      ).rejects.toThrow('Erro de comunicação com microserviço de pedidos')
    })
  })

  describe('notifyProductionService', () => {
    it('should successfully notify production service', async () => {
      const mockResponse = {
        ok: true
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      await expect(
        service.notifyProductionService('order-1')
      ).resolves.not.toThrow()

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3335/orders/order-1/payment-approved',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            orderId: 'order-1',
            status: 'payment_approved'
          })
        }
      )
    })

    it('should throw HttpException when notification fails', async () => {
      const mockResponse = {
        ok: false
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      await expect(service.notifyProductionService('order-1')).rejects.toThrow(
        HttpException
      )
      await expect(service.notifyProductionService('order-1')).rejects.toThrow(
        'Erro ao notificar microserviço de produção'
      )
    })

    it('should throw HttpException when fetch throws an error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(service.notifyProductionService('order-1')).rejects.toThrow(
        HttpException
      )
      await expect(service.notifyProductionService('order-1')).rejects.toThrow(
        'Erro de comunicação com microserviço de produção'
      )
    })
  })
})
