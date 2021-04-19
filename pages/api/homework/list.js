import withSession from "../../../lib/session";
import { query } from '../../../lib/db';

async function handler(req, res, session) {
  if (!req?.session?.get('user') || req?.session?.get('user')?.userType === 0) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  try {
    const data = await query(
      `
      SELECT homework.id, timestamp, description, isDone, subjects.module, subjects.name, users.firstName, users.lastName
      FROM homework
      INNER JOIN subjects ON homework.subjectId = subjects.id
      INNER JOIN users ON users.userId = homework.userId
      ORDER BY timestamp DESC
      LIMIT 10
      `
    );

    res.json({ homework: data, success: true });

  }
  catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
}

export default withSession(handler);
