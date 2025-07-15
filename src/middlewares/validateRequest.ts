import { ZodError } from "zod";
import { formatZodError } from "../utils/zodErrorFormatter";

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
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(422).json({
          message: "Validation failed",
          errors: formatZodError(error),
        });
      }

      return res.fail("Unexpected validation error");
    }
  };
}
