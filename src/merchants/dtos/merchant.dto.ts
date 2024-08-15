import { Type } from "class-transformer";
import { IsString, Length, IsAlpha, IsNumberString, Equals, IsEmail, IsOptional, IsArray } from "class-validator";

class UserDto {
    @IsString()
    id: string;
    
    @IsArray()
    @IsOptional()
    expireTokens?: string[];
}

export class MerchantDto {
    @IsString()
    @Length(8, 8)
    cif: string;

    @IsString()
    @IsAlpha()
    industry: string;

    @IsString()
    @IsNumberString()
    @Length(10, 10)
    phoneNumber: string;

    @IsString()
    @Equals("+20")
    countryCode: string;

    @IsString()
    @Length(2)
    commercialName: string;
    
    @IsEmail()
    email: string;   
    
    @IsOptional()
    @Type(() => UserDto)
    users?: UserDto;
}

export class UpdateMerchantDto {
    @IsString()
    @Length(8, 8)
    @IsOptional()
    cif?: string;
    
    @IsString()
    @IsAlpha()
    @IsOptional()
    industry?: string;
    
    @IsString()
    @IsNumberString()
    @Length(10, 10)
    @IsOptional()
    phoneNumber?: string;
    
    @IsString()
    @Equals("+20")
    @IsOptional()
    countryCode?: string;
    
    @IsString()
    @Length(2)
    @IsOptional()
    commercialName?: string;
    
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsOptional()
    @Type(() => UserDto)
    users?: UserDto;
}