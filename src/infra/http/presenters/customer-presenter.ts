import { Customer } from '@/domain/fastfood/enterprise/entities'

export class CustomerPresenter {
  static toHTTP(customer: Customer) {
    return {
      id: customer.id.toString(),
      cpf: customer.cpf?.toFormattedString(),
      name: customer.name,
      email: customer.email?.toString()
    }
  }
}
