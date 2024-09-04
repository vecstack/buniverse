import { z } from 'zod';

const envSchema = z.object({
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRATION: z.string().min(1),
  UPLOADTHING_SECRET: z.string().min(1),
  UPLOADTHING_APP_ID: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
