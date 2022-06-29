import { Request, Response, NextFunction } from "express";
import jwt_decode from "jwt-decode";
import { IAuthHeader } from "../interfaces";

async function sessionValidationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!isValidAuthHeaderFormat(authHeader))
    return res
      .status(401)
      .json({ errorCode: -1, errorMessage: "Invalid auth header" });

  try {
    if (!isAuthHeaderValid(authHeader))
      return res
        .status(403)
        .json({ errorCode: -1, errorMessage: "Invalid auth header" });
  } catch (err) {
    return res
      .status(401)
      .json({ errorCode: -1, errorMessage: "Invalid auth header" });
  }

  next();
}

export const isValidAuthHeaderFormat = (authHeader: string | undefined): boolean => {
  if (!authHeader) return false;
  const splitAuthHeader = authHeader.split(" ");
  return splitAuthHeader[0] === "Bearer" && !!splitAuthHeader[1];
};

/**
 * Dummy authorization header validation
 * Expected jwt object:
 * {
    "Issuer": "DummyIssuer",
    "Role": "Visitor",
    "exp": "2099-12-31T00:00:00.000Z"
   }`  
 * 
 * @param authHeader 
 * @returns boolean value of whether auth header is valid
 * 
 * expected input:
 * eyJhbGciOiJSUzI1NiJ9.eyJJc3N1ZXIiOiJEdW1teUlzc3VlciIsIlJvbGUiOiJWaXNpdG9yIiwiZXhwIjo0MTAyMzc2NDAwMDAwfQ.IE4KJyHyGqC6JFaixwRmJaObduY2p_qyEnLMHB5b8pNHO5tRGLHTknEanbbm101ETbz1wUnX9SOTI3oRCSvwY0n5O5hmLPFeMkP3b015CN7RXxOub8AlOoEBRa-x74TOhdDpgL-GrTpqG-lXzmoqC0SbhV25fUFMWO6El9iEQdpXBVrJ8tEB5fd42vzDcjvMbLVG0N74LgzjQLpBAE3bORTelP7S3qLuE_lwswzdqFeMfWqmJpBZ8C9vOWXQG7VeaVUhPq9a7r-mFJDV5waXHawWP2mb0hp9X29zNNN9fafTULM9rjy9U-sa4f_SGUmx7W14ES5rrq3yugkDP9YWoQ
 */
export const isAuthHeaderValid = (authHeader: string = ""): boolean => {
  const token = authHeader.split(" ").slice(1).join(" ");
  const decoded: IAuthHeader = jwt_decode(token);
  return (
    decoded.Issuer === "DummyIssuer" &&
    decoded.Role === "Visitor" &&
    new Date(decoded.exp) > new Date()
  );
};

export default sessionValidationMiddleware;
