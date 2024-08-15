import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtTokenService {
    constructor(private jwtService: JwtService) {}

    async extractJwtTokenData(token: string) {
        const tokenDecoded = await this.jwtService.decode(token);
        return tokenDecoded;
    }
}