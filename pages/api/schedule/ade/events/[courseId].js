import withSession from '../../../../../lib/session';
import { query } from '../../../../../lib/db';

async function handler(req, res) {
  if (!req?.session?.get('user')) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  const user = req.session.get('user');
  const course = req.query.courseId;

  if (!course) return res.status(401).send({ error: 'WRONG_PARAMETERS', success: false });

  try {
    let events = await query(`
      SELECT * FROM ade_meta
      WHERE uid = ?
      ORDER BY id DESC
      LIMIT 1000`, [course]);

    res.status(200).send(events);
  }
  catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
}

export default withSession(handler);
