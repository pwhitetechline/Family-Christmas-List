import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';

export const GET: APIRoute = async ({ request }) => {
  try {
    const userId = await verifyToken(request);
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    const familyGroups = await prisma.familyGroupMember.findMany({
      where: { userId },
      include: {
        familyGroup: true,
      },
    });

    return new Response(JSON.stringify(familyGroups), {
      status: 200,
    });
  } catch (error) {
    console.error('Get family groups error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get family groups' }), {
      status: 500,
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const userId = await verifyToken(request);
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    const { name } = await request.json();

    const familyGroup = await prisma.familyGroup.create({
      data: {
        name,
        members: {
          create: {
            userId,
            role: 'admin',
          },
        },
      },
    });

    return new Response(JSON.stringify(familyGroup), {
      status: 201,
    });
  } catch (error) {
    console.error('Create family group error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create family group' }), {
      status: 500,
    });
  }
};
