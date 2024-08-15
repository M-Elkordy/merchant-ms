import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MerchantsModule } from './merchants/merchants.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MorganMiddleware } from './middlewares/morgan.middleware';
import { connectionString } from './config';

@Module({
  imports: [
    MerchantsModule,
    MongooseModule.forRoot(connectionString)
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MorganMiddleware).forRoutes('*');
  }
}
