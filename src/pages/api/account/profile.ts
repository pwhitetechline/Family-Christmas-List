import type { APIRoute } from 'astro';
import prisma from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';

export const PUT: APIRoute = async ({ request }) => {
  try {
    const userId = await verifyToken(request);
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    const { name, email } = await request.json();

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== userId) {
      return new Response(JSON.stringify({ error: 'Email is already taken' }), {
        status: 400,
      });
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
      },
      select: {
        name: true,
        email: true,
      },
    });

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update profile' }), {
      status: 500,
    });
  }
};
