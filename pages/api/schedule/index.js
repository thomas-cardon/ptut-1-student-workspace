import withSession from "../../../lib/session";
import { query } from '../../../lib/db';
import { isFuture, addMinutes } from 'date-fns';

async function handler(req, res, session) {
  if (!req?.session?.get('user')) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });
  const { filterByGroup, filterByTeacher, omitPassedEntries } = req.query;

  console.log(filterByGroup, filterByTeacher, omitPassedEntries);

  try {
    let params = [filterByGroup, filterByTeacher].filter(x => x && x != 0);
    let schedule = await query(
      `
      SELECT schedule.id, start, duration, subjectId, room, schedule.groupId, meetingUrl, subjects.module, subjects.name as subjectName, color as moduleColor, firstName AS teacherFirstName, lastName as teacherLastName, email as teacherEmail, schedule.teacherId, groups.name as groupName FROM schedule
      INNER JOIN users ON teacherId = users.userId
      INNER JOIN subjects ON subjectId = subjects.id
      LEFT OUTER JOIN groups ON schedule.groupId = groups.id
      ${filterByGroup && filterByGroup != 0 ? 'WHERE schedule.groupId = ?' : ''}
      ${filterByTeacher && filterByTeacher != 0 ? 'WHERE schedule.teacherId = ?' : ''}
      ORDER BY start ASC
      `, params);

    schedule = schedule.map(o => ({ ...o, start: new Date(o.start * 1000), end: addMinutes(new Date(o.start * 1000), o.duration) }));

    if (omitPassedEntries === '1')
      schedule = schedule.filter(o => isFuture(addMinutes(new Date(o.start * 1000), o.duration)));

    res.send(schedule);
  }
  catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
}

export default withSession(handler);
