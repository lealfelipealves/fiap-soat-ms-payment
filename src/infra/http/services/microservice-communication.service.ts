import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

export interface Order {
  id: string
  customerId: string
  status: string
  paymentStatus: string
  createdAt: Date
  updatedAt: Date
}

@Injectable()
export class MicroserviceCommunicationService {
  private readonly orderServiceUrl: string
  private readonly productionServiceUrl: string

  constructor(private configService: ConfigService) {
    this.orderServiceUrl =
      this.configService.get('ORDER_SERVICE_URL') || 'http://localhost:3333'
    this.productionServiceUrl =
      this.configService.get('PRODUCTION_SERVICE_URL') ||
      'http://localhost:3335'
  }

  async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await fetch(`${this.orderServiceUrl}/order/${orderId}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new HttpException('Pedido não encontrado', HttpStatus.NOT_FOUND)
        }
        throw new HttpException(
          'Erro ao buscar pedido',
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }

      const data = await response.json()
      return data.order
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(
        'Erro de comunicação com microserviço de pedidos',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async updateOrderPaymentStatus(
    orderId: string,
    paymentStatus: string
  ): Promise<void> {
    try {
      // Notificar o microserviço de pedidos sobre a mudança de status
      const response = await fetch(
        `${this.orderServiceUrl}/orders/${orderId}/payment-status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            paymentStatus
          })
        }
      )

      if (!response.ok) {
        throw new HttpException(
          'Erro ao atualizar status de pagamento do pedido',
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(
        'Erro de comunicação com microserviço de pedidos',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async notifyProductionService(orderId: string): Promise<void> {
    try {
      // Notificar o microserviço de produção sobre o pagamento aprovado
      const response = await fetch(
        `${this.productionServiceUrl}/orders/${orderId}/payment-approved`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            orderId,
            status: 'payment_approved'
          })
        }
      )

      if (!response.ok) {
        throw new HttpException(
          'Erro ao notificar microserviço de produção',
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(
        'Erro de comunicação com microserviço de produção',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
