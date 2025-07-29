import { CustomerRepository } from '@/domain/fastfood/application/repositories/customer-repository'
import { Customer } from '@/domain/fastfood/enterprise/entities'

export class InMemoryCustomersRepository implements CustomerRepository {
  public items: Customer[] = []

  async findByCpf(cpf: string): Promise<Customer | null> {
    const customer = this.items.find(
      (customer) => customer.cpf?.toString() === cpf
    )

    if (!customer) {
      return null
    }

    return customer
  }

  async create(customer: Customer) {
    this.items.push(customer)
  }
}
