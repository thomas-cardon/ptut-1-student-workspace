import { withIronSession } from 'next-iron-session';
import { query } from '../../../lib/db';

async function handler(req, res, session) {
  const user = req.session.get('user');
  if (!user || user.userType == 0) return res.status(401).send('NOT_AUTHORIZED');

  try {
    const data = await query(
      `
      SELECT posts.id, posts.userId, title, content, creation_time, module, classId, firstName, lastName, email, userType FROM posts
      INNER JOIN classes ON posts.classId = classes.id
      INNER JOIN users ON users.userId = posts.userId
      ${req.query.module ? 'WHERE module = "' + req.query.module + '"' : ''}
      ORDER BY creation_time DESC
      LIMIT 10
      `
    );

    if (data.length > 0) res.send({ data, success: true });
    else res.status(404).send({ message: 'NOT_FOUND', success: false });
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
