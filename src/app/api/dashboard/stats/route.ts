import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  successResponse,
  Errors,
  withErrorHandler,
} from "@/lib/api-utils";

// GET /api/dashboard/stats - Get dashboard statistics
export const GET = withErrorHandler(async (request: NextRequest) => {
  const session = await auth();

  if (!session) {
    return Errors.unauthorized();
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Get counts
  const [
    totalEvents,
    totalRegistrations,
    totalCertificates,
    totalUsers,
    totalSpeakers,
    totalSponsors,
    upcomingEvents,
    recentRegistrations,
    eventsByStatus,
    registrationsByStatus,
    revenue,
    monthlyRegistrations,
  ] = await Promise.all([
    // Total counts
    prisma.event.count(),
    prisma.registration.count(),
    prisma.certificate.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.speaker.count({ where: { isActive: true } }),
    prisma.sponsor.count({ where: { isActive: true } }),

    // Upcoming events (next 30 days)
    prisma.event.findMany({
      where: {
        startDate: { gte: now },
        status: { in: ["UPCOMING", "ACTIVE"] },
        isPublished: true,
      },
      orderBy: { startDate: "asc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        startDate: true,
        endDate: true,
        location: true,
        city: true,
        capacity: true,
        status: true,
        type: true,
        _count: {
          select: { registrations: true },
        },
      },
    }),

    // Recent registrations
    prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        paymentStatus: true,
        amount: true,
        createdAt: true,
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    }),

    // Events by status
    prisma.event.groupBy({
      by: ["status"],
      _count: { status: true },
    }),

    // Registrations by status
    prisma.registration.groupBy({
      by: ["status"],
      _count: { status: true },
    }),

    // Total revenue (paid registrations)
    prisma.registration.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { amount: true },
    }),

    // Monthly registrations (last 30 days)
    prisma.registration.count({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
  ]);

  // Calculate capacity utilization for upcoming events
  const upcomingEventsWithUtilization = upcomingEvents.map((event) => ({
    ...event,
    registeredCount: event._count.registrations,
    availableSlots: event.capacity - event._count.registrations,
    utilizationPercent: Math.round(
      (event._count.registrations / event.capacity) * 100
    ),
  }));

  // Format stats
  const stats = {
    overview: {
      totalEvents,
      totalRegistrations,
      totalCertificates,
      totalUsers,
      totalSpeakers,
      totalSponsors,
      totalRevenue: revenue._sum.amount || 0,
      monthlyRegistrations,
    },
    eventsByStatus: Object.fromEntries(
      eventsByStatus.map((s) => [s.status, s._count.status])
    ),
    registrationsByStatus: Object.fromEntries(
      registrationsByStatus.map((s) => [s.status, s._count.status])
    ),
    upcomingEvents: upcomingEventsWithUtilization,
    recentRegistrations,
  };

  return successResponse(stats);
});
