import { BadRequestError, InternalServerError } from "routing-controllers";

import { PgError, ConflictError } from "models/errors";

const UNKNOWN_ERROR = "Unknown server error";
const CONFLICT_PG_CODE = "23505";
const BAD_REQUEST_PG_CODE_REGEX = /^22|3/;

/**
 * Handles postgreSql error codes
 * @param error
 */
export function handlePgErrors({ code, message, detail }: PgError) {
  // Conflict error: unique constraint is violated
  if (code === CONFLICT_PG_CODE) throw new ConflictError(detail);

  // Bad request error: Data/constraint violated
  if (BAD_REQUEST_PG_CODE_REGEX.test(code)) throw new BadRequestError(detail || message);

  // Other errors
  throw new InternalServerError(message || UNKNOWN_ERROR);
}
