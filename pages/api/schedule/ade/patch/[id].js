import withSession from '../../../../../lib/session';
import { query } from '../../../../../lib/db';

async function handler(req, res, session) {
  const { key, value } = req.body;
  const { id } = req.query;

  if (!req?.session?.get('user') || (req.session.get('user').delegate !== true && req.session.get('user').userType === 0)) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });
  if (!id) return res.status(400).send({ error: 'MISSING_PARAMETERS', success: false });

  try {
    let schedule = await query('REPLACE INTO ade_meta VALUES (null, ?, ?, ?)', [id, key, value]);
    res.status(200).send({ success: true });
  }
  catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
}

export default withSession(handler);
