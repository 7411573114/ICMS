import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, canAccess } from "@/lib/auth";
import { updateEventSchema } from "@/lib/validations/event";
import { generateUniqueSlug } from "@/lib/auth-utils";
import {
  successResponse,
  Errors,
  withErrorHandler,
  parseBody,
} from "@/lib/api-utils";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/events/[id] - Get single event (public access for published events)
export const GET = withErrorHandler(
  async (request: NextRequest, context?: RouteContext) => {
    const session = await auth();
    const { id } = await context!.params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        eventSpeakers: {
          where: session ? {} : { isPublished: true },
          include: {
            speaker: true,
          },
          orderBy: { sessionOrder: "asc" },
        },
        eventSessions: {
          where: session ? {} : { isPublished: true },
          include: {
            speaker: {
              select: {
                id: true,
                name: true,
                designation: true,
                institution: true,
                photo: true,
              },
            },
          },
          orderBy: [{ sessionDate: "asc" }, { sessionOrder: "asc" }],
        },
        eventSponsors: {
          where: session ? {} : { isPublished: true },
          include: {
            sponsor: true,
          },
          orderBy: { displayOrder: "asc" },
        },
        _count: {
          select: { registrations: true, certificates: true },
        },
      },
    });

    if (!event) {
      return Errors.notFound("Event");
    }

    // Public users can only view published events
    if (!session && !event.isPublished) {
      return Errors.notFound("Event");
    }

    return successResponse(event);
  }
);

// PUT /api/events/[id] - Update event
export const PUT = withErrorHandler(
  async (request: NextRequest, context?: RouteContext) => {
    const session = await auth();

    if (!session) {
      return Errors.unauthorized();
    }

    if (!canAccess(session.user.role, "events")) {
      return Errors.forbidden("You don't have permission to update events");
    }

    const { id } = await context!.params;

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return Errors.notFound("Event");
    }

    const body = await parseBody(request);

    if (!body) {
      return Errors.badRequest("Invalid request body");
    }

    const parsed = updateEventSchema.safeParse(body);

    if (!parsed.success) {
      return Errors.validationError(parsed.error);
    }

    const data = parsed.data;

    // If slug is being changed, check for uniqueness
    if (data.slug && data.slug !== existingEvent.slug) {
      const slugExists = await prisma.event.findUnique({
        where: { slug: data.slug },
      });

      if (slugExists) {
        return Errors.conflict("An event with this slug already exists");
      }
    }

    // If title changed but no slug provided, regenerate slug
    if (data.title && !data.slug && data.title !== existingEvent.title) {
      data.slug = generateUniqueSlug(data.title);
    }

    const updateData: Record<string, unknown> = { ...data };

    // Convert date strings to Date objects
    if (data.startDate) {
      updateData.startDate = new Date(data.startDate);
    }
    if (data.endDate) {
      updateData.endDate = new Date(data.endDate);
    }
    // Handle optional date fields - empty string means null
    if (data.registrationDeadline !== undefined) {
      updateData.registrationDeadline = data.registrationDeadline
        ? new Date(data.registrationDeadline)
        : null;
    }
    if (data.earlyBirdDeadline !== undefined) {
      updateData.earlyBirdDeadline = data.earlyBirdDeadline
        ? new Date(data.earlyBirdDeadline)
        : null;
    }

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    return successResponse(event, "Event updated successfully");
  }
);

// DELETE /api/events/[id] - Delete event
export const DELETE = withErrorHandler(
  async (request: NextRequest, context?: RouteContext) => {
    const session = await auth();

    if (!session) {
      return Errors.unauthorized();
    }

    if (!canAccess(session.user.role, "events")) {
      return Errors.forbidden("You don't have permission to delete events");
    }

    const { id } = await context!.params;

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            registrations: true,
            eventSpeakers: true,
            eventSponsors: true,
          },
        },
      },
    });

    if (!existingEvent) {
      return Errors.notFound("Event");
    }

    // Prevent deletion if event has registrations
    if (existingEvent._count.registrations > 0) {
      return Errors.badRequest(
        "Cannot delete event with existing registrations. Cancel registrations first."
      );
    }

    // Delete linked speakers and sponsors first, then delete the event
    const [deletedSpeakers, deletedSponsors, deletedEvent] = await prisma.$transaction([
      prisma.eventSpeaker.deleteMany({
        where: { eventId: id },
      }),
      prisma.eventSponsor.deleteMany({
        where: { eventId: id },
      }),
      prisma.event.delete({
        where: { id },
      }),
    ]);

    return successResponse(
      {
        id: deletedEvent.id,
        unlinkedSpeakers: deletedSpeakers.count,
        unlinkedSponsors: deletedSponsors.count,
      },
      "Event deleted successfully"
    );
  }
);
