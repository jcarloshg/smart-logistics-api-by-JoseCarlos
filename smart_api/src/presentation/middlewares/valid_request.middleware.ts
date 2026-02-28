import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodType } from 'zod';

import { FactoryResponses } from '@/application/shared/models/entities/FactoryResponses';

export function validateRequest(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error: unknown) {
      FactoryResponses.badRequest(res);
    }
  };
}
