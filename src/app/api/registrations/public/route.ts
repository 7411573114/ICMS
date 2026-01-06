import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRegistrationSchema } from "@/lib/validations/registration";
import {
  successResponse,
  Errors,
  withErrorHandler,
  parseBody,
} from "@/lib/api-utils";

// POST /api/registrations/public - Public registration (no auth required)
export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await parseBody(request);

  if (!body) {
    return Errors.badRequest("Invalid request body");
  }

  const parsed = createRegistrationSchema.safeParse(body);

  if (!parsed.success) {
    return Errors.validationError(parsed.error);
  }

  const data = parsed.data;

  // Check if event exists and is open for registration
  const event = await prisma.event.findUnique({
    where: { id: data.eventId },
    select: {
      id: true,
      title: true,
      capacity: true,
      isRegistrationOpen: true,
      registrationDeadline: true,
      isPublished: true,
      price: true,
      earlyBirdPrice: true,
      earlyBirdDeadline: true,
      currency: true,
      _count: {
        select: { registrations: true },
      },
    },
  });

  if (!event) {
    return Errors.notFound("Event");
  }

  // Only allow registration for published events
  if (!event.isPublished) {
    return Errors.badRequest("Event is not available for registration");
  }

  if (!event.isRegistrationOpen) {
    return Errors.badRequest("Registration is closed for this event");
  }

  if (event.registrationDeadline && new Date() > event.registrationDeadline) {
    return Errors.badRequest("Registration deadline has passed");
  }

  // Check capacity
  const availableSlots = event.capacity - event._count.registrations;
  if (availableSlots <= 0) {
    data.status = "WAITLIST";
  }

  // Check for duplicate registration
  const existingRegistration = await prisma.registration.findUnique({
    where: {
      email_eventId: {
        email: data.email.toLowerCase(),
        eventId: data.eventId,
      },
    },
  });

  if (existingRegistration) {
    return Errors.conflict("You are already registered for this event");
  }

  // Calculate amount (early bird if applicable)
  let amount = data.amount;
  if (
    event.earlyBirdPrice &&
    event.earlyBirdDeadline &&
    new Date() <= event.earlyBirdDeadline
  ) {
    amount = Number(event.earlyBirdPrice);
  }

  // Set payment status to FREE if amount is 0
  let paymentStatus = data.paymentStatus;
  if (amount === 0) {
    paymentStatus = "FREE";
  }

  const registration = await prisma.registration.create({
    data: {
      ...data,
      email: data.email.toLowerCase(),
      amount,
      paymentStatus,
      currency: event.currency,
      registeredById: null, // Public registration - no registeredBy
    },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          startDate: true,
        },
      },
    },
  });

  return successResponse(registration, "Registration successful", 201);
});
