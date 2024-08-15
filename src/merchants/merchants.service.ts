import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { MerchantDto, UpdateMerchantDto } from './dtos/merchant.dto';
import { DataSource } from './merchant.repository';
import { RabbitMQService } from 'src/rabbitMQ/rabbitmq.service';

@Injectable()
export class MerchantService implements OnModuleInit {
    constructor(
        @Inject("DataSource") private repo: DataSource,
        private readonly rabbitmqService: RabbitMQService
    ) {}

    async onModuleInit() {
        await this.rabbitmqService.consume('merchants-queue', (msg) => {
            const message = JSON.parse(msg.content.toString());
            const headers = msg.properties.headers;
            const functionName = headers.functionName;
            const args = message.args || [];

            if (typeof this[functionName] === 'function') {
                this[functionName].apply(this, args);
            } else {
                throw new BadRequestException(`Function ${functionName} is not defined in MerchantService.`);
            }
        });
    }

    async getMerchantByCif(cif: string) {
        return await this.repo.getMerchantByCif(cif);
    }

    async doesCifExists(cif: string): Promise<boolean> {
        const data = await this.repo.getMerchants();
        if(data.length === 0) return false;
        return data.some(obj => obj.cif === cif);
    }

    async sendMerchantsArray() {
        const merchants = await this.repo.getMerchants();
        if(merchants.length > 0) return merchants;
        throw new BadRequestException("No merchants exist in DB");
    }

    async addNewMerchant(body: MerchantDto) {
        const cifFound = await this.doesCifExists(body.cif);
        if(cifFound) throw new BadRequestException("CIF already found");
        await this.repo.addMerchant(body);
        return body;    
    }

    async updateMerchantInfo(body: UpdateMerchantDto, cif: string) {
        const cifFound = await this.doesCifExists(cif);
        if(!cifFound) throw new BadRequestException("CIF entered does not exist!");
        try {
            return await this.repo.updateMerchant(body, cif);
        } catch (error) {
            return error;
        }
    }

    async addUserIdToMerchant(merchantId: string, userId: string) {
        try {
            return this.repo.addUserIdToMerchant(merchantId, userId);
        } catch (error) {
            return error;
        }
    }

    async updateInvalidTokensArray(merchantId: string, token: string, userId: string) {
        try {
            return await this.repo.updateInvalidTokensArray(merchantId, token, userId); 
        } catch (error) {
            return error;
        }
    }

    async deleteMerchant(cif: string) {
        const cifFound = await this.doesCifExists(cif);
        if(!cifFound) throw new BadRequestException("CIF entered does not exist!");
        const merchant = await this.getMerchantByCif(cif);
        const result = await this.repo.deleteMerchant(cif);

        const userMessage = {
            args: [merchant._id, true]
        };
        const payerMessage = {
            args: [merchant._id]
        };
        const usersHeaders = { functionName: 'deleteUserByMerchantId' };
        const payersHeaders = { functionName: 'deletePayerByMerchantId' };

        this.rabbitmqService.publish('users-queue', JSON.stringify(userMessage), usersHeaders);
        this.rabbitmqService.publish('payers-queue', JSON.stringify(payerMessage), payersHeaders);

        return result;
    }

    async getExpireTokens(merchantId: string) {
        const expireTokens = await this.repo.getInvalidTokensByMerchantId(merchantId);
        return expireTokens;
    }

    async updateUserId(merchantId: string, userId: string) {
        try {
            return await this.repo.updateUserId(merchantId, userId);
        } catch (error) {
            return error;
        }
    }
}
