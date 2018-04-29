import { HttpError } from "routing-controllers";

export interface PgError {
  code: string;
  message: string;
  detail: string;
}

export class ConflictError extends HttpError {
  name = "ConflictError";

  constructor(message: string) {
    super(409, message);
  }
}
