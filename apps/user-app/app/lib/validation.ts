import { z } from "zod";

// Amounts in this codebase are stored in paise (amount * 100 before hitting
// the server actions), so we validate the paise value: must be a positive
// integer, and capped to something sane to avoid overflow / fat-finger errors.
export const amountSchema = z
  .number({ invalid_type_error: "Amount must be a number" })
  .int("Amount must be a whole number of paise")
  .positive("Amount must be greater than 0")
  .max(10_000_000_00, "Amount exceeds maximum allowed transfer (₹1,00,00,000)");

export function validateAmount(amount: unknown): { success: true; amount: number } | { success: false; message: string } {
  const result = amountSchema.safeParse(amount);
  if (!result.success) {
    return { success: false, message: result.error.issues[0]?.message ?? "Invalid amount" };
  }
  return { success: true, amount: result.data };
}