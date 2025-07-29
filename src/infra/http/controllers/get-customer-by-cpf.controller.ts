import { Controller, Get, Param } from '@nestjs/common'
import { GetCustomerByCpfUseCase } from '@/domain/fastfood/application/use-cases/get-customer-by-cpf'
import { CustomerPresenter } from '../presenters/customer-presenter'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Clientes')
@Controller('/customers/:cpf')
export class GetCustomerByCpfController {
  constructor(private getCustomerByCpf: GetCustomerByCpfUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Identificação do Cliente via CPF' })
  async handle(@Param('cpf') cpf: string) {
    const result = await this.getCustomerByCpf.execute({
      cpf
    })

    if (result.isLeft()) {
      throw new ResourceNotFoundError()
    }

    if (result.value.customer === null) {
      throw new ResourceNotFoundError()
    }
    return { customer: CustomerPresenter.toHTTP(result.value.customer) }
  }
}
