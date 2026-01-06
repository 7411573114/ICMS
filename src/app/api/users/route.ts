import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, canAccess } from "@/lib/auth";
import { createUserSchema } from "@/lib/validations/user";
import { hashPassword } from "@/lib/auth-utils";
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

// GET /api/users - List all users (admin only)
export const GET = withErrorHandler(async (request: NextRequest) => {
  const session = await auth();

  if (!session) {
    return Errors.unauthorized();
  }

  // Only super admin can list all users
  if (session.user.role !== "SUPER_ADMIN") {
    return Errors.forbidden("Only administrators can view all users");
  }

  const { searchParams } = new URL(request.url);
  const { page, limit, skip } = getPaginationParams(searchParams);
  const { field: sortBy, order: sortOrder } = getSortParams(
    searchParams,
    ["createdAt", "name", "email", "role"],
    "createdAt"
  );

  // Build filters
  const where: Prisma.UserWhereInput = {};

  const role = searchParams.get("role");
  if (role) {
    where.role = role as Prisma.EnumUserRoleFilter;
  }

  const isActive = searchParams.get("isActive");
  if (isActive !== null) {
    where.isActive = isActive === "true";
  }

  const search = searchParams.get("search");
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { registrations: true },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return paginatedResponse(users, { page, limit, total });
});

// POST /api/users - Create new user (admin only)
export const POST = withErrorHandler(async (request: NextRequest) => {
  const session = await auth();

  if (!session) {
    return Errors.unauthorized();
  }

  // Only super admin can create users
  if (session.user.role !== "SUPER_ADMIN") {
    return Errors.forbidden("Only administrators can create users");
  }

  const body = await parseBody(request);

  if (!body) {
    return Errors.badRequest("Invalid request body");
  }

  const parsed = createUserSchema.safeParse(body);

  if (!parsed.success) {
    return Errors.validationError(parsed.error);
  }

  const { password, ...data } = parsed.data;

  // Check for duplicate email
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });

  if (existingUser) {
    return Errors.conflict("A user with this email already exists");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      ...data,
      email: data.email.toLowerCase(),
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      name: true,
      firstName: true,
      lastName: true,
      phone: true,
      avatar: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return successResponse(user, "User created successfully", 201);
});
