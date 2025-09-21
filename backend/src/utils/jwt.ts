import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { env } from '../config/env';

export interface AccessTokenPayload {
  id: string;
  email: string;
  role: string;
  permissions: string[];
}

export const signAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET as Secret, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn']
  });
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, env.JWT_SECRET as Secret) as AccessTokenPayload;
};
