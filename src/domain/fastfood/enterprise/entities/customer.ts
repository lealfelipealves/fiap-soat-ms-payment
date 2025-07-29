import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Cpf, Email } from './value-objects'

export interface CustomerProps {
  cpf?: Cpf
  name?: string
  email?: Email
}

export class Customer extends Entity<CustomerProps> {
  get cpf() {
    return this.props.cpf
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  static create(
    props: Optional<CustomerProps, 'cpf' | 'name' | 'email'>,
    id?: UniqueEntityID
  ) {
    const customer = new Customer(
      {
        ...props,
        cpf: props.cpf ? Cpf.create(props.cpf.getValue()) : undefined,
        name: props.name ?? 'Anônimo',
        email: props.email ? Email.create(props.email.toString()) : undefined
      },
      id
    )

    return customer
  }
}
