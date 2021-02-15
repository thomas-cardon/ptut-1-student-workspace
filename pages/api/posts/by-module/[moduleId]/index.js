import { withIronSession } from 'next-iron-session';
import { query } from '../../../../../lib/db';

async function handler(req, res, session) {
  const user = req.session.get('user');
  if (!user || user.userType == 0) return res.status(401).send('NOT_AUTHORIZED');

  try {
    const data = await query(
      `
      SELECT id, userId, title, content, creation_time, moduleId, classes.name as moduleName, classes.classId
      FROM posts INNER JOIN classes ON classes.classId = posts.classId
      WHERE classes.moduleId = ?
      ORDER BY creation_time, id DESC
      LIMIT 1, 10
      `, req.query.moduleId);

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
