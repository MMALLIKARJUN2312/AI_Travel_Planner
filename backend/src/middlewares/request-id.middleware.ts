import { Request, Response, NextFunction } from 'express';
import {v4 as uuid} from 'uuid';

export const requestMiddleware = (
    req : Request, 
    res : Response, 
    next : NextFunction) : void => {
    req.requestId = uuid();
    next();
}