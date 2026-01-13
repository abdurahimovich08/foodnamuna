import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminFromRequest, getAdminUserById } from '../utils/admin-auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = getAdminFromRequest(req);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const adminUser = await getAdminUserById(session.adminId);
    if (!adminUser) {
      return res.status(401).json({ error: 'Admin user not found' });
    }

    return res.status(200).json({
      admin: {
        id: adminUser.id,
        username: adminUser.username,
        role: adminUser.role,
        must_change_password: adminUser.must_change_password,
      },
    });
  } catch (error) {
    console.error('Me error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
