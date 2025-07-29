import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  })

  const configService = app.get(EnvService)
  const port = configService.get('APP_PORT')

  const config = new DocumentBuilder()
    .setTitle('API FastFood - Microserviço de Pagamento')
    .setDescription(
      'FIAP - Software Architecture - Tech Challenge - FASE 04<br>Grupo 18 - Felipe Alves Leal<br> Sistema de fast food API '
    )
    .setVersion('1.0')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, documentFactory)

  await app.listen(port)
}
bootstrap()
