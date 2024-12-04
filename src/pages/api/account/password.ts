import type { APIRoute } from 'astro';
import bcrypt from 'bcryptjs';
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

    const { currentPassword, newPassword } = await request.json();

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return new Response(JSON.stringify({ error: 'Current password is incorrect' }), {
        status: 400,
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error('Update password error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update password' }), {
      status: 500,
    });
  }
};
