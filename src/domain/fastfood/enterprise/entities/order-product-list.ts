import { WatchedList } from '@/core/entities/watched-list'
import { OrderProduct } from './order-product'

export class OrderProductList extends WatchedList<OrderProduct> {
  compareItems(a: OrderProduct, b: OrderProduct): boolean {
    return a.productId.equals(b.productId)
  }
}
