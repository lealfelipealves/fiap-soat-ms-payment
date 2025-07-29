import { Product } from '@/domain/fastfood/enterprise/entities'

export class ProductPresenter {
  static toHTTP(Product: Product) {
    return {
      id: Product.id.toString(),
      name: Product.name,
      description: Product.description,
      price: Product.price,
      category: Product.category.toString()
    }
  }
}
