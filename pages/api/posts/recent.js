import { withIronSession } from 'next-iron-session';
import { query } from '../../../lib/db';

async function handler(req, res, session) {
  const user = req.session.get('user');
  if (!user || user.userType == 0) return res.status(401).send('NOT_AUTHORIZED');

  try {
    const data = await query(
      `
      SELECT posts.id, userId, title, content, creation_time, module, classId
      FROM posts INNER JOIN classes ON posts.classId = classes.id
      ORDER BY creation_time DESC
      LIMIT 1, 10
      `
    );

    res.send({ data, success: true });
  }
  catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
}

export default withIronSession(handler, {
  cookieName: "ptut-1/sessions/v1",
  password: process.env.SECRET_COOKIE_PASSWORD,
  // La sécurisation s'active que si Node.js n'est pas en mode développement (il est en production quand c'est Vercel qui l'héberge)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});
