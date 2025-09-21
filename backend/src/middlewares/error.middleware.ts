import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/api-error';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  const defaultMessage = 'Internal server error';

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err instanceof Error) {
    res.status(500).json({ message: err.message || defaultMessage });
    return;
  }

  res.status(500).json({ message: defaultMessage });
};
