import withSession from '../../../../lib/session';
import { query } from '../../../../lib/db';

async function handler(req, res, session) {
  try {
    let events = await query('SELECT * FROM ade_meta ORDER BY id DESC LIMIT 1000');
    res.status(200).send(events);
  }
  catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
}

export default withSession(handler);
