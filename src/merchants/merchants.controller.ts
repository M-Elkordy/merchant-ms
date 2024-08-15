import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MerchantService } from './merchants.service';
import { MerchantDto, UpdateMerchantDto } from './dtos/merchant.dto';
import { CustomValidationPipe } from './pipes/validation.pipe';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('merchants')
export class MerchantsController {
    constructor( private merchantService: MerchantService ) {}
    
    @Get()
    @UseGuards(AuthGuard)
    getMerchants() {
        return this.merchantService.sendMerchantsArray();
    }
    
    @Post()
    createMerchant(@Body(new CustomValidationPipe()) body: MerchantDto) {
        return this.merchantService.addNewMerchant(body);
    }
    
    @Put("/:id")
    @UseGuards(AuthGuard)
    updateMerchant(@Body(new CustomValidationPipe())body: UpdateMerchantDto, @Param('id') id: string) {
        return this.merchantService.updateMerchantInfo(body, id);
    }
    
    @Delete()
    @UseGuards(AuthGuard)
    deleteMerchant(@Query('cif') cif: string) {
        return this.merchantService.deleteMerchant(cif);
    } 
}
