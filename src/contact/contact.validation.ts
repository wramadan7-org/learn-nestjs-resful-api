import z, { ZodType } from 'zod';

export class ContactValidation {
  static readonly CreateContactSchema: ZodType = z.object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, 'Invalid'),
  });

  static readonly UpdateContactSchema: ZodType = z.object({
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
    phone: z
      .string()
      .regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, 'Invalid')
      .optional(),
  });
}
