import withSession from '../../../../lib/session';
import { query } from '../../../../lib/db';

async function handler(req, res, session) {
  if (!req?.session?.get('user') || (req.session.get('user').delegate !== true && req.session.get('user').userType === 0)) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  try {
    let schedule = await query('DELETE FROM ade_cache');
    res.status(200).send({ success: true });
  }
  catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
}

export default withSession(handler);
