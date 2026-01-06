import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, Errors, withErrorHandler } from "@/lib/api-utils";

// GET /api/events/public/[id] - Get single public event (no auth required)
export const GET = withErrorHandler(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;

    const event = await prisma.event.findFirst({
      where: {
        id,
        isPublished: true,
      },
      include: {
        eventSpeakers: {
          include: {
            speaker: {
              select: {
                id: true,
                name: true,
                title: true,
                organization: true,
                bio: true,
                avatar: true,
                specialization: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
        eventSponsors: {
          include: {
            sponsor: {
              select: {
                id: true,
                name: true,
                logo: true,
                website: true,
              },
            },
          },
          orderBy: { tier: "asc" },
        },
        sessions: {
          orderBy: [{ date: "asc" }, { startTime: "asc" }],
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });

    if (!event) {
      return Errors.notFound("Event");
    }

    return successResponse(event);
  }
);
