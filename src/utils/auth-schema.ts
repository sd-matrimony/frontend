import { z } from "zod"

import { validateIdentifier } from "./index"

const identifierField = z.string().superRefine((v, ctx) => {
  const result = validateIdentifier(v)
  if (result !== true) {
    ctx.addIssue({ code: "custom", message: result })
  }
})

export const signinSchema = z.object({
  email: identifierField,
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const forgotPassSchema = z.object({
  email: identifierField,
})

export const resetPassSchema = z.object({
  email: identifierField,
  password: z.string().min(8, "Password must be at least 8 characters"),
  otp: z.string().min(1, "OTP is required"),
})

export type SigninFormT = z.infer<typeof signinSchema>
export type ForgotPassFormT = z.infer<typeof forgotPassSchema>
export type ResetPassFormT = z.infer<typeof resetPassSchema>
