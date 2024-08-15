import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from "../merchants/constants/auth.constant";
import { JwtTokenService } from "../merchants/jwtToken.service";
import { MerchantService } from "src/merchants/merchants.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private jwtTokenService: JwtTokenService, private merchantService: MerchantService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        const data = await this.jwtTokenService.extractJwtTokenData(token);
        const expiredTokens = await this.merchantService.getExpireTokens(data.merchantId);
        if(expiredTokens && expiredTokens.includes(token)) 
            throw new UnauthorizedException();
        const payload = await this.jwtService.verifyAsync( token, { secret: jwtConstants.secret });
        request['user'] = payload;
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers['authorization']?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}