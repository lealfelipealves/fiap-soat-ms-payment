import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { OrderRepository } from '@/domain/fastfood/application/repositories/order-repository'
import { Order } from '@/domain/fastfood/enterprise/entities'
import { MicroserviceCommunicationService } from '@/infra/http/services/microservice-communication.service'
import { Injectable } from '@nestjs/common'
import { PaymentStatus } from '../../enterprise/entities/value-objects'

interface UpdatePaymentStatusUseCaseRequest {
  id: string
  paymentStatus: string
}

type UpdatePaymentStatusUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class UpdatePaymentStatusUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly microserviceCommunication: MicroserviceCommunicationService
  ) {}

  async execute({
    id,
    paymentStatus
  }: UpdatePaymentStatusUseCaseRequest): Promise<UpdatePaymentStatusUseCaseResponse> {
    const order = await this.orderRepository.findById(id)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    order.paymentStatus = PaymentStatus.create(paymentStatus)

    await this.orderRepository.save(order)

    // Notificar outros microserviços sobre a mudança de status
    try {
      // Notificar o microserviço de pedidos
      await this.microserviceCommunication.updateOrderPaymentStatus(
        id,
        paymentStatus
      )

      // Se o pagamento foi aprovado, notificar o microserviço de produção
      if (paymentStatus === 'Aprovado') {
        await this.microserviceCommunication.notifyProductionService(id)
      }
    } catch {
      // Log do erro mas não falha a operação principal
      console.error(
        'Erro ao notificar outros microserviços sobre mudança de status de pagamento'
      )
    }

    return right({ order })
  }
}
