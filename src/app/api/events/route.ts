import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, canAccess } from "@/lib/auth";
import { createEventSchema } from "@/lib/validations/event";
import { generateUniqueSlug } from "@/lib/auth-utils";
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

// GET /api/events - List all events (with filters)
export const GET = withErrorHandler(async (request: NextRequest) => {
  const session = await auth();

  if (!session) {
    return Errors.unauthorized();
  }

  if (!canAccess(session.user.role, "events")) {
    return Errors.forbidden("You don't have permission to view events");
  }

  const { searchParams } = new URL(request.url);
  const { page, limit, skip } = getPaginationParams(searchParams);
  const { field: sortBy, order: sortOrder } = getSortParams(
    searchParams,
    ["createdAt", "startDate", "title", "status"],
    "createdAt"
  );

  // Build filters
  const where: Prisma.EventWhereInput = {};

  const status = searchParams.get("status");
  if (status) {
    where.status = status as Prisma.EnumEventStatusFilter;
  }

  const type = searchParams.get("type");
  if (type) {
    where.type = type as Prisma.EnumEventTypeFilter;
  }

  const search = searchParams.get("search");
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
    ];
  }

  const isPublished = searchParams.get("isPublished");
  if (isPublished !== null) {
    where.isPublished = isPublished === "true";
  }

  const isFeatured = searchParams.get("isFeatured");
  if (isFeatured !== null) {
    where.isFeatured = isFeatured === "true";
  }

  // Date range filters
  const startDateFrom = searchParams.get("startDateFrom");
  const startDateTo = searchParams.get("startDateTo");
  if (startDateFrom || startDateTo) {
    where.startDate = {};
    if (startDateFrom) {
      where.startDate.gte = new Date(startDateFrom);
    }
    if (startDateTo) {
      where.startDate.lte = new Date(startDateTo);
    }
  }

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    }),
    prisma.event.count({ where }),
  ]);

  return paginatedResponse(events, { page, limit, total });
});

// POST /api/events - Create a new event
export const POST = withErrorHandler(async (request: NextRequest) => {
  const session = await auth();

  if (!session) {
    return Errors.unauthorized();
  }

  if (!canAccess(session.user.role, "events")) {
    return Errors.forbidden("You don't have permission to create events");
  }

  const body = await parseBody(request);

  if (!body) {
    return Errors.badRequest("Invalid request body");
  }

  const parsed = createEventSchema.safeParse(body);

  if (!parsed.success) {
    return Errors.validationError(parsed.error);
  }

  const data = parsed.data;

  // Generate slug if not provided
  const slug = data.slug || generateUniqueSlug(data.title);

  // Check if slug is unique
  const existingEvent = await prisma.event.findUnique({
    where: { slug },
  });

  if (existingEvent) {
    return Errors.conflict("An event with this slug already exists");
  }

  const event = await prisma.event.create({
    data: {
      ...data,
      slug,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      registrationDeadline: data.registrationDeadline
        ? new Date(data.registrationDeadline)
        : null,
      earlyBirdDeadline: data.earlyBirdDeadline
        ? new Date(data.earlyBirdDeadline)
        : null,
    },
    include: {
      _count: {
        select: { registrations: true },
      },
    },
  });

  return successResponse(event, "Event created successfully", 201);
});
