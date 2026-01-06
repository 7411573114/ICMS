import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, canAccess } from "@/lib/auth";
import { bulkRegistrationActionSchema } from "@/lib/validations/registration";
import {
  successResponse,
  Errors,
  withErrorHandler,
  parseBody,
} from "@/lib/api-utils";

// POST /api/registrations/bulk - Perform bulk actions on registrations
export const POST = withErrorHandler(async (request: NextRequest) => {
  const session = await auth();

  if (!session) {
    return Errors.unauthorized();
  }

  if (!canAccess(session.user.role, "registrations")) {
    return Errors.forbidden("You don't have permission to manage registrations");
  }

  const body = await parseBody(request);

  if (!body) {
    return Errors.badRequest("Invalid request body");
  }

  const parsed = bulkRegistrationActionSchema.safeParse(body);

  if (!parsed.success) {
    return Errors.validationError(parsed.error);
  }

  const { registrationIds, action, data } = parsed.data;

  // Verify all registrations exist
  const existingRegistrations = await prisma.registration.findMany({
    where: { id: { in: registrationIds } },
    select: { id: true, status: true, paymentStatus: true, email: true },
  });

  if (existingRegistrations.length !== registrationIds.length) {
    return Errors.badRequest("Some registration IDs are invalid");
  }

  let result;

  switch (action) {
    case "confirm":
      result = await prisma.registration.updateMany({
        where: { id: { in: registrationIds } },
        data: { status: "CONFIRMED" },
      });
      break;

    case "cancel":
      result = await prisma.registration.updateMany({
        where: { id: { in: registrationIds } },
        data: { status: "CANCELLED" },
      });
      break;

    case "mark_attended":
      result = await prisma.registration.updateMany({
        where: { id: { in: registrationIds } },
        data: {
          status: "ATTENDED",
          attendanceStatus: "checked_in",
          checkedInAt: new Date(),
        },
      });
      break;

    case "mark_paid":
      result = await prisma.registration.updateMany({
        where: { id: { in: registrationIds } },
        data: {
          paymentStatus: "PAID",
          paidAt: new Date(),
        },
      });
      break;

    case "send_email":
      // TODO: Implement email sending
      // For now, just return the list of emails
      const emails = existingRegistrations.map((r) => r.email);
      return successResponse(
        { emails, message: "Email sending will be implemented with SMTP setup" },
        `${emails.length} recipients queued for email`
      );

    default:
      return Errors.badRequest("Invalid action");
  }

  return successResponse(
    { updated: result.count },
    `${result.count} registrations updated`
  );
});
