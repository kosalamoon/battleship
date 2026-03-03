import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requestContextStorage } from '../context/request-context';
import { AppLogger } from '../logger/app-logger.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: AppLogger) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const requestId = uuidv4();
    res.setHeader('X-Request-Id', requestId);

    requestContextStorage.run({ requestId }, () => {
      const { method, path } = req;
      const startTime = Date.now();

      res.on('finish', () => {
        const duration = Date.now() - startTime;
        this.logger.log(
          `${method} ${path} ${res.statusCode} - ${duration}ms`,
          'HTTP',
        );
      });

      next();
    });
  }
}
