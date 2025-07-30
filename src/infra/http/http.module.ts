import { CheckoutOrderUseCase } from '@/domain/fastfood/application/use-cases/checkout-order'
import { GetOrderPaymentStatusUseCase } from '@/domain/fastfood/application/use-cases/get-order-payment-status'
import { UpdateOrderStatusUseCase } from '@/domain/fastfood/application/use-cases/update-order-status'
import { UpdatePaymentStatusUseCase } from '@/domain/fastfood/application/use-cases/update-payment-status'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CheckoutOrderController } from './controllers/checkout-order.controller'
import { GetPaymentStatusController } from './controllers/get-payment-status.controller'
import { UpdateOrderStatusController } from './controllers/update-order-status.controller'
import { PaymentWebhookController } from './controllers/webhook-payment.controller'
import { MicroserviceCommunicationService } from './services/microservice-communication.service'

@Module({
  imports: [DatabaseModule],
  controllers: [
    UpdateOrderStatusController,
    CheckoutOrderController,
    GetPaymentStatusController,
    PaymentWebhookController
  ],
  providers: [
    UpdateOrderStatusUseCase,
    CheckoutOrderUseCase,
    GetOrderPaymentStatusUseCase,
    UpdatePaymentStatusUseCase,
    MicroserviceCommunicationService
  ]
})
export class HttpModule {}
