import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import * as morgan from "morgan";
import { logger } from "src/config/winston.config";


@Injectable()
export class MorganMiddleware implements NestMiddleware {
    use(req: any, res: any, next: (error?: any) => void) {
        const ip = req.ip;
        const method = req.method;
        const url = req.url;
        const status = res.statusCode;
        morgan('combined', {
            stream: { write: (message: string) => logger.info(message.trim(), {ip, method, url, status}) }
        })(req, res, next);
    }
}