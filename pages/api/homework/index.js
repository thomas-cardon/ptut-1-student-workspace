import withSession from "../../../lib/session";
import { query } from '../../../lib/db';

async function handler(req, res, session) {
  if (!req?.session?.get('user')) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });
  if (!req.session.get('user').group?.id) return res.send({ homework: [], success: true });

  try {
    const data = await query(
      `
      SELECT homework.id, timestamp, content, subjects.module, subjects.name
      FROM homework
      INNER JOIN subjects ON homework.subjectId = subjects.id
      WHERE homework.groupId = ?
      ORDER BY timestamp ASC
      `, [req.session.get('user').group.id]);

    res.json(data);

  }
  catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
}

export default withSession(handler);
