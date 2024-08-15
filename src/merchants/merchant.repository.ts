import { Injectable, UnauthorizedException } from "@nestjs/common";
import { MerchantDto, UpdateMerchantDto } from "./dtos/merchant.dto";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Merchant, MerchantDocument } from "./entities/merchant.schema";

export interface DataSource {
    getMerchants: () => Promise<MerchantDocument[]>;
    addMerchant: (data: MerchantDto) => Promise<void>;
    updateMerchant: (merchantUser: UpdateMerchantDto, userCif: string) => Promise<MerchantDocument[]>;
    deleteMerchant: (userCif: string) => Promise<MerchantDocument[]>;
    getInvalidTokensByMerchantId: (id: string) => Promise<string[]>;
    updateInvalidTokensArray: (merchantId: string, token: string, userId: string) => Promise<MerchantDocument[]>;
    updateUserId: (merchantId: string, userId: string) => Promise<void>;
    getMerchantByCif: (cif: string) => Promise<MerchantDocument>;
    addUserIdToMerchant: (merchantId: string, userId: string) => Promise<MerchantDocument>
}

@Injectable()
export class MerchantRepository implements DataSource {
    constructor(
        @InjectModel(Merchant.name) private merchantModel: Model<Merchant>
    ) { }

    async getMerchantByCif(cif: string) {
        return await this.merchantModel.findOne({ cif: cif });
    }

    async getInvalidTokensByMerchantId(id: string): Promise<string[]> {
        const merchant = await this.merchantModel.findOne({ _id: id }).exec();
        if(!merchant) 
            throw new UnauthorizedException();
        let invalidTokens = [];
        merchant.users.forEach(user => {
            if(user.id.toString() === id) 
                invalidTokens = user.expireTokens;
        });
        return invalidTokens;
    }

    async getMerchants() : Promise<MerchantDocument[]> {
        const data = await this.merchantModel.find();
        return data;
    };

    async addMerchant(data: MerchantDto) : Promise<void> {
        await this.merchantModel.create(data);
    };

    async updateMerchant(merchantUser: UpdateMerchantDto, userCif: string) : Promise<MerchantDocument[]> {
        try {
            await this.merchantModel.findOneAndUpdate({ cif: userCif }, merchantUser);
        } catch (error) {
            return error;
        }
        return this.getMerchants();
    };

    async deleteMerchant(userCif: string) : Promise<MerchantDocument[]> {
        await this.merchantModel.findOneAndDelete( { cif: userCif });
        return this.getMerchants();
    };

    async updateInvalidTokensArray(merchantId: string, token: string, userId: string) {
        await this.merchantModel.updateOne(
            { _id: merchantId, 'users.id': userId},
            { $push: { 'users.$.expireTokens': token } }
        );
        return await this.getMerchants();
    }

    async updateUserId(merchantId: string, userId: string) {
        await this.merchantModel.updateOne(
            { _id: merchantId, 'users.id': userId },
            { $set: { 'users.$.id': null } }
        );
    }

    async addUserIdToMerchant(merchantId: string, userId: string) {
        return await this.merchantModel.findByIdAndUpdate(
            merchantId,
            { $push: { 
                users: { 
                    id: userId,
                    expireTokens: []
                    } 
                } 
            },
            { new: true }
        );
    }
}
