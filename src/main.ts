import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { port } from './config';
import { ResponseInterceptor } from './merchants/interceptors/response.interceptor';
import { AllExceptionFilter } from './all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(port);
}
bootstrap();
