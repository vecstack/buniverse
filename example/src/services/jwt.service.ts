import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { z } from 'zod';

import { Err, Ok } from '../errors/Result';
import { env } from '../config/env/env';

export class JWTFactory<T extends JWTPayload> {
  constructor(private schema: z.ZodType<T>) {}

  async sign(payload: T) {
    try {
      const jwt = new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(env.JWT_EXPIRATION);
      const token = await jwt.sign(new TextEncoder().encode(env.JWT_SECRET));
      return Ok(token);
    } catch (error) {
      return Err('Something went wrong');
    }
  }

  async verify(jwt: string) {
    try {
      const data = await jwtVerify(jwt, new TextEncoder().encode(env.JWT_SECRET));
      const result = this.schema.safeParse(data.payload);
      if (!result.success) return Err(result.error.message);
      return Ok(result.data);
    } catch (error) {
      return Err('Something went wrong');
    }
  }
}

export const TokenPayloadSchema = z.object({ id: z.string(), role: z.string() });
export const TokensJWT = new JWTFactory(TokenPayloadSchema);
