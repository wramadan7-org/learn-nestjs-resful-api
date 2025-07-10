import z, { ZodType } from 'zod';

export class AuthValidation {
  static readonly RegisterUserSchema: ZodType = z.object({
    username: z.string().min(3).max(100),
    password: z.string().min(1).max(100),
    name: z.string().min(1).max(100),
  });

  static readonly LoginUserSchema: ZodType = z.object({
    username: z.string().min(3).max(100),
    password: z.string().min(1).max(100),
  });

  static readonly RefreshTokenUserSchema: ZodType = z.object({
    refreshToken: z.string(),
  });
}
