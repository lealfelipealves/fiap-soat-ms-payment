import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create Customer by cpf (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /customers/:cpf', async () => {
    const response = await request(app.getHttpServer())
      .post('/customers/42217866044')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com'
      })

    expect(response.statusCode).toBe(201)

    const customerOnDatabase = await prisma.customer.findUnique({
      where: {
        email: 'johndoe@example.com'
      }
    })

    expect(customerOnDatabase).toBeTruthy()
  })
})
