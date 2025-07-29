import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Product } from '../product'
import { Status } from './status'

export interface OrderDetailsProps {
  customerId: UniqueEntityID
  products: Product[]
  status: Status
  createdAt: Date
  updatedAt?: Date | null
}

export class OrderDetails extends ValueObject<OrderDetailsProps> {
  get customerId() {
    return this.props.customerId
  }

  get products() {
    return this.props.products
  }

  get status() {
    return this.props.status
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: OrderDetailsProps) {
    return new OrderDetails(props)
  }
}
