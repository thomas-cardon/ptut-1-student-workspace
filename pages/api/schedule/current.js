import withSession from "../../../lib/session";
import { query } from '../../../lib/db';
import { isFuture, isWithinInterval, addMinutes } from 'date-fns';

async function handler(req, res, session) {
  if (!req?.session?.get('user')) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  console.log('Schedule');

  try {
    let schedule = await query(
      `
      SELECT schedule.id, start, duration, subjectId, room, schedule.groupId, meetingUrl, subjects.module, subjects.name as subjectName, color as moduleColor, firstName AS teacherFirstName, lastName as teacherLastName, email as teacherEmail, schedule.teacherId, groups.name as groupName FROM schedule
      INNER JOIN users ON teacherId = users.userId
      INNER JOIN subjects ON subjectId = subjects.id
      LEFT OUTER JOIN groups ON schedule.groupId = groups.id
      WHERE schedule.groupId = ?
      ORDER BY start ASC
    `, [req.session.get('user').group.id]);

    let current = schedule
    .filter(x => isWithinInterval(new Date(), {
      start: new Date(x.start * 1000),
      end: addMinutes(new Date(x.start * 1000), x.duration)
    }));

    if (current[0]) {
      current[0].students = await query(
        `
        SELECT email, birthDate, firstName, lastName FROM users WHERE groupId = ?
      `, [req.session.get('user').group.id]);
    }

    let next = schedule.filter(x => isFuture(addMinutes(new Date(x.start * 1000), x.duration)));

    if (current[0]) res.send(current[0]);
    else res.status(404).send({ error: 'NOT_FOUND', success: false });
  }
  catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
}

export default withSession(handler);
