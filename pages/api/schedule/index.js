import withSession from "../../../lib/session";
import { query } from '../../../lib/db';

async function handler(req, res, session) {
  const user = req.session.get('user');
  if (!user || user.userType == 0) return res.status(401).send('NOT_AUTHORIZED');

  const { filterByGroup, filterByTeacher } = req.query;

  try {
    let params = [];
    if (filterByGroup && filterByTeacher) params = [filterByGroup, filterByTeacher];
    else if (filterByGroup) params = [filterByGroup];
    else if (filterByTeacher) params = [filterByTeacher];

    const schedule = await query(
      `
      SELECT schedule.id, start, duration, classId, schedule.groupId, meetingUrl, classes.module, classes.name as moduleName, color as moduleColor, firstName AS teacherFirstName, lastName as teacherLastName, email as teacherEmail, schedule.teacherId, groups.name as groupName FROM schedule
      INNER JOIN users ON teacherId = users.userId
      INNER JOIN classes ON classId = classes.id
      LEFT OUTER JOIN groups ON schedule.groupId = groups.id
      ${filterByGroup ? 'WHERE schedule.groupId = ?' : ''}
      ${filterByTeacher ? 'WHERE schedule.teacherId = ?' : ''}
      ORDER BY start ASC
      `, params);

    if (schedule.length > 0) res.send({ schedule, success: true });
    else res.status(404).send({ message: 'NOT_FOUND', success: false });
  }
  catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
}

export default withSession(handler);
