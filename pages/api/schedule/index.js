import withSession from "../../../lib/session";
import { query } from '../../../lib/db';

async function handler(req, res, session) {
  const user = req.session.get('user');
  if (!user || user.userType == 0) return res.status(401).send('NOT_AUTHORIZED');

  const { filterByGroup } = req.query;

  try {
    const schedule = await query(
      `
      SELECT schedule.id, start, duration, classId, schedule.groupId, meetingUrl, module, name as moduleName, color as moduleColor, firstName AS teacherFirstName, lastName as teacherLastName, email as teacherEmail FROM schedule
      INNER JOIN users ON teacherId = users.userId
      INNER JOIN classes ON classId = classes.id
      ${filterByGroup ? 'WHERE schedule.groupId = ?' : ''}
      ORDER BY start ASC
      `, [user.group.id]);

    res.send({ schedule, success: true });
  }
  catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
}

export default withSession(handler);
