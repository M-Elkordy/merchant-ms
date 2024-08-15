import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type MerchantDocument = HydratedDocument<Merchant>;

@Schema()
export class Merchant {
    @Prop({ required: true, unique: true, length: 8 })
    cif: string;

    @Prop({ required: true, })
    industry: String;
    
    @Prop({ required: true, })
    email: String;
    
    @Prop({ required: true, })
    commercialName: String;
    
    @Prop({ required: true, })
    countryCode: String;
    
    @Prop({ required: true, })
    phoneNumber: String;

    @Prop({ type: [{ id: { type: String }, expireTokens: [String] }], _id: false })
    users?: { id: string, expireTokens: string[] }[];
}

export const MerchantSchema = SchemaFactory.createForClass(Merchant);