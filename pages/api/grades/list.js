import withSession from '../../../lib/session';
import { query } from '../../../lib/db';

async function handler(req, res) {
  const user = req.session.get('user');
  if (user.userType === 0 && (!req.query.id || req.query.id !== user.userId)) return res.status(401).send('NOT_AUTHORIZED');

  try {
    let data = {}, q = await query(`
      SELECT grades.id, teacherId, subjectId, name, studentGrades.value, studentGrades.wasAbsent, studentGrades.notes, max, coefficient, UE, users.firstName as userFirstName, users.lastName as userLastName, users.userId as userId from grades
      CROSS JOIN users
      LEFT JOIN studentGrades ON studentGrades.userId = users.userId
      ${req.query.id ? 'WHERE users.userId = ?' : ''}
    `, [req.query.id]);

    for (let entry of q)
      data[entry.userId] = entry;

    if (data !== {}) res.send({ data, success: true });
    else res.status(404).send({ message: 'NOT_FOUND', success: false });
  }
  catch (e) {
    res.status(500).json({ error: e.message, success: false });
  }
}

export default withSession(handler);
