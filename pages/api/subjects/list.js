import withSession from '../../../lib/session';
import { query } from '../../../lib/db';

async function handler(req, res) {
  if (!req?.session?.get('user')) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  try {
    const subjects = await query(`SELECT * FROM subjects ORDER BY module ASC`);
    res.json({ subjects, success: true });
  }
  catch (e) {
    res.status(500).json({ error: e.message, success: false });
  }
}

export default withSession(handler);
