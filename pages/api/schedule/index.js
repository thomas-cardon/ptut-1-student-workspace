import withSession from "../../../lib/session";
import { query } from '../../../lib/db';
import { isFuture, addMinutes } from 'date-fns';

async function handler(req, res, session) {
  const user = req.session.get('user');
  if (!user || user.userType == 0) return res.status(401).send('NOT_AUTHORIZED');

  const { filterByGroup, filterByTeacher, omitPassedEntries } = req.query;

  try {
    let params = [];
    if (filterByGroup && filterByTeacher) params = [filterByGroup, filterByTeacher];
    else if (filterByGroup) params = [filterByGroup];
    else if (filterByTeacher) params = [filterByTeacher];

    let schedule = await query(
      `
      SELECT schedule.id, start, duration, subjectId, room, schedule.groupId, meetingUrl, subjects.module, subjects.name as subjectName, color as moduleColor, firstName AS teacherFirstName, lastName as teacherLastName, email as teacherEmail, schedule.teacherId, groups.name as groupName FROM schedule
      INNER JOIN users ON teacherId = users.userId
      INNER JOIN subjects ON subjectId = subjects.id
      LEFT OUTER JOIN groups ON schedule.groupId = groups.id
      ${filterByGroup ? 'WHERE schedule.groupId = ?' : ''}
      ${filterByTeacher ? 'WHERE schedule.teacherId = ?' : ''}
      ORDER BY start ASC
      `, params);

    if (omitPassedEntries)
      schedule = schedule.filter(x => isFuture(addMinutes(Date.parse(x.start), x.duration)));

    res.send({ schedule, success: true });
  }
  catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
}

export default withSession(handler);
