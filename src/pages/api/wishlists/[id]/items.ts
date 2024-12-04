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

    const wishlistId = params.id;
    if (!wishlistId) {
      return new Response(JSON.stringify({ error: 'Wishlist ID is required' }), {
        status: 400,
      });
    }

    // Verify wishlist ownership
    const wishlist = await prisma.wishlist.findUnique({
      where: { id: wishlistId },
    });

    if (!wishlist || wishlist.userId !== userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    const { name, description, url, price, priority } = await request.json();

    const item = await prisma.wishlistItem.create({
      data: {
        name,
        description,
        url,
        price: price ? parseFloat(price) : null,
        priority: parseInt(priority),
        wishlistId,
      },
    });

    return new Response(JSON.stringify(item), {
      status: 201,
    });
  } catch (error) {
    console.error('Create item error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create item' }), {
      status: 500,
    });
  }
};
