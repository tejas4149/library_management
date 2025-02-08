import { errorResponse } from "./serverResponse.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const key = crypto.randomBytes(32).toString("hex");

//function for generating token
export function generateToken(payload) {
  //create token
  const token = jwt.sign(payload, key, {
    expiresIn: "5m",
  });

  //create refreshToken
  const refreshtoken = jwt.sign(payload, key, {
    expiresIn: "2h",
  });
  return { token, refreshtoken };
}

//function to verify token
export function verifyToken(token) {
  try {
    return jwt.verify(token, key);
  } catch (error) {
    console.log("error", error.message);
    return null;
  }
}

export async function authMiddleware(req, res, next) {
  try {
    const bearertoken = req.headers.authorization || req.headers.Authorization;
    if (!bearertoken) {
      return errorResponse(res, 401, "authorization headres missing");
    }

    const tokendata = bearertoken.split(" ");
    console.log("token data", tokendata);
    if (!tokendata || tokendata?.length !== 2 || tokendata[0] !== "Bearer") {
      errorResponse(res, 401, "invalid token");
      return;
    }
    const payload = verifyToken(tokendata[1]);
    if (!payload) {
      return errorResponse(res, 401, "token is invalid");
    }
    console.log("payload", payload);

    res.locals.email = payload.email;
    res.locals.role = payload.role;
    next();
  } catch (error) {
    console.log(error);
    return errorResponse(res, "internal server error");
  }
}

export async function isSuperAdminMiddleware(req, res, next) {
  try {
    const role = res.locals.role;
    console.log("role", role);

    if (!role || role !== "superadmin") {
      return errorResponse(res, 401, "not authorized");
    }
    next();
  } catch (error) {
    console.log(error);
    return errorResponse(res, "Internal server error");
  }
}
