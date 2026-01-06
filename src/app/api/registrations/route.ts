import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, canAccess } from "@/lib/auth";
import { createRegistrationSchema } from "@/lib/validations/registration";
import {
  successResponse,
  paginatedResponse,
  Errors,
  withErrorHandler,
  parseBody,
  getPaginationParams,
  getSortParams,
} from "@/lib/api-utils";
import { Prisma } from "@prisma/client";

// GET /api/registrations - List all registrations (with filters)
export const GET = withErrorHandler(async (request: NextRequest) => {
  const session = await auth();

  if (!session) {
    return Errors.unauthorized();
  }

  if (!canAccess(session.user.role, "registrations")) {
    return Errors.forbidden("You don't have permission to view registrations");
  }

  const { searchParams } = new URL(request.url);
  const { page, limit, skip } = getPaginationParams(searchParams);
  const { field: sortBy, order: sortOrder } = getSortParams(
    searchParams,
    ["createdAt", "name", "status", "paymentStatus"],
    "createdAt"
  );

  // Build filters
  const where: Prisma.RegistrationWhereInput = {};

  const eventId = searchParams.get("eventId");
  if (eventId) {
    where.eventId = eventId;
  }

  const status = searchParams.get("status");
  if (status) {
    where.status = status as Prisma.EnumRegistrationStatusFilter;
  }

  const paymentStatus = searchParams.get("paymentStatus");
  if (paymentStatus) {
    where.paymentStatus = paymentStatus as Prisma.EnumPaymentStatusFilter;
  }

  const search = searchParams.get("search");
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  // Date range filters
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }
    if (endDate) {
      where.createdAt.lte = new Date(endDate);
    }
  }

  const [registrations, total] = await Promise.all([
    prisma.registration.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
      include: {
        event: {
          select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        registeredBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        certificate: {
          select: {
            id: true,
            certificateCode: true,
            status: true,
          },
        },
      },
    }),
    prisma.registration.count({ where }),
  ]);

  return paginatedResponse(registrations, { page, limit, total });
});

// POST /api/registrations - Create new registration
export const POST = withErrorHandler(async (request: NextRequest) => {
  // Check if user is authenticated (for admin registrations)
  const session = await auth();

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

  // Check if user is admin/staff - they can bypass registration restrictions
  const isAdminRegistration = session && canAccess(session.user.role, "registrations");

  // Only enforce registration restrictions for public (non-admin) registrations
  if (!isAdminRegistration) {
    if (!event.isRegistrationOpen) {
      return Errors.badRequest("Registration is closed for this event");
    }

    if (event.registrationDeadline && new Date() > event.registrationDeadline) {
      return Errors.badRequest("Registration deadline has passed");
    }
  }

  // Check capacity
  const availableSlots = event.capacity - event._count.registrations;
  if (availableSlots <= 0) {
    // Auto-set status to waitlist
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

  // If an admin/staff is creating this registration, track who did it
  const registeredById = session?.user?.id || null;

  const registration = await prisma.registration.create({
    data: {
      ...data,
      email: data.email.toLowerCase(),
      amount,
      paymentStatus,
      currency: event.currency,
      registeredById,
    },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          startDate: true,
        },
      },
      registeredBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return successResponse(registration, "Registration successful", 201);
});
