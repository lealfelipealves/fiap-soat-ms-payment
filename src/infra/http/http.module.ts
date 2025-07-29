import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { UpdateOrderStatusController } from './controllers/update-order-status.controller'
import { PaymentWebhookController } from './controllers/webhook-payment.controller'
import { CheckoutOrderController } from './controllers/checkout-order.controller'
import { CheckoutOrderUseCase } from '@/domain/fastfood/application/use-cases/checkout-order'
import { UpdateOrderStatusUseCase } from '@/domain/fastfood/application/use-cases/update-order-status'
import { UpdatePaymentStatusUseCase } from '@/domain/fastfood/application/use-cases/update-payment-status'
@Module({
  imports: [DatabaseModule],
  controllers: [
    UpdateOrderStatusController,
    CheckoutOrderController,
    PaymentWebhookController
  ],
  providers: [
    UpdateOrderStatusUseCase,
    CheckoutOrderUseCase,
    UpdatePaymentStatusUseCase
  ]
})
export class HttpModule {}
