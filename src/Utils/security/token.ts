import { JwtPayload, Secret, sign, SignOptions, verify } from "jsonwebtoken";
import { HUserDocument, UserModel } from "../../DB/Models/user.model";
import { RoleEnum } from "../enums/user.enum";
import { env } from "../../Config/config.service";
import {
  NotFoundException,
  UnauthorizedException,
} from "../response/error.response";

export enum TokenEnum {
  ACCESS = "access",
  REFRESH = "refresh",
}

export interface ITokenPayload extends JwtPayload {
  _id: string;
  role: RoleEnum;
}

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

export const verifyToken = ({
  token,
  secret,
}: {
  token: string;
  secret: Secret;
}): ITokenPayload => {
  return verify(token, secret) as ITokenPayload;
};

const getSignature = (
  type: TokenEnum,
  role: RoleEnum,
): { Secret: string; Expiration: number } => {
  const isAdmin = role === RoleEnum.ADMIN;
  if (type === TokenEnum.ACCESS) {
    const Secret = isAdmin
      ? env.ACCESS_TOKEN_ADMIN_SECRET
      : env.ACCESS_TOKEN_USER_SECRET;
    const Expiration = isAdmin
      ? env.ACCESS_TOKEN_ADMIN_EXPIRATION
      : env.ACCESS_TOKEN_USER_EXPIRATION;

    return { Secret, Expiration };
  }
  const Secret = isAdmin
    ? env.REFRESH_TOKEN_ADMIN_SECRET
    : env.REFRESH_TOKEN_USER_SECRET;
  const Expiration = isAdmin
    ? env.REFRESH_TOKEN_ADMIN_EXPIRATION
    : env.REFRESH_TOKEN_USER_EXPIRATION;

  return { Secret, Expiration };
};

export const createLoginCredentials = (
  user: HUserDocument,
): { accessToken: string; refreshToken: string } => {
  const payload = { _id: user._id.toString(), role: user.role };
  const access = getSignature(TokenEnum.ACCESS, user.role);
  const refresh = getSignature(TokenEnum.REFRESH, user.role);

  const accessToken = generateToken({
    payload,
    secret: access.Secret,
    options: { expiresIn: access.Expiration },
  });
  const refreshToken = generateToken({
    payload,
    secret: refresh.Secret,
    options: { expiresIn: refresh.Expiration },
  });
  return { accessToken, refreshToken };
};

export const decodeToken = async ({
  authorization,
  tokenType = TokenEnum.ACCESS,
}: {
  authorization: string | undefined;
  tokenType?: TokenEnum;
}): Promise<{ user: HUserDocument; decoded: ITokenPayload }> => {
  if (!authorization) throw new UnauthorizedException("you are not Authorized");
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer" || !token)
    throw new UnauthorizedException("Invalid token Format");
  let decoded: ITokenPayload;
  try {
    decoded = verifyToken({
      token,
      secret: getSignature(tokenType, RoleEnum.USER).Secret,
    });
  } catch {
    try {
      decoded = verifyToken({
        token,
        secret: getSignature(tokenType, RoleEnum.ADMIN).Secret,
      });
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
  if (!decoded._id) {
    throw new UnauthorizedException("Invalid Token Payload");
  }
  const user = await UserModel.findById(decoded._id);
  if (!user) throw new NotFoundException("Account Not Found");
  return { user, decoded };
};
