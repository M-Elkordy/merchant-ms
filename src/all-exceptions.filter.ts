import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { logger } from "./config/winston.config";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest();
        const res = ctx.getResponse();
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse = {
            success: false,
            message: exception.message
        }

        const logMessage = {
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.url,
            status,
            message: exception.message || 'Internal Server Error'
        }

        logger.error(logMessage.message, logMessage);

        res.status(status).json(errorResponse);
    }
}