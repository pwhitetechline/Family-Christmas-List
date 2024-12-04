import jwt from 'jsonwebtoken';

export async function verifyToken(request: Request): Promise<string | null> {
  const cookie = request.headers.get('cookie');
  if (!cookie) return null;

  const token = cookie
    .split(';')
    .find(c => c.trim().startsWith('token='))
    ?.split('=')[1];

  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.AUTH_SECRET || 'your-development-secret-key-change-in-production'
    ) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}
