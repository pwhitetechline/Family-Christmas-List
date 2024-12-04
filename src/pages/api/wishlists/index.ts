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

    const wishlists = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        items: true,
      },
    });

    return new Response(JSON.stringify(wishlists), {
      status: 200,
    });
  } catch (error) {
    console.error('Get wishlists error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get wishlists' }), {
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

    const { title } = await request.json();

    const wishlist = await prisma.wishlist.create({
      data: {
        title,
        userId,
      },
    });

    return new Response(JSON.stringify(wishlist), {
      status: 201,
    });
  } catch (error) {
    console.error('Create wishlist error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create wishlist' }), {
      status: 500,
    });
  }
};
