import type { APIRoute } from 'astro';
import prisma from '../../../../../lib/db';
import { verifyToken } from '../../../../../lib/auth';

export const POST: APIRoute = async ({ request, params }) => {
  try {
    const userId = await verifyToken(request);
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    const itemId = params.id;
    if (!itemId) {
      return new Response(JSON.stringify({ error: 'Item ID is required' }), {
        status: 400,
      });
    }

    const purchase = await prisma.purchase.create({
      data: {
        itemId,
        userId,
      },
    });

    return new Response(JSON.stringify(purchase), {
      status: 201,
    });
  } catch (error) {
    console.error('Purchase error:', error);
    return new Response(JSON.stringify({ error: 'Failed to mark item as purchased' }), {
      status: 500,
    });
  }
};
