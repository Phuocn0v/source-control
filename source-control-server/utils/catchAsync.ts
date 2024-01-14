import { Request, Response, NextFunction } from 'express';
import ApiError from './ApiError';
import httpStatus from 'http-status';

function catchAsync(fn: Function) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next).catch(next);
        } catch (error) {
            if (error instanceof ApiError) {
                return res.send(error.statusCode).send(error.message);
            }
            else return res.send(httpStatus.INTERNAL_SERVER_ERROR).send(error);
        }
    }
}
export default catchAsync;
