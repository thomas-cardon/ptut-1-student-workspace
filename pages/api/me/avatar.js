import withSession from "../../../lib/session";
import { query } from '../../../lib/db';

async function handler(req, res) {
  if (!req?.session?.get('user')) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  try {
    await query(`
      UPDATE users
      SET avatar = ?
      WHERE userId = ?`, [req.body.avatar, req.session.get('user').userId]);

    res.send({ success: true });
  }
  catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message, success: false });
  }
}

export default withSession(handler);
