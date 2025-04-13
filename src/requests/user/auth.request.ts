import { z } from "zod";

export const RegisterRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const SocialLoginRequestSchema = z.object({
  social_id: z.string().min(3),
  provider: z.enum(["google", "facebook", "apple"]),
  name: z.string().min(2),
  email: z.string().email().optional(),
});

export const AppleDetailsRequestSchema = z.object({
  id: z.string().min(3),
});

export const SendOtpRequestSchema = z.object({
  email: z.string().email(),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});
