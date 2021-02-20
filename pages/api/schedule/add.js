import { withIronSession } from 'next-iron-session';
import { query } from '../../../lib/db';

async function handler(req, res, session) {
  const user = req.session.get('user');
  if (!user || user.userType == 0) return res.status(401).send('NOT_AUTHORIZED');

  try {
    for (let i = 0; i < req.body.concernedGroups.length; i++) {
      const results = await query(
        `
        INSERT INTO schedule (start, duration, classId, teacherId, groupId)
        VALUES (?, ?, ?, ?, ?)`,
        [req.body.start, req.body.duration, req.body.classId, req.body.teacherId, req.body.concernedGroups[i]]);
    }

    res.send({ success: true });
  }
  catch (error) {
    res.status(500).json({ error: error.message || error, success: false });
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
