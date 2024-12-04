import type { APIRoute } from 'astro';
import prisma from '../../../../lib/db';
import { verifyToken } from '../../../../lib/auth';

export const POST: APIRoute = async ({ request, params }) => {
  try {
    const userId = await verifyToken(request);
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    const groupId = params.id;
    if (!groupId) {
      return new Response(JSON.stringify({ error: 'Group ID is required' }), {
        status: 400,
      });
    }

    // Verify the user is an admin of the group
    const membership = await prisma.familyGroupMember.findFirst({
      where: {
        userId,
        familyGroupId: groupId,
        role: 'admin',
      },
    });

    if (!membership) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    const { email } = await request.json();

    // Find or create user
    const invitedUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!invitedUser) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    // Check if user is already a member
    const existingMembership = await prisma.familyGroupMember.findFirst({
      where: {
        userId: invitedUser.id,
        familyGroupId: groupId,
      },
    });

    if (existingMembership) {
      return new Response(JSON.stringify({ error: 'User is already a member' }), {
        status: 400,
      });
    }

    // Add user to group
    const newMembership = await prisma.familyGroupMember.create({
      data: {
        userId: invitedUser.id,
        familyGroupId: groupId,
        role: 'member',
      },
    });

    return new Response(JSON.stringify(newMembership), {
      status: 201,
    });
  } catch (error) {
    console.error('Invite member error:', error);
    return new Response(JSON.stringify({ error: 'Failed to invite member' }), {
      status: 500,
    });
  }
};
