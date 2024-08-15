import { Module } from '@nestjs/common';
import { MerchantsController } from './merchants.controller';
import { MerchantService } from './merchants.service';
import { MerchantRepository } from './merchant.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Merchant, MerchantSchema } from './entities/merchant.schema';
import { JwtTokenService } from './jwtToken.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/auth.constant';
import { RabbitMQModule } from 'src/rabbitMQ/rabbitmq.module';

@Module({
  controllers: [MerchantsController],
  providers: [
    MerchantService,
    JwtTokenService,
    {
      provide: 'DataSource',
      useClass: MerchantRepository
    }
  ],
  imports: [
    MongooseModule.forFeature([{ name: Merchant.name, schema: MerchantSchema }]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '6000s' }
    }),
    RabbitMQModule
  ]
})
export class MerchantsModule {}
