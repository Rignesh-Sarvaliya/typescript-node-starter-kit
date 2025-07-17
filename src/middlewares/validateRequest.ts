import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { formatZodError } from "@/utils/zodErrorFormatter";
import { error } from "@/utils/responseWrapper";

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
    if (body) {
      const result = body.safeParse(req.body);
      if (!result.success) {
        return res
          .status(422)
          .json(error("Validation failed", formatZodError(result.error)));
      }
      req.body = result.data;
    }

    if (query) {
      const result = query.safeParse(req.query);
      if (!result.success) {
        return res
          .status(422)
          .json(error("Validation failed", formatZodError(result.error)));
      }
      req.query = result.data;
    }

    if (params) {
      const result = params.safeParse(req.params);
      if (!result.success) {
        return res
          .status(422)
          .json(error("Validation failed", formatZodError(result.error)));
      }
      req.params = result.data;
    }

    next();
  };
}
