import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOTP, getOTPExpiry } from "@/lib/auth-utils";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import {
  successResponse,
  Errors,
  withErrorHandler,
  parseBody,
} from "@/lib/api-utils";

export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await parseBody(request);

  if (!body) {
    return Errors.badRequest("Invalid request body");
  }

  const parsed = forgotPasswordSchema.safeParse(body);

  if (!parsed.success) {
    return Errors.validationError(parsed.error);
  }

  const { email } = parsed.data;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true, name: true },
  });

  // Don't reveal if user exists or not for security
  if (!user) {
    return successResponse(
      { message: "If an account exists, you will receive a password reset email." },
      "Password reset email sent"
    );
  }

  // Invalidate any existing password reset OTPs
  await prisma.oTP.updateMany({
    where: {
      email: email.toLowerCase(),
      purpose: "PASSWORD_RESET",
      used: false,
    },
    data: {
      used: true,
    },
  });

  // Generate OTP for password reset
  const code = generateOTP();
  const expiresAt = getOTPExpiry(15); // 15 minutes

  await prisma.oTP.create({
    data: {
      code,
      email: email.toLowerCase(),
      purpose: "PASSWORD_RESET",
      expiresAt,
      userId: user.id,
    },
  });

  // TODO: Send password reset email
  // await sendEmail({
  //   to: email,
  //   subject: "Password Reset Request",
  //   body: `Your password reset OTP is: ${code}. It expires in 15 minutes.`,
  // });

  // In development, log the OTP
  if (process.env.NODE_ENV === "development") {
    console.log(`Password reset OTP for ${email}: ${code}`);
  }

  return successResponse(
    { message: "If an account exists, you will receive a password reset email." },
    "Password reset email sent"
  );
});
