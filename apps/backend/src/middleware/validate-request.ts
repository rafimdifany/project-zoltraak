import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { ZodTypeAny } from 'zod';

type RequestSchema = {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
};

export const validateRequest = ({ body, params, query }: RequestSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (body) {
      const result = body.safeParse(req.body);
      if (!result.success) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Invalid request body', issues: result.error.errors });
      }
      req.body = result.data;
    }

    if (params) {
      const result = params.safeParse(req.params);
      if (!result.success) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Invalid path params', issues: result.error.errors });
      }
      req.params = result.data;
    }

    if (query) {
      const result = query.safeParse(req.query);
      if (!result.success) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Invalid query params', issues: result.error.errors });
      }
      req.query = result.data;
    }

    next();
  };
};
