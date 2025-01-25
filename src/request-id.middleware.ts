import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as uuid from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.headers['x-request-id'] = uuid.v4(); // Generate a unique request ID
    next();
  }
}
