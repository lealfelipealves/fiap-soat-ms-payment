import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CustomerFactory } from 'test/factories/make-customer'
import { Cpf, Email } from '@/domain/fastfood/enterprise/entities/value-objects'

describe('Get Customer by cpf (E2E)', () => {
  let app: INestApplication
  let customerFactory: CustomerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CustomerFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    customerFactory = moduleRef.get(CustomerFactory)

    await app.init()
  })

  test('[GET] /customers/:cpf', async () => {
    await customerFactory.makePrismaCustomer({
      cpf: Cpf.create('42217866044'),
      name: 'John Doe',
      email: Email.create('john@example.com')
    })

    const response = await request(app.getHttpServer())
      .get('/customers/42217866044')
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      customer: expect.objectContaining({
        cpf: '422.178.660-44',
        name: 'John Doe',
        email: 'john@example.com'
      })
    })
  })
})
