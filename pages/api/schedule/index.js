import { withIronSession } from 'next-iron-session';
import { query } from '../../../lib/db';

async function handler(req, res, session) {
  const user = req.session.get('user');
  if (!user || user.userType == 0) return res.status(401).send('NOT_AUTHORIZED');

  try {
    const schedule = await query(
      `
      SELECT start, duration, classId, module, name as moduleName, color as moduleColor, firstName AS teacherFirstName, lastName as teacherLastName, email as teacherEmail FROM schedule
      INNER JOIN users ON teacherId = users.userId
      INNER JOIN classes ON classId = classes.id
      ORDER BY start ASC
      `, [user.group.id]);

    res.send({ schedule, success: true });
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
