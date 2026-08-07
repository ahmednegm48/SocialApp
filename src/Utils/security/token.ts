import { Secret, sign, SignOptions } from "jsonwebtoken";
import { HUserDocument } from "../../DB/Models/user.model";
import { RoleEnum } from "../enums/user.enum";
import { env } from "../../Config/config.service";

export const generateToken = ({
  payload,
  secret,
  options,
}: {
  payload: object;
  secret: Secret;
  options: SignOptions;
}) => {
  return sign(payload, secret, options);
};

export const createLoginCredentials = (
  user: HUserDocument,
): { accessToken: string; refreshToken: string } => {
  const isAdmin = user.role === RoleEnum.ADMIN;
  const accessSecret = isAdmin
    ? env.ACCESS_TOKEN_ADMIN_SECRET
    : env.ACCESS_TOKEN_USER_SECRET;
  const accessExpiration = isAdmin
    ? env.ACCESS_TOKEN_ADMIN_EXPIRATION
    : env.ACCESS_TOKEN_USER_EXPIRATION;
  const refreshSecret = isAdmin
    ? env.REFRESH_TOKEN_ADMIN_SECRET
    : env.REFRESH_TOKEN_USER_SECRET;
  const refreshExpiration = isAdmin
    ? env.REFRESH_TOKEN_ADMIN_EXPIRATION
    : env.REFRESH_TOKEN_USER_EXPIRATION;
  const accessToken = generateToken({
    payload: { _id: user._id },
    secret: accessSecret,
    options: { expiresIn: accessExpiration },
  });
  const refreshToken = generateToken({
    payload: { _id: user._id },
    secret: refreshSecret,
    options: { expiresIn: refreshExpiration },
  });
  return { accessToken, refreshToken };
};
