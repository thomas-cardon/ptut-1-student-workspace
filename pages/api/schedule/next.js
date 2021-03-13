import withSession from "../../../lib/session";
import { query } from '../../../lib/db';
import { isFuture, addMinutes } from 'date-fns';

async function handler(req, res, session) {
  if (!req?.session?.get('user')) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  try {
    let schedule = await query(
      `
      SELECT schedule.id, start, duration, subjectId, room, schedule.groupId, meetingUrl, subjects.module, subjects.name as subjectName, color as moduleColor, firstName AS teacherFirstName, lastName as teacherLastName, email as teacherEmail, schedule.teacherId, groups.name as groupName FROM schedule
      INNER JOIN users ON teacherId = users.userId
      INNER JOIN subjects ON subjectId = subjects.id
      LEFT OUTER JOIN groups ON schedule.groupId = groups.id
      WHERE schedule.groupId = ?
      ORDER BY start ASC
      LIMIT 1
    `, [req.session.get('user').group.id]);

    schedule = schedule.filter(x => isFuture(addMinutes(Date.parse(x.start), x.duration)));

    if (schedule.length > 0) res.send({ data: schedule[0], success: true });
    else res.status(404).send({ error: 'NOT_FOUND', success: false });
  }
  catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
}

export default withSession(handler);
