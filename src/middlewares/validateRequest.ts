import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { formatZodError } from "../utils/zodErrorFormatter";
import { error } from "../utils/responseWrapper";

export default function validateRequest({
  body,
  query,
  params,
}: {
  body?: any;
  query?: any;
  params?: any;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (body) req.body = body.parse(req.body);
      if (query) req.query = query.parse(req.query);
      if (params) req.params = params.parse(req.params);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res
          .status(422)
          .json(error("Validation failed", formatZodError(err)));
      }

      return res.status(500).json(error("Unexpected validation error"));
    }
  };
}
