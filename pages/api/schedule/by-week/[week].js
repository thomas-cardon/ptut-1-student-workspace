import withSession from '../../../../lib/session';
import { query } from '../../../../lib/db';

import { isFuture, addMinutes, addDays } from 'date-fns';
import { getDateOfISOWeek } from '../../../../lib/date';

async function handler(req, res, session) {
  if (!req?.session?.get('user')) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });
  if (isNaN(req.query.week)) return res.status(400).send({ error: 'WEEK_NAN', success: false });

  const { filterByGroup, filterByTeacher, omitPassedEntries } = req.query;

  try {
    let params = [parseInt(req.query.week), filterByGroup, filterByTeacher].filter(x => x && x != 0);
    let schedule = await query(
      `
      SELECT start, duration, subjectId, room, schedule.groupId, meetingUrl, subjects.module, subjects.name as subjectName, color, firstName AS teacherFirstName, lastName as teacherLastName, email as teacherEmail, schedule.teacherId, groups.id as groupId, groups.name as groupName
      FROM schedule
      INNER JOIN users ON teacherId = users.userId
      INNER JOIN subjects ON subjectId = subjects.id
      LEFT OUTER JOIN groups ON schedule.groupId = groups.id
      ${filterByGroup && filterByGroup != 0 ? 'WHERE schedule.groupId = ?' : ''}
      ${filterByTeacher && filterByTeacher != 0 ? 'WHERE schedule.teacherId = ?' : ''}
      WHERE WEEK(FROM_UNIXTIME(start)) = ?
      ORDER BY start ASC
      `, params);

    schedule = schedule.map(o => ({
      start: new Date(o.start * 1000),
      end: addMinutes(new Date(o.start * 1000), o.duration),
      duration: o.duration,
      subject: { id: o.subjectId, name: o.subjectName, module: o.module, color: o.color },
      teacher: { firstName: o.teacherFirstName, lastName: o.teacherLastName, email: o.teacherEmail, id: o.teacherId },
      meetingUrl: o.meetingUrl,
      groups: [{ id: o.groupId, name: o.groupName }],
      room: o.room
    }));

    let results = {};
    for (let i = 0; i < schedule.length; i++) {
      if (results[`${schedule[i].start}-${schedule[i].subject.id}-${schedule[i].teacher.id}`]) results[`${schedule[i].start}-${schedule[i].subject.id}-${schedule[i].teacher.id}`].groups.push(schedule[i].groups[0]);
      else results[`${schedule[i].start}-${schedule[i].subject.id}-${schedule[i].teacher.id}`] = schedule[i];
    }

    if (omitPassedEntries === '1')
      schedule = schedule.filter(o => isFuture(addMinutes(new Date(o.start * 1000), o.duration)));

    res.send(Object.values(results));
  }
  catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
}

export default withSession(handler);
