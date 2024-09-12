import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Jwt } from "../interfaces/User";
import { Request, Response, NextFunction } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: Jwt;
  }
}

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "fallback_secret_key";

export const authenticateTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }
    const payload = decoded as Jwt;
    req.user = payload;

    next();
  });
};
