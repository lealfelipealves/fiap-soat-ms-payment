import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  OrderProductProps,
  OrderProduct
} from '@/domain/fastfood/enterprise/entities/order-product'

export function makeOrderProduct(
  override: Partial<OrderProductProps> = {},
  id?: UniqueEntityID
) {
  const orderProduct = OrderProduct.create(
    {
      orderId: new UniqueEntityID(),
      productId: new UniqueEntityID(),
      ...override
    },
    id
  )

  return orderProduct
}
