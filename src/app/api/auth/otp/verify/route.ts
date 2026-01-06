import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyOTPSchema } from "@/lib/validations/auth";
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

  const parsed = verifyOTPSchema.safeParse(body);

  if (!parsed.success) {
    return Errors.validationError(parsed.error);
  }

  const { email, code, purpose } = parsed.data;

  // Find the OTP
  const otp = await prisma.oTP.findFirst({
    where: {
      email: email.toLowerCase(),
      code,
      purpose,
      used: false,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!otp) {
    return Errors.badRequest("Invalid or expired OTP");
  }

  // Mark OTP as used
  await prisma.oTP.update({
    where: { id: otp.id },
    data: { used: true },
  });

  // For email verification, mark user as verified
  if (purpose === "EMAIL_VERIFICATION" && otp.userId) {
    await prisma.user.update({
      where: { id: otp.userId },
      data: { emailVerified: new Date() },
    });
  }

  // For password reset, generate a reset token
  if (purpose === "PASSWORD_RESET") {
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.verificationToken.create({
      data: {
        identifier: email.toLowerCase(),
        token,
        expires,
      },
    });

    return successResponse(
      { token, message: "OTP verified. Use this token to reset your password." },
      "OTP verified successfully"
    );
  }

  return successResponse(
    { verified: true },
    "OTP verified successfully"
  );
});
