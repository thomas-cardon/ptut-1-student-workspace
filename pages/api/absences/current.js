import withSession from '../../../lib/session';
import { query } from '../../../lib/db';
import { isFuture, isWithinInterval, addMinutes } from 'date-fns';

import fetch from 'isomorphic-unfetch';

async function handler(req, res) {
  if (!req?.session?.get('user')) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  try {
    let schedule = await query(
      `
      SELECT schedule.id, start, duration, subjectId, room, schedule.groupId, meetingUrl FROM schedule
      WHERE schedule.groupId = ?
      ORDER BY start ASC
    `, [req.session.get('user').group.id]);

    let current = schedule
    .filter(x => isWithinInterval(new Date(), {
      start: new Date(x.start * 1000),
      end: addMinutes(new Date(x.start * 1000), x.duration)
    }));

    if (current[0]) {
      let q = await query(`
        SELECT userId, scheduleId, reasonId, justified from absences
        WHERE scheduleId = ?
      `, [current[0].id]);

      res.send({ ...current[0], ...q });
    }
    else res.status(404).send({ error: 'NOT_FOUND', success: false });
  }
  catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message, success: false });
  }

  try {

    res.send(data);
  }
  catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message, success: false });
  }
}

export default withSession(handler);
