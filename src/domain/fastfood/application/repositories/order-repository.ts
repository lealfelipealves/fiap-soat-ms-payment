import { Order } from '@/domain/fastfood/enterprise/entities/order'

export abstract class OrderRepository {
  abstract getAll(): Promise<Order[]>
  abstract findById(id: string): Promise<Order | null>
  abstract save(order: Order): Promise<void>
  abstract create(order: Order): Promise<void>
}
