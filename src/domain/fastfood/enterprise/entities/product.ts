import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Category } from './value-objects'

export interface ProductProps {
  name: string
  description: string
  price: number
  category: Category
}

export class Product extends Entity<ProductProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get description() {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
  }

  get price() {
    return this.props.price
  }

  set price(price: number) {
    this.props.price = price
  }

  get category(): Category {
    return this.props.category
  }

  set category(category: string) {
    this.props.category = Category.create(category)
  }

  static create(props: ProductProps, id?: UniqueEntityID) {
    return new Product(props, id)
  }
}
