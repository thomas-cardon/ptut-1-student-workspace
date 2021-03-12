import withSession from "../../../lib/session";
import { query } from '../../../lib/db';

async function handler(req, res, session) {
  if (!req?.session?.get('user')) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  try {
    for (let i = 0; i < req.body.concernedGroups.length; i++) {
      const results = await query(
        `
        INSERT INTO schedule (start, duration, subjectId, teacherId, groupId)
        VALUES (?, ?, ?, ?, ?)`,
        [req.body.start, req.body.duration, req.body.subjectId, req.body.teacherId, req.body.concernedGroups[i]]);
    }

    res.send({ success: true });
  }
  catch (error) {
    res.status(500).json({ error: error.message || error, success: false });
  }
}

export default withSession(handler);
