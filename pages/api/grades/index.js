import withSession from '../../../lib/session';
import { query } from '../../../lib/db';

async function handler(req, res) {
  const user = req.session.get('user');
  if (user.userType === 0 && (!req.query.id || req.query.id !== user.userId)) return res.status(401).send('NOT_AUTHORIZED');

  try {
    let data = {}, q = await query(`
      SELECT grades.id, teacherId, teachers.firstName as teacherFirstName, teachers.lastName as teacherLastName, subjectId, subjects.name as subjectName, subjects.module as subjectModule, subjects.color as subjectColor, grades.name, studentGrades.value, studentGrades.wasAbsent, studentGrades.notes, max, coefficient, UE, grades.date, users.firstName as userFirstName, users.lastName as userLastName, users.userId as userId, users.groupId as userGroupId, groups.name as userGroupName from grades
      CROSS JOIN users
      LEFT JOIN users teachers ON teachers.userId = teacherId
      LEFT JOIN groups ON groups.id = users.groupId
      LEFT JOIN subjects ON subjects.id = grades.subjectId
      LEFT JOIN studentGrades ON studentGrades.userId = users.userId
      ${req.query.id ? 'WHERE users.userId = ?' : 'WHERE users.userType = 0'}
    `, [req.query.id]);

    for (let entry of q) {
      if (!data[entry.userId]) data[entry.userId] = {};
      data[entry.userId][entry.subjectId] = (data[entry.userId][entry.subjectId] || []).concat(entry);
    }

    if (data !== {}) res.send({ data, success: true });
    else res.status(404).send({ message: 'NOT_FOUND', success: false });
  }
  catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message, success: false });
  }
}

export default withSession(handler);
