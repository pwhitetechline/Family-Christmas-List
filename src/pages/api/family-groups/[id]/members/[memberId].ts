import type { APIRoute } from 'astro';
import prisma from '../../../../../lib/db';
import { verifyToken } from '../../../../../lib/auth';

export const DELETE: APIRoute = async ({ request, params }) => {
  try {
    const userId = await verifyToken(request);
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    const { id: groupId, memberId } = params;
    if (!groupId || !memberId) {
      return new Response(JSON.stringify({ error: 'Group ID and Member ID are required' }), {
        status: 400,
      });
    }

    // Verify the user is an admin of the group
    const adminMembership = await prisma.familyGroupMember.findFirst({
      where: {
        userId,
        familyGroupId: groupId,
        role: 'admin',
      },
    });

    if (!adminMembership) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    // Delete the membership
    await prisma.familyGroupMember.delete({
      where: {
        id: memberId,
      },
    });

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error('Remove member error:', error);
    return new Response(JSON.stringify({ error: 'Failed to remove member' }), {
      status: 500,
    });
  }
};

export const PATCH: APIRoute = async ({ request, params }) => {
  try {
    const userId = await verifyToken(request);
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    const { id: groupId, memberId } = params;
    if (!groupId || !memberId) {
      return new Response(JSON.stringify({ error: 'Group ID and Member ID are required' }), {
        status: 400,
      });
    }

    // Verify the user is an admin of the group
    const adminMembership = await prisma.familyGroupMember.findFirst({
      where: {
        userId,
        familyGroupId: groupId,
        role: 'admin',
      },
    });

    if (!adminMembership) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    const { role } = await request.json();
    if (!['admin', 'member'].includes(role)) {
      return new Response(JSON.stringify({ error: 'Invalid role' }), {
        status: 400,
      });
    }

    // Update the membership
    const updatedMembership = await prisma.familyGroupMember.update({
      where: {
        id: memberId,
      },
      data: {
        role,
      },
    });

    return new Response(JSON.stringify(updatedMembership), {
      status: 200,
    });
  } catch (error) {
    console.error('Update member role error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update member role' }), {
      status: 500,
    });
  }
};
