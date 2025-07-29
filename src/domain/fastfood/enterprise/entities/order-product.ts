import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface OrderProductProps {
  orderId: UniqueEntityID
  productId: UniqueEntityID
}

export class OrderProduct extends Entity<OrderProductProps> {
  get orderId() {
    return this.props.orderId
  }

  get productId() {
    return this.props.productId
  }

  static create(props: OrderProductProps, id?: UniqueEntityID) {
    const orderProduct = new OrderProduct(props, id)

    return orderProduct
  }
}
