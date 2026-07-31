import { Request, Response, NextFunction, RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

export const asyncHandler =
  <P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = ParsedQs>(
    handler: (
      req: Request<P, ResBody, ReqBody, ReqQuery>,
      res: Response<ResBody>,
      next: NextFunction
    ) => any
  ): RequestHandler<P, ResBody, ReqBody, ReqQuery> =>
  (req, res, next) =>
    Promise.resolve(handler(req, res, next)).catch(next);