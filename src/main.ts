import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Swagger Configurations
  const config = new DocumentBuilder()
    .setTitle('NestJs Multi Tenant')
    .setDescription('NestJs Multi Tenant API description')
    .setVersion('1.0')
    .addTag('multi-tenant')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  //Setting global prefix
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
