import withSession from '../../../../lib/session';
import { query } from '../../../../lib/db';
import validate from 'validate.js';

async function handler(req, res) {
  if (!req?.session?.get('user')) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  try {
    if (req.method === 'GET') {
      const users = await query(`
        SELECT avatar FROM users
        WHERE userId = ?`, req.query.userId);

      if (users.length > 0) res.send({ data: users[0].avatar });
      else res.status(404).send({ message: 'NOT_FOUND', success: false });
    }
    else res.send({ success: false });
  }
  catch (e) {
    res.status(500).json({ error: e.message, success: false });
  }
}

export default withSession(handler);
