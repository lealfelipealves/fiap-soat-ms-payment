import { Body, Controller, HttpCode, Param, Put } from '@nestjs/common'
import { ProductPresenter } from '../presenters/product-presenter'

import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'

import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { EditProductUseCase } from '@/domain/fastfood/application/use-cases/edit-product'
import { Category } from '@/domain/fastfood/enterprise/entities/value-objects'

const editProductBodySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.preprocess(
    (val) =>
      typeof val === 'string' || typeof val === 'number' ? String(val) : val,
    z
      .string()
      .default('0')
      .transform((val) => parseFloat(val))
      .refine(
        (val) => {
          // Permitir números inteiros ou com até duas casas decimais
          if (isNaN(val)) return false
          const decimalPart = val.toString().split('.')[1]
          return !decimalPart || decimalPart.length <= 2
        },
        {
          message:
            'O preço deve ser um número válido com até duas casas decimais.'
        }
      )
  ),
  category: z
    .string()
    .optional() // Torna o campo opcional
    .refine(
      (val) =>
        val === undefined ||
        ['Lanche', 'Acompanhamento', 'Bebida', 'Sobremesa'].includes(val),
      {
        message:
          'Categoria inválida. As opções válidas são: Lanche, Acompanhamento, Bebida, Sobremesa.'
      }
    )
})

const bodyValidationPipe = new ZodValidationPipe(editProductBodySchema)

type EditProductBodySchema = z.infer<typeof editProductBodySchema>

@ApiTags('Produtos')
@Controller('/products/:id')
export class EditProductController {
  constructor(private editProduct: EditProductUseCase) {}

  @Put()
  @HttpCode(204)
  @ApiOperation({
    summary: 'Editar um produto'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Hot-dog' },
        description: {
          type: 'string',
          example: 'Pão, salsicha, milho, ervilha, batata palha e molho.'
        },
        price: { type: 'number', example: 10.5 },
        category: {
          type: 'string',
          enum: Category.VALID_CATEGORIES.slice()
        }
      }
    }
  })
  async handle(
    @Param('id') id: string,
    @Body(bodyValidationPipe) body: EditProductBodySchema
  ) {
    const { name, description, price, category } = body

    const result = await this.editProduct.execute({
      productId: id,
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
