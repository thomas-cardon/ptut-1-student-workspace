import withSession from '../../../lib/session';
import { query } from '../../../lib/db';

async function handler(req, res) {
  const user = req.session.get('user');
  if (!user) return res.status(401).send('NOT_AUTHORIZED');

  try {
    const grades = await query(`
      SELECT grades.userId, teacherId, classId, name, value, max, coefficient, UE, user.firstName AS userFirstName, user.lastName as userLastName, teacher.firstName AS teacherFirstName, user.lastName as teacherLastName FROM grades
      INNER JOIN users user ON grades.userId = user.userId
      INNER JOIN users teacher ON grades.teacherId = user.userId
    `);
    res.json({ grades, success: true });
  }
  catch (e) {
    res.status(500).json({ error: e.message, success: false });
  }
}

export default withSession(handler);
