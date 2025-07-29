import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { CreateProductUseCase } from '@/domain/fastfood/application/use-cases/create-product'
import { ProductPresenter } from '../presenters/product-presenter'

import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'

import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Category } from '@/domain/fastfood/enterprise/entities/value-objects'

const createProductBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.preprocess(
    (val) =>
      typeof val === 'string' || typeof val === 'number' ? Number(val) : val,
    z
      .number()
      .default(0)
      .refine(
        (val) => {
          // Permitir números com até duas casas decimais
          const isValid = !isNaN(val) && Math.floor(val * 100) === val * 100
          return isValid
        },
        {
          message:
            'O preço deve ser um número válido com até duas casas decimais.'
        }
      )
  ),
  category: z
    .string()
    .refine(
      (val) =>
        ['Lanche', 'Acompanhamento', 'Bebida', 'Sobremesa'].includes(val),
      {
        message:
          'Categoria inválida. As opções válidas são: Lanche, Acompanhamento, Bebida, Sobremesa.'
      }
    )
})

const bodyValidationPipe = new ZodValidationPipe(createProductBodySchema)

type CreateProductBodySchema = z.infer<typeof createProductBodySchema>

@ApiTags('Produtos')
@Controller('/products')
export class CreateProductController {
  constructor(private createProduct: CreateProductUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Criar um novo produto'
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'description', 'price', 'category'],
      properties: {
        name: { type: 'string', example: 'X-Bacon' },
        description: {
          type: 'string',
          example: 'Pão, hambúrguer, queijo, bacon, alface e tomate.'
        },
        price: { type: 'number', example: 15.5 },
        category: {
          type: 'string',
          enum: Category.VALID_CATEGORIES.slice()
        }
      }
    }
  })
  async handle(@Body(bodyValidationPipe) body: CreateProductBodySchema) {
    const { name, description, price, category } = body

    const result = await this.createProduct.execute({
      name,
      description,
      price,
      category
    })

    if (result.isLeft()) {
      throw new Error()
    }

    return { product: ProductPresenter.toHTTP(result.value.product) }
  }
}
