import withSession from '../../../../lib/session';
import { query } from '../../../../lib/db';

async function handler(req, res, session) {
  const array = req.body;

  if (!req?.session?.get('user') || (req.session.get('user').delegate !== true && req.session.get('user').userType === 0)) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });
  if (!array || !Array.isArray(array) || array.length === 0) return res.status(400).send({ error: 'MISSING_PARAMETERS', success: false });

  try {
    await Promise.all(array.map(({ id, key, value }) => {
      return query('REPLACE INTO ade_meta VALUES (null, ?, ?, ?)', [id, key, value]);
    }));

    res.status(200).send({ success: true });
  }
  catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
}

export default withSession(handler);
