import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/fastfood/enterprise/entities'
import { Status } from '@/domain/fastfood/enterprise/entities/value-objects'
import { faker } from '@faker-js/faker'

export function makeOrder(override: Partial<Order> = {}, id?: UniqueEntityID) {
  const status = Status.create(faker.helpers.arrayElement(Status.VALID_STATUS))

  const orderProduct = Order.create(
    {
      customerId: new UniqueEntityID(),
      status: status,
      ...override
    },
    id
  )

  return orderProduct
}
