import { Customer } from '@/domain/fastfood/enterprise/entities/customer'

export abstract class CustomerRepository {
  abstract findByCpf(cpf: string): Promise<Customer | null>
  abstract create(customer: Customer): Promise<void>
}
